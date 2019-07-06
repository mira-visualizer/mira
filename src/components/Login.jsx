import React, {Component} from 'react';
const {ipcRenderer} = require('electron');

class Login extends Component{
    constructor(props){
        super(props)
        this.state ={
         publicKey: '',
         secretKey: ''   
       }
       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
      }

    handleChange(field, fieldName){
        return this.setState(state => ({
            [fieldName] : field
        }))
    }
    handleSubmit(publicKey, secretKey){
        ipcRenderer.sendSync('logIn', publicKey, secretKey);
        this.props.logIn();
        return this.setState(state => ({
            publicKey:'',
            secretKey: ''
        }))
    }
    render() {
      return (
          <div id="loginContainer">
              <p id='Welcome'>Mira, Mira</p>
              <input type='text' id='publicKey' onChange={(e)=>{this.handleChange(e.target.value, 'publicKey')}}></input>
              <input type='text' id='secretKey' onChange={(e)=>{this.handleChange(e.target.value, 'secretKey')}}></input>
              <button onClick={(e)=>{this.handleSubmit(this.props.publicKey, this.props.secretKey)}}>login</button>
          </div>
      )
    }
  }
  
  export default Login;