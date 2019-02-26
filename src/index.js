import React from "react";
import ReactDOM from "react-dom";

import App from "./containers/App";
import { Provider } from "react-redux";
import store from "./store";
import './styles/App.scss'


ReactDOM.render(
  <Provider store = {store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);