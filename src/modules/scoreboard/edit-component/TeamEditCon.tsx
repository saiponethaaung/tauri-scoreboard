import { useState } from "react";
import { BaseEditCon } from "./BasedEditCon";

interface IProps {
  team1: string;
  team2: string;
  callback: (team1: string, team2: string) => void;
}

export function TeamEditCon({ team1, team2, callback }: IProps) {
  const [data, setData] = useState({ team1, team2 });
  const save = () => {
    callback(data.team1, data.team2);
  };

  return (
    <BaseEditCon title="Edit team info" callback={save}>
      <label>
        <div>Team 1</div>
        <input
          type="text"
          placeholder="Team 1 name"
          value={data.team1}
          onChange={(e) => {
            setData({ ...data, team1: e.target.value });
          }}
        />
      </label>

      <label>
        <div>Team 2</div>
        <input
          type="text"
          placeholder="Team 2 name"
          value={data.team2}
          onChange={(e) => {
            setData({ ...data, team2: e.target.value });
          }}
        />
      </label>
    </BaseEditCon>
  );
}
