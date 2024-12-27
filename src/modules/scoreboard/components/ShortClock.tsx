import { DigitDisplay } from "./DigitDisplay";

interface IProps {
  value: number;
}
export function ShortClock(props: IProps) {
  return <DigitDisplay value={props.value.toString().padStart(2, " ")} color="yellow"/>;
}
