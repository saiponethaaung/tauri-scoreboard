import { ScoreBoardConfigData } from "./interfaces";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: ScoreBoardConfigData = {
  duration: 600,
  shortClock: 24,
  team: {
    one: {
      logo: "",
      name: "Team 1",
    },
    two: {
      logo: "",
      name: "Team 2",
    },
  },
};

export const configSlice = createSlice({
  name: "scoreConfig",
  initialState,
  reducers: {
    // @ts-ignore
    updateConfig: (state, action: PayloadAction<ScoreBoardConfigData>) => {
      state = action.payload;
    },
    updateTeam: (
      state,
      action: PayloadAction<{ teamOne: string; teamTwo: string }>
    ) => {
      state.team.one.name = action.payload.teamOne;
      state.team.two.name = action.payload.teamTwo;
    },
    updateShortClock: (state, action: PayloadAction<number>) => {
      state.shortClock = action.payload;
    },
  },
});

export const { updateConfig, updateTeam, updateShortClock } =
  configSlice.actions;
export default configSlice.reducer;
