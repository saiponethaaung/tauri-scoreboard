import { DigitDisplay } from "./DigitDisplay";
import styles from "./RemainingTime.module.scss";

interface IProps {
  value: number;
  scale?: number;
}

export function RemainingTime(props: IProps) {
  const getMin = () => {
    let min = Math.floor(props.value / 60);

    return min.toString().padStart(2, " ");
  };

  const getSec = () => {
    let min = Math.floor(props.value / 60);
    let second = props.value - 60 * min;

    return second.toString().padStart(2, "0");
  };

  return (
    <div
      className={styles.remainingTimeCon}
      style={
        {
          "--scale": props.scale ?? 1,
        } as React.CSSProperties
      }
    >
      <DigitDisplay value={getMin()} scale={props.scale} color="red" />:
      <DigitDisplay value={getSec()} scale={props.scale} color="red" />
    </div>
  );
}
