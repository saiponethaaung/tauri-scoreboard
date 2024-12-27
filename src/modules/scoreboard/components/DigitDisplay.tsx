import styles from "./DigitDisplay.module.scss";

interface IProps {
  value: string | number;
  color?: string;
  fontSize?: string;
}
export function DigitDisplay(props: IProps) {
  return (
    <div className={styles.digitDisplayRootCon}>
      <div
        className={styles.digitDisplayCon}
        style={{ "--fontSize": props.fontSize ?? "8vw" } as React.CSSProperties}
      >
        <div className={styles.ddPlaceholder}>0</div>
        <div
          className={styles.ddValue}
          style={{ color: props.color ?? "white" }}
        >
          {props.value.toString()[0]}
        </div>
      </div>
      <div
        className={styles.digitDisplayCon}
        style={{ "--fontSize": props.fontSize ?? "8vw" } as React.CSSProperties}
      >
        <div className={styles.ddPlaceholder}>0</div>
        <div
          className={styles.ddValue}
          style={{ color: props.color ?? "white" }}
        >
          {props.value.toString()[1]}
        </div>
      </div>
    </div>
  );
}
