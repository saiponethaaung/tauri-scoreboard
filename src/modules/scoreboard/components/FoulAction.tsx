import styles from "./FoulAction.module.scss";

interface IProps {
  team: "one" | "two" | null;
  callback: (value: "one" | "two" | null) => void;
}

export function FoulMark({ team, callback }: IProps) {
  return (
    <div className={styles.foulMarkCon}>
      <button
        type="button"
        style={{ color: team === "one" ? "red" : "grey" }}
        onClick={() => {
          callback("one");
        }}
      >
        {"<"}
      </button>
      <div>Fouls</div>
      <button
        type="button"
        style={{ color: team === "two" ? "red" : "grey" }}
        onClick={() => {
          callback("two");
        }}
      >
        {">"}
      </button>
    </div>
  );
}
