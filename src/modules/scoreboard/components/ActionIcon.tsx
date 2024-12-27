import styles from "./ActionIcon.module.scss";

interface IProps {
  children: React.ReactNode;
  callback?: () => void;
}

export function ActionIcon({ children, callback }: IProps) {
  return (
    <div className={styles.actionIconCon} onClick={callback ?? (() => {})}>
      {children}
    </div>
  );
}
