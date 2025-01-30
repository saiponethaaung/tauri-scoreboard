import { DigitDisplay } from "./DigitDisplay";

interface IProps {
  value: number;
  scale?: number;
}
export function ShortClock(props: IProps) {
  return (
    <DigitDisplay
      value={props.value.toString().padStart(2, " ")}
      scale={props.scale}
      color="yellow"
    />
  );
}
