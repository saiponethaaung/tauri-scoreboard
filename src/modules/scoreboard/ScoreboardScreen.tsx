import { invoke } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";
import { ChangeEvent, useEffect, useRef } from "react";
import { ShortClock } from "./components/ShortClock";
import { Round } from "./components/Round";
import { RemainingTime } from "./components/RemainingTime";
import styles from "./ScoreboardScreen.module.scss";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  markFoul,
  playTicker,
  removeSponsor,
  stopTicker,
  tickerReset,
  updateFoul,
  updateScore,
  updateSponsor,
  updateTicker,
} from "./data.state";
import { ScoreInitData, TickerData } from "./interfaces";
import { ActionIcon } from "./components/ActionIcon";
import { ScoreAction } from "./components/ScoreAction";
import { ScoreInfo } from "./components/ScoreInfo";
import { ActionRow } from "./components/ActionRow";
import { DigitDisplay } from "./components/DigitDisplay";
import { FoulMark } from "./components/FoulAction";
import whistleIcon from "../../assets/icons/whistle.svg";
import airhornIcon from "../../assets/icons/airhorn.svg";

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

    await listen("request_score_init_data", sendInitData);
  };

  const sendInitData = async () => {
    const initData: ScoreInitData = {
      ...refData.current,
      teamInfo: {
        one: refConfig.current.team.one,
        two: refConfig.current.team.two,
      },
    };
    await emit("score_init_data", initData);
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

  async function teamFoul(team: "one" | "two", value: number) {
    const newValue = refData.current.team[team].foul + value;

    if (newValue < 0) return;

    dispatch(updateFoul({ team, value }));
    emit("foul_update", {
      team,
      value: refData.current.team[team].foul + value,
    });
  }

  async function clockReset(value: number) {
    dispatch(tickerReset(value));
    emit("score_ticker", {
      ticker: value,
      time: refData.current.time,
    });
  }

  async function foulMark(team: "one" | "two" | null) {
    const value = team === data.foul ? null : team;
    dispatch(markFoul(value));
    emit("foul", value);
  }

  async function sponsorUpdate(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const input = e.target;

    if (input.files) {
      const files = Array.from(input.files);

      for (const file of files) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = e.target?.result as string;
          emit("sponsor", data);
          dispatch(updateSponsor(data));
        };

        reader.readAsDataURL(file);
      }
    }
  }

  async function cleanSponsor() {
    emit("clean_sponsor");
    dispatch(removeSponsor());
  }

  async function updateTeam() {
    // let team1 = window.prompt("Enter Team 1 Name", refConfig.current.team.one.name);
  }

  return (
    <div className={styles.sbContainer}>
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
      <div className={styles.thirdRowRoot}>
        <div className={styles.thirdRow}>
          <ActionRow>
            <ActionIcon
              callback={() => {
                airHorn();
              }}
            >
              <img src={airhornIcon} />
            </ActionIcon>
            <ActionIcon
              callback={() => {
                whistle();
              }}
            >
              <img src={whistleIcon} />
            </ActionIcon>
          </ActionRow>
          <div>
            <FoulMark team={data.foul} callback={foulMark} />
            <ActionRow>
              <ActionRow>
                <ActionIcon
                  callback={() => {
                    teamFoul("one", 1);
                  }}
                >
                  +
                </ActionIcon>
                <DigitDisplay
                  color="yellow"
                  fontSize="5vw"
                  value={data.team.one.foul}
                  singleDigit={data.team.one.foul < 10}
                />
                <ActionIcon
                  callback={() => {
                    teamFoul("one", -1);
                  }}
                >
                  -
                </ActionIcon>
              </ActionRow>
              <div style={{ fontSize: "3vw" }}>X</div>
              <ActionRow>
                <ActionIcon
                  callback={() => {
                    teamFoul("two", 1);
                  }}
                >
                  +
                </ActionIcon>
                <DigitDisplay
                  color="yellow"
                  fontSize="5vw"
                  value={data.team.two.foul}
                  singleDigit={data.team.two.foul < 10}
                />
                <ActionIcon
                  callback={() => {
                    teamFoul("two", -1);
                  }}
                >
                  -
                </ActionIcon>
              </ActionRow>
            </ActionRow>
          </div>
          <ActionRow>
            <ActionIcon callback={() => clockReset(14)}>14</ActionIcon>
            <ActionIcon callback={() => clockReset(config.shortClock)}>
              {config.shortClock}
            </ActionIcon>
          </ActionRow>
        </div>
        <div className={styles.actionCon}>
          <button onClick={openNewWindow} type="button">
            Display Screen
          </button>
          <button onClick={cleanSponsor} type="button">
            Clean Sponsors
          </button>
          <button type="button">
            <label>
              Upload Sponsors
              <input
                type="file"
                accept="image/png"
                multiple
                style={{ display: "none" }}
                onChange={sponsorUpdate}
              />
            </label>
          </button>
          <button onClick={updateTeam} type="button">
            Update Team
          </button>
          <button onClick={() => {}} type="button">
            Update Quartar
          </button>
          <button onClick={() => {}} type="button">
            Update Short Clock
          </button>
          <button onClick={() => {}} type="button">
            Update Duration
          </button>
          <button onClick={() => {}} type="button">
            Reset
          </button>
        </div>
      </div>
      {/* <div className={editCon}></div> */}
    </div>
  );
}
