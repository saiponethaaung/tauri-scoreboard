import styles from "./Round.module.scss";

interface IProps {
  value: number;
}

export function Round({ value }: IProps) {
  const toOrdinal = (num: number) => {
    switch (num % 10) {
      case 1:
        return `${num}st`;
      case 2:
        return `${num}nd`;
      case 3:
        return `${num}rd`;
      default:
        return `${num}th`;
    }
  };

  return <div className={styles.roundCon}>{toOrdinal(value)}</div>;
}
