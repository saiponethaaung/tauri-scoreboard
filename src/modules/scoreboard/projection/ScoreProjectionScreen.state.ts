import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ScoreInitData, TickerData } from "../interfaces";

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
    updateSponsor(state, action: PayloadAction<string>) {
      if (state.sponsor.indexOf(action.payload) === -1) {
        state.sponsor.push(action.payload);
      }
    },
    removeSponsor(state) {
      state.sponsor = [];
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
} = scoreDisplaySlice.actions;
export default scoreDisplaySlice.reducer;