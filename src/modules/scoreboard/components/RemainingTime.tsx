import { DigitDisplay } from "./DigitDisplay";
import styles from "./RemainingTime.module.scss";

interface IProps {
  value: number;
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
    <div className={styles.remainingTimeCon}>
      <DigitDisplay value={getMin()} color="red"/>:<DigitDisplay value={getSec()} color="red"/>
    </div>
  );
}
