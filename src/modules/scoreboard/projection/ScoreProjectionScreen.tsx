import { emit, Event, listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { ScoreInitData, TickerData } from "../interfaces";
import styles from "./ScoreProjectionScreen.module.scss";
import { ShortClock } from "../components/ShortClock";
import { RemainingTime } from "../components/RemainingTime";
import { Round } from "../components/Round";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  setData,
  updateScore,
  updateTime,
} from "./ScoreProjectionScreen.state";
import { ScoreInfo } from "../components/ScoreInfo";

export default function () {
  const data = useSelector((state: RootState) => state.scoreDisplayReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    listenEvent();
    requestData();
  }, []);

  const requestData = async () => {
    emit("request_score_init_data");
  };

  const listenEvent = async () => {
    listen("score_init_data", (d: Event<ScoreInitData>) => {
      dispatch(setData(d.payload));
    });
    listen("score_ticker", (d: Event<TickerData>) => {
      dispatch(updateTime(d.payload));
    });
    listen(
      "score_update",
      (d: Event<{ team: "one" | "two"; value: number }>) => {
        console.log("dispatched updateScore", d.payload.value);
        dispatch(updateScore(d.payload));
      }
    );
  };

  return (
    <div className={styles.scoreProjectionScreen}>
      <div className={styles.firstRow}>
        <ShortClock value={data.ticker} />
        <div className={styles.timeAction}>
          <RemainingTime value={data.time} />
        </div>
        <Round value={data.round} />
      </div>
      <ScoreInfo
        team={[
          {
            name: data.teamInfo.one.name,
            score: data.team.one.score,
          },
          {
            name: data.teamInfo.two.name,
            score: data.team.two.score,
          },
        ]}
      />
      <div></div>
    </div>
  );
}
