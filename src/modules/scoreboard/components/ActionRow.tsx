import styles from "./ActionRow.module.scss";

interface IProps {
  children: React.ReactNode;
}

export function ActionRow({ children }: IProps) {
  return <div className={styles.actionRow}>{children}</div>;
}
