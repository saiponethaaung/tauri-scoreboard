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
  },
});

export const { setData, updateTime, updateScore } = scoreDisplaySlice.actions;
export default scoreDisplaySlice.reducer;
