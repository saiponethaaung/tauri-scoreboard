import { invoke } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";
import { useEffect, useRef } from "react";
import { ShortClock } from "./components/ShortClock";
import { Round } from "./components/Round";
import { RemainingTime } from "./components/RemainingTime";
import styles from "./ScoreboardScreen.module.scss";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  playTicker,
  stopTicker,
  updateScore,
  updateTicker,
} from "./data.state";
import { ScoreInitData, TickerData } from "./interfaces";
import { ActionIcon } from "./components/ActionIcon";
import { ScoreAction } from "./components/ScoreAction";
import { ScoreInfo } from "./components/ScoreInfo";

export default function () {
  const config = useSelector((state: RootState) => state.scoreConfigReducer);
  const data = useSelector((state: RootState) => state.scoreDataReducer);
  const refData = useRef(data);
  const refConfig = useRef(config);
  const dispatch = useDispatch();

  const keyPressListener = (e: KeyboardEvent) => {
    e.preventDefault();
    switch (e.key.toLowerCase()) {
      case "w":
        whistle();
        break;

      case "a":
        airHorn();
        break;

      case "p":
        console.log("play trigger", refData.current.play);
        if (refData.current.play) {
          console.log("stop ticker2");
          stop();
        } else {
          play();
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    refData.current = data;
  }, [data]);

  useEffect(() => {
    refConfig.current = config;
  }, [config]);

  useEffect(() => {
    listenEvent();

    window.addEventListener("keypress", keyPressListener);

    return () => {
      console.log("remove event listener");
      window.removeEventListener("keypress", keyPressListener);
    };
  }, []);

  useEffect(() => {
    if (refData.current.play) {
      ticker();
    }
  }, [data.play, data.ticker]);

  const listenEvent = async () => {
    console.log("called");

    await listen("request_score_init_data", async () => {
      const initData: ScoreInitData = {
        ...refData.current,
        teamInfo: {
          one: refConfig.current.team.one,
          two: refConfig.current.team.two,
        },
      };
      await emit("score_init_data", initData);
    });
  };

  const openNewWindow = async () => {
    await invoke("greet");
  };

  const stop = async () => {
    console.log("stop got called");
    dispatch(stopTicker());
  };

  const play = async () => {
    await dispatch(playTicker(config.shortClock));
  };

  const ticker = async () => {
    console.log("play", refData.current.play, data.play);
    if (!refData.current.play) return;

    setTimeout(() => {
      const tickerValue = refData.current.ticker - 1;
      console.log("tickerValue", tickerValue);
      if (tickerValue >= 0) {
        if (tickerValue === 0) {
          whistle();
        }

        const tickerData: TickerData = {
          ticker: tickerValue,
          time: refData.current.time - 1,
        };

        emit("score_ticker", tickerData);
        dispatch(updateTicker(tickerValue));
      } else {
        console.log("stop ticker");
        stop();
      }
    }, 1000);
  };

  async function airHorn() {
    invoke("play_airhorn");
  }

  async function whistle() {
    invoke("play_whistle");
  }

  async function teamScore(team: "one" | "two", value: number) {
    const newValue = refData.current.team[team].score + value;

    if (newValue < 0) return;

    dispatch(updateScore({ team, value }));
    emit("score_update", {
      team,
      value: refData.current.team[team].score + value,
    });
  }

  return (
    <div>
      <div className={styles.firstRow}>
        <ShortClock value={data.ticker} />
        <div className={styles.timeAction}>
          <div
            onClick={() => {
              if (data.play) {
                stop();
              } else {
                play();
              }
            }}
          >
            {refData.current.play ? "Pause" : "Play"}
          </div>
          <RemainingTime value={data.time} />
        </div>
        <Round value={data.round} />
      </div>

      <div className={styles.secondRow}>
        <ScoreAction callback={(v) => teamScore("one", v)} />
        <ScoreInfo
          team={[
            {
              name: config.team.one.name,
              score: data.team.one.score,
            },
            {
              name: config.team.two.name,
              score: data.team.two.score,
            },
          ]}
        />
        <ScoreAction callback={(v) => teamScore("two", v)} />
      </div>
      <div>
        <div>
          <div onClick={airHorn}>bell</div>
          <div onClick={whistle}>whistle</div>
        </div>
        <div>
          <div>foul</div>
          <div>foul counter</div>
        </div>
        <div>
          <div>14</div>
          <div>{config.shortClock}</div>
        </div>
      </div>
      <button onClick={openNewWindow} type="button">
        Open
      </button>
    </div>
  );
}
