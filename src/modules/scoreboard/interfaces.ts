export interface ScoreBoardConfigData {
  configShortClock: number;
  shortClock: number;
  duration: number;
  team: {
    one: TeamData;
    two: TeamData;
  };
}

export interface Sponsor {
  timestamp: string;
  src: string;
}

export interface ScoreBoardData {
  ticker: number;
  time: number;
  team: {
    one: TeamScoreData;
    two: TeamScoreData;
  };
  foul: null | "one" | "two";
  round: number;
  play: boolean;
  sponsor: Sponsor[];
}

export interface ScoreInitData extends ScoreBoardData {
  teamInfo: {
    one: TeamData;
    two: TeamData;
  };
}

export interface TickerData {
  ticker: number;
  time: number;
}

export interface TeamData {
  name: string;
  logo: null | string;
}

export interface TeamScoreData {
  score: number;
  foul: number;
}
