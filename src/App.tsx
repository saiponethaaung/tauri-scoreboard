import "./App.scss";
import { Route, Switch } from "wouter";
import SelectionScreen from "./modules/selection-screen/SelectionScreen";
import ScoreboardScreen from "./modules/scoreboard/ScoreboardScreen";
import ScoreProjectionScreen from "./modules/scoreboard/projection/ScoreProjectionScreen";
import { Provider } from "react-redux";
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <Switch>
        <Route path="/" component={SelectionScreen} />
        <Route path="/scoreboard" component={ScoreboardScreen} />
        <Route
          path="/scoreboard/projection"
          component={ScoreProjectionScreen}
        />
      </Switch>
    </Provider>
  );
}

export default App;
