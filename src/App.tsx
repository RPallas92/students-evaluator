import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import Evaluator from "./Evaluator";
import Login from "./Login";

const App = () => {
  return (
    <Router basename='/'>
      <div>
        <Route exact path="/" component={Evaluator} />
        <Route exact path="/login" component={Login} />
      </div>
    </Router>
  );
};

export default App;