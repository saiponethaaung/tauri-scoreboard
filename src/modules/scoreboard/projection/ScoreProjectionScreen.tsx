import { emit, Event, listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { ScoreInitData, TickerData } from "../interfaces";
import styles from "./ScoreProjectionScreen.module.scss";
import { ShortClock } from "../components/ShortClock";
import { RemainingTime } from "../components/RemainingTime";
import { Round } from "../components/Round";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  fontScaleUpdate,
  removeSponsor,
  setData,
  updateFoul,
  updateFoulTeam,
  updateRound,
  updateScore,
  updateTeam,
  updateTime,
} from "./ScoreProjectionScreen.state";
import { ScoreInfo } from "../components/ScoreInfo";
import { ActionRow } from "../components/ActionRow";
import { DigitDisplay } from "../components/DigitDisplay";
import { FoulMark } from "../components/FoulAction";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { BaseDirectory, readDir, readFile } from "@tauri-apps/plugin-fs";
import { documentDir } from "@tauri-apps/api/path";
import { path } from "@tauri-apps/api";

export default function () {
  const data = useSelector((state: RootState) => state.scoreDisplayReducer);
  const [files, setFiles] = useState<Array<string>>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    listenEvent();
    requestData();
    getFiles();

    window.addEventListener("keypress", keyPressListener);

    return () => {
      window.removeEventListener("keypress", keyPressListener);
    };
  }, []);

  const keyPressListener = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case "f":
        fullscreen();
        break;
      default:
        break;
    }
  };

  const fullscreen = async () => {
    const web = WebviewWindow.getCurrent();
    const isFullscreen = await web.isFullscreen();
    web.setFullscreen(!isFullscreen);
  };

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
    listen("sponsor", () => {
      getFiles();
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
    listen("fontscale", (d: Event<number>) => {
      dispatch(fontScaleUpdate(d.payload));
    });
  };

  const getFiles = async () => {
    const results: string[] = [];

    const files = await readDir(`scoreboard/sponsor`, {
      baseDir: BaseDirectory.Document,
    });
    const docDir = await documentDir();

    const sortedFiles = files.sort((a, b) => (a.name > b.name ? 1 : -1));
    for (const f of sortedFiles) {
      if (f.name.split(".")[0] == "") continue;
      const filePath = await path.join(docDir, "scoreboard/sponsor", f.name);
      const file = await readFile(filePath);
      const base64String = uint8ArrayToBase64(file);

      results.push(`data:image/${f.name.split(".")[1]};base64,${base64String}`);
    }

    setFiles(results);
  };

  // Function to Convert Uint8Array to Base64
  function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    let binary = "";
    uint8Array.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    return btoa(binary);
  }

  const leftSponsor = () => {
    return (
      <>
        {files
          .filter((_, i) => i % 2 == 0)
          .map((s) => (
            <img src={s} />
          ))}
      </>
    );
  };

  const rightSponsor = () => {
    return (
      <>
        {files
          .filter((_, i) => i % 2 != 0)
          .map((s) => (
            <img src={s} />
          ))}
      </>
    );
  };

  return (
    <div
      className={styles.scoreProjectionScreen}
      style={
        {
          "--scale": data.fontScale ?? 1,
        } as React.CSSProperties
      }
    >
      <div className={styles.firstRow}>
        <ShortClock value={data.ticker} scale={data.fontScale} />
        <div className={styles.sponsorCon}>{leftSponsor()}</div>
        <div className={styles.timeAction}>
          <RemainingTime value={data.time} scale={data.fontScale} />
        </div>
        <div className={styles.sponsorCon}>{rightSponsor()}</div>
        <Round value={data.round} scale={data.fontScale} />
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
        scale={data.fontScale}
      />
      <div className={styles.fouls}>
        <FoulMark team={data.foul} callback={() => {}} scale={data.fontScale} />
        <ActionRow>
          <ActionRow>
            <DigitDisplay
              color="yellow"
              fontSize="8vh"
              value={data.team.one.foul}
              singleDigit={data.team.one.foul < 10}
              scale={data.fontScale}
            />
          </ActionRow>
          <div
            style={{
              fontSize: `calc(6vh * ${data.fontScale})`,
              margin: "0 15px",
            }}
          >
            X
          </div>
          <ActionRow>
            <DigitDisplay
              color="yellow"
              fontSize="8vh"
              value={data.team.two.foul}
              singleDigit={data.team.two.foul < 10}
              scale={data.fontScale}
            />
          </ActionRow>
        </ActionRow>
      </div>
    </div>
  );
}
