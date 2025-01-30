import { DigitDisplay } from "./DigitDisplay";
import styles from "./ScoreInfo.module.scss";

interface IProps {
  team: [
    {
      name: string;
      score: number;
    },
    {
      name: string;
      score: number;
    }
  ];
  scale?: number;
}

export function ScoreInfo({ team, scale }: IProps) {
  return (
    <div
      className={styles.scoreInfo}
      style={
        {
          "--scale": scale ?? 1,
        } as React.CSSProperties
      }
    >
      <div className={styles.scoreTeam}>
        <div className={styles.scoreTeamName}>{team[0].name}</div>
        <DigitDisplay
          value={team[0].score}
          singleDigit={team[0].score < 10}
          fontSize="24vh"
          scale={scale}
        />
      </div>
      <div className={styles.scoreCompare}>X</div>
      <div className={styles.scoreTeam}>
        <div className={styles.scoreTeamName}>{team[1].name}</div>
        <DigitDisplay
          value={team[1].score}
          singleDigit={team[1].score < 10}
          fontSize="24vh"
          scale={scale}
        />
      </div>
    </div>
  );
}
