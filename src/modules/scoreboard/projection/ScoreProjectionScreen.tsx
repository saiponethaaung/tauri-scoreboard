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
  removeSponsor,
  setData,
  updateFoul,
  updateFoulTeam,
  updateRound,
  updateScore,
  updateSponsor,
  updateTeam,
  updateTime,
} from "./ScoreProjectionScreen.state";
import { ScoreInfo } from "../components/ScoreInfo";
import { ActionRow } from "../components/ActionRow";
import { DigitDisplay } from "../components/DigitDisplay";
import { FoulMark } from "../components/FoulAction";

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
        dispatch(updateScore(d.payload));
      }
    );
    listen("sponsor", (d: Event<string>) => {
      console.log("sponsor added");
      dispatch(updateSponsor(d.payload));
    });
    listen("clean_sponsor", () => {
      dispatch(removeSponsor());
    });
    listen(
      "foul_update",
      (d: Event<{ team: "one" | "two"; value: number }>) => {
        dispatch(updateFoul(d.payload));
      }
    );
    listen("foul", (d: Event<"one" | "two" | null>) => {
      dispatch(updateFoulTeam(d.payload));
    });
    listen("team_update", (d: Event<{ teamOne: string; teamTwo: string }>) => {
      dispatch(updateTeam(d.payload));
    });
    listen("round_update", (d: Event<number>) => {
      dispatch(updateRound(d.payload));
    });
  };

  const leftSponsor = () => {
    return data.sponsor.filter((_, i) => i % 2 !== 0);
  };

  const rightSponsor = () => {
    return data.sponsor.filter((_, i) => i % 2 === 0);
  };

  return (
    <div className={styles.scoreProjectionScreen}>
      <div className={styles.firstRow}>
        <ShortClock value={data.ticker} />
        <div className={styles.sponsorCon}>
          {leftSponsor().map((s) => (
            <img src={s} />
          ))}
        </div>
        <div className={styles.timeAction}>
          <RemainingTime value={data.time} />
        </div>
        <div className={styles.sponsorCon}>
          {rightSponsor().map((s) => (
            <img src={s} />
          ))}
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
      <div className={styles.fouls}>
        <FoulMark team={data.foul} callback={() => {}} />
        <ActionRow>
          <ActionRow>
            <DigitDisplay
              color="yellow"
              fontSize="5vw"
              value={data.team.one.foul}
              singleDigit={data.team.one.foul < 10}
            />
          </ActionRow>
          <div style={{ fontSize: "3vw" }}>X</div>
          <ActionRow>
            <DigitDisplay
              color="yellow"
              fontSize="5vw"
              value={data.team.two.foul}
              singleDigit={data.team.two.foul < 10}
            />
          </ActionRow>
        </ActionRow>
      </div>
    </div>
  );
}
