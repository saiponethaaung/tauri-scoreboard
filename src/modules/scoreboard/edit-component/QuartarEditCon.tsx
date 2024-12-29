import { useState } from "react";
import { BaseEditCon } from "./BasedEditCon";

interface IProps {
  value: string;
  callback: (value: string) => void;
}

export function QuartarEditCon({ value, callback }: IProps) {
  const [data, setData] = useState(value);
  const save = () => {
    callback(data);
  };

  return (
    <BaseEditCon title="Edit Quartar" callback={save}>
      <label>
        <div>Quartar</div>
        <input
          type="text"
          placeholder="Number only"
          value={data}
          onChange={(e) => {
            setData(e.target.value);
          }}
        />
      </label>
    </BaseEditCon>
  );
}
