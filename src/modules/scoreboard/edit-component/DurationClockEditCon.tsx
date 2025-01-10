import { useEffect, useState } from "react";
import { BaseEditCon } from "./BasedEditCon";

interface IProps {
  value: string;
  callback: (value: string) => void;
}

export function DurationEditCon({ value, callback }: IProps) {
  const [data, setData] = useState({
    min: 0,
    sec: 0,
  });

  const save = () => {
    callback(`${data.min * 60 + data.sec}`);
  };

  useEffect(() => {
    const sec = parseInt(value);
    setData({ min: Math.floor(sec / 60), sec: sec % 60 });
  }, [value]);

  return (
    <BaseEditCon title="Edit Duration" callback={save}>
      <label>
        <div>Min</div>
        <input
          type="text"
          placeholder="Number only"
          value={data.min}
          onChange={(e) => {
            setData({ min: parseInt(e.target.value), sec: data.sec });
          }}
        />
      </label>
      <label>
        <div>Sec</div>
        <input
          type="text"
          placeholder="Number only"
          value={data.sec}
          onChange={(e) => {
            setData({ sec: parseInt(e.target.value), min: data.min });
          }}
        />
      </label>
    </BaseEditCon>
  );
}
