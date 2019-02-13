import React, {Component} from "react";
import ReactDOM from "react-dom";
// import store from "../store";
import GraphContainer from "../containers/graphContainer.jsx";
import Graph from "../containers/graph.jsx";
import '../style/App.css'


class App extends Component{
  render(){
    return(
      <div id="app">
        <GraphContainer />
      </div>
    )
  }
}

export default App;