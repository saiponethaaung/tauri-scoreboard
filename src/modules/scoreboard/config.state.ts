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
    updateConfig: (state, action: PayloadAction<ScoreBoardConfigData>) => {
      state = action.payload;
    },
  },
});

export const { updateConfig } = configSlice.actions;
export default configSlice.reducer;
