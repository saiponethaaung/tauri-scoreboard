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
}

export function ScoreInfo({ team }: IProps) {
  return (
    <div className={styles.scoreInfo}>
      <div className={styles.scoreTeam}>
        <div className={styles.scoreTeamName}>{team[0].name}</div>
        <div className={styles.scoreTeamScore}>{team[0].score}</div>
      </div>
      <div className={styles.scoreCompare}>X</div>
      <div className={styles.scoreTeam}>
        <div className={styles.scoreTeamName}>{team[1].name}</div>
        <div className={styles.scoreTeamScore}>{team[1].score}</div>
      </div>
    </div>
  );
}
