import styles from "./ScoreAction.module.scss";
import { ActionIcon } from "./ActionIcon";
import { ActionRow } from "./ActionRow";

interface IProps {
  callback: (value: number) => void;
}
export function ScoreAction({ callback }: IProps) {
  return (
    <div className={styles.scoreAction}>
      <ActionRow>
        <ActionIcon
          callback={() => {
            callback(-1);
          }}
        >
          -1
        </ActionIcon>
        <ActionIcon
          callback={() => {
            callback(+1);
          }}
        >
          +1
        </ActionIcon>
      </ActionRow>
      <ActionRow>
        <ActionIcon
          callback={() => {
            callback(-2);
          }}
        >
          -2
        </ActionIcon>
        <ActionIcon
          callback={() => {
            callback(+2);
          }}
        >
          +2
        </ActionIcon>
      </ActionRow>
      <ActionRow>
        <ActionIcon
          callback={() => {
            callback(-3);
          }}
        >
          -3
        </ActionIcon>
        <ActionIcon
          callback={() => {
            callback(+3);
          }}
        >
          +3
        </ActionIcon>
      </ActionRow>
    </div>
  );
}
