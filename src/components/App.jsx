import React, {Component} from "react";
import ReactDOM from "react-dom";
// import store from "../store";
import MainContainer from "../containers/mainContainer.jsx";
import Menu from "./Menu.jsx"


class App extends Component{
  render(){
    return(
      <div id="app">
        <Menu/>
        <MainContainer/>
      </div>
    )
  }
}

export default App;