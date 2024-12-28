import { ScoreBoardData, TickerData } from "./interfaces";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { emit } from "@tauri-apps/api/event";

const initialState: ScoreBoardData = {
  foul: null,
  play: false,
  round: 1,
  team: {
    one: {
      foul: 0,
      score: 0,
    },
    two: {
      foul: 0,
      score: 0,
    },
  },
  ticker: 24,
  time: 600,
  sponsor: [],
};

export const configSlice = createSlice({
  name: "scoreData",
  initialState,
  reducers: {
    updateData: (state, action: PayloadAction<ScoreBoardData>) => {
      for (const key in action.payload) {
        (state as any)[key] = (action.payload as any)[key];
      }
    },
    updateTicker: (state, action: PayloadAction<number>) => {
      state.ticker = action.payload;
      state.time--;
    },
    playTicker: (state, action: PayloadAction<number>) => {
      if (state.ticker === 0) {
        state.ticker = action.payload;
        const tickerData: TickerData = {
          ticker: state.ticker,
          time: state.time,
        };
        emit("score_ticker", tickerData);
      }
      state.play = true;
    },
    stopTicker: (state) => {
      state.play = false;
    },
    updateScore: (
      state,
      action: PayloadAction<{ team: "one" | "two"; value: number }>
    ) => {
      const score =
        state.team[action.payload.team].score + action.payload.value;
      state.team[action.payload.team].score = score;
    },
    tickerReset: (state, action: PayloadAction<number>) => {
      state.ticker = action.payload;
    },
    updateFoul: (
      state,
      action: PayloadAction<{ team: "one" | "two"; value: number }>
    ) => {
      const score = state.team[action.payload.team].foul + action.payload.value;
      state.team[action.payload.team].foul = score;
    },
    markFoul: (state, action: PayloadAction<"one" | "two" | null>) => {
      state.foul = action.payload;
    },
    updateSponsor(state, action: PayloadAction<string>) {
      state.sponsor.push(action.payload);
    },
    removeSponsor(state) {
      state.sponsor = [];
    },
  },
});

export const {
  updateData,
  playTicker,
  stopTicker,
  updateTicker,
  updateScore,
  tickerReset,
  updateFoul,
  markFoul,
  updateSponsor,
  removeSponsor,
} = configSlice.actions;
export default configSlice.reducer;
