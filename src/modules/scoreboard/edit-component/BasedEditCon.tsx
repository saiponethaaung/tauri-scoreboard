import styles from "./BasedEditCon.module.scss";

interface IProps {
  title: string;
  children: React.ReactNode;
  callback: (data: any) => void;
}

export function BaseEditCon({ title, children, callback }: IProps) {
  return (
    <div className={styles.baseEditCon}>
      <div className={styles.editCon}>
        <div className={styles.editHeading}>{title}</div>
        <div className={styles.editContent}>{children}</div>
        <div className={styles.editFooter}>
          <button onClick={() => callback({})}>Save</button>
        </div>
      </div>
    </div>
  );
}
