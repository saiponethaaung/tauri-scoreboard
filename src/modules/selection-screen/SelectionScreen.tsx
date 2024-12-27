import { Link } from "wouter";
import styles from "./SelectionScreen.module.scss";

export default function () {
  return (
    <ul className={styles.selectionList}>
      <li>
        <Link to="/scoreboard">Scoreboard</Link>
      </li>
      <li>
        <Link to="/marathon">Marathon Stop Watch</Link>
      </li>
    </ul>
  );
}
