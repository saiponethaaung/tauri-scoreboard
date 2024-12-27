import { configureStore } from "@reduxjs/toolkit";
import scoreConfigReducer from "./modules/scoreboard/config.state";
import scoreDataReducer from "./modules/scoreboard/data.state";
import scoreDisplayReducer from "./modules/scoreboard/projection/ScoreProjectionScreen.state";

export const store = configureStore({
  reducer: {
    scoreConfigReducer,
    scoreDataReducer,
    scoreDisplayReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
