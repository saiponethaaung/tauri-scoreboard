import { useState } from "react";
import { BaseEditCon } from "./BasedEditCon";

interface IProps {
  value: string;
  callback: (value: string) => void;
}

export function ShortClockEditCon({ value, callback }: IProps) {
  const [data, setData] = useState(value);
  const save = () => {
    callback(data);
  };

  return (
    <BaseEditCon title="Edit Short Clock" callback={save}>
      <label>
        <div>Short Clock</div>
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
