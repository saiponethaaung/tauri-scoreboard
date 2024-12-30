import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ScoreInitData, Sponsor, TickerData } from "../interfaces";

const initialState: ScoreInitData = {
  ticker: 0,
  time: 0,
  team: {
    one: {
      score: 0,
      foul: 0,
    },
    two: {
      score: 0,
      foul: 0,
    },
  },
  foul: null,
  round: 0,
  play: false,
  teamInfo: {
    one: {
      name: "",
      logo: null,
    },
    two: {
      name: "",
      logo: null,
    },
  },
  sponsor: [],
};

export const scoreDisplaySlice = createSlice({
  name: "scoreDisplaySlice",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<ScoreInitData>) => {
      for (const key in action.payload) {
        (state as any)[key] = (action.payload as any)[key];
      }
    },
    updateTime: (state, action: PayloadAction<TickerData>) => {
      state.ticker = action.payload.ticker;
      state.time = action.payload.time;
    },
    updateScore: (
      state,
      action: PayloadAction<{ team: "one" | "two"; value: number }>
    ) => {
      state.team[action.payload.team].score = action.payload.value;
    },
    updateFoul: (
      state,
      action: PayloadAction<{ team: "one" | "two"; value: number }>
    ) => {
      state.team[action.payload.team].foul = action.payload.value;
    },
    updateFoulTeam: (state, action: PayloadAction<"one" | "two" | null>) => {
      state.foul = action.payload;
    },
    updateSponsor(state, action: PayloadAction<Sponsor>) {
      const timestamps: string[] = [];
      state.sponsor.forEach((s) => {
        timestamps.push(s.timestamp);
      });
      if (timestamps.indexOf(action.payload.timestamp) === -1) {
        state.sponsor.push(action.payload);
      }
    },
    removeSponsor(state) {
      state.sponsor = [];
    },
    updateTeam: (
      state,
      action: PayloadAction<{ teamOne: string; teamTwo: string }>
    ) => {
      state.teamInfo.one.name = action.payload.teamOne;
      state.teamInfo.two.name = action.payload.teamTwo;
    },
    updateRound: (state, action: PayloadAction<number>) => {
      state.round = action.payload;
    },
  },
});

export const {
  setData,
  updateTime,
  updateScore,
  updateFoul,
  updateFoulTeam,
  updateSponsor,
  removeSponsor,
  updateTeam,
  updateRound,
} = scoreDisplaySlice.actions;
export default scoreDisplaySlice.reducer;
