import styles from "./DigitDisplay.module.scss";

interface IProps {
  value: string | number;
  color?: string;
  fontSize?: string;
  singleDigit?: boolean;
}
export function DigitDisplay(props: IProps) {
  return (
    <div className={styles.digitDisplayRootCon}>
      <div
        className={styles.digitDisplayCon}
        style={{ "--fontSize": props.fontSize ?? "12vh" } as React.CSSProperties}
      >
        <div className={styles.ddPlaceholder}>0</div>
        <div
          className={styles.ddValue}
          style={{ color: props.color ?? "green" }}
        >
          {props.value.toString()[0]}
        </div>
      </div>

      {props.singleDigit ? null : (
        <div
          className={styles.digitDisplayCon}
          style={
            { "--fontSize": props.fontSize ?? "12vh" } as React.CSSProperties
          }
        >
          <div className={styles.ddPlaceholder}>0</div>
          <div
            className={styles.ddValue}
            style={{ color: props.color ?? "green" }}
          >
            {props.value.toString()[1]}
          </div>
        </div>
      )}
    </div>
  );
}
