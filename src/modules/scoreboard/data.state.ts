import { ScoreBoardData, Sponsor, TickerData } from "./interfaces";
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
    updateTickerOnly: (state, action: PayloadAction<number>) => {
      state.ticker = action.payload;
    },
    updateTimeOnly: (state, action: PayloadAction<number>) => {
      state.time = action.payload;
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
    updateSponsor(state, action: PayloadAction<Sponsor>) {
      state.sponsor.push(action.payload);
    },
    removeSponsor(state) {
      state.sponsor = [];
    },
    updateRound(state, action: PayloadAction<number>) {
      state.round = action.payload;
    },
    resetData(state, action: PayloadAction<number>) {
      state.foul = null;
      state.play = false;
      state.round = 1;
      state.team.one.foul = 0;
      state.team.one.score = 0;
      state.team.two.score = 0;
      state.team.two.score = 0;
      state.ticker = action.payload;
      state.time = 600;
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
  updateRound,
  updateTickerOnly,
  updateTimeOnly,
  resetData,
} = configSlice.actions;
export default configSlice.reducer;
