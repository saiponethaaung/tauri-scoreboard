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
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    updateTicker: (state, action: PayloadAction<number>) => {
      state.ticker = action.payload;
      state.time--;
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    updateTickerOnly: (state, action: PayloadAction<number>) => {
      state.ticker = action.payload;
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    updateTimeOnly: (state, action: PayloadAction<number>) => {
      state.time = action.payload;
      localStorage.setItem("scoreData", JSON.stringify(state));
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
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    stopTicker: (state) => {
      state.play = false;
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    updateScore: (
      state,
      action: PayloadAction<{ team: "one" | "two"; value: number }>
    ) => {
      const score =
        state.team[action.payload.team].score + action.payload.value;
      state.team[action.payload.team].score = score;
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    tickerReset: (state, action: PayloadAction<number>) => {
      state.ticker = action.payload;
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    updateFoul: (
      state,
      action: PayloadAction<{ team: "one" | "two"; value: number }>
    ) => {
      const score = state.team[action.payload.team].foul + action.payload.value;
      state.team[action.payload.team].foul = score;
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    markFoul: (state, action: PayloadAction<"one" | "two" | null>) => {
      state.foul = action.payload;
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    updateSponsor(state, action: PayloadAction<Sponsor>) {
      state.sponsor.push(action.payload);
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    removeSponsor(state) {
      state.sponsor = [];
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    updateRound(state, action: PayloadAction<number>) {
      state.round = action.payload;
      localStorage.setItem("scoreData", JSON.stringify(state));
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
      localStorage.setItem("scoreData", JSON.stringify(state));
    },
    loadDataData(state) {
      const data = localStorage.getItem("scoreData");

      if (data) {
        const scoreData = JSON.parse(data);
        for (const key in scoreData) {
          (state as any)[key] = (scoreData as any)[key];
        }
      }
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
  loadDataData
} = configSlice.actions;
export default configSlice.reducer;
