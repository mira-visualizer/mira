import React, {Component} from 'react';
const {ipcRenderer} = require('electron');

// import { connect } from 'react-redux';


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
        ipcRenderer.sendSync('logIn', [publicKey, secretKey]);
        console.log('is it here?');
        this.props.logIn();
        return this.setState(state => ({
            publicKey:'',
            secretKey: ''
        }))
    }
    render() {
      console.log(this.state);
      console.log(this.props.loginKey);
      return (
          <div id="loginContainer">
              <p id='Welcome'>Mira, Mira</p>
              <input type='text' id='publicKey' placeholder='public access key' onChange={(e)=>{this.handleChange(e.target.value, 'publicKey')}}></input>
              <input type='text' id='secretKey' placeholder='secret access key'onChange={(e)=>{this.handleChange(e.target.value, 'secretKey')}}></input>
              <button onClick={(e)=>{this.handleSubmit(this.state.publicKey, this.state.secretKey)}}>login</button>
          </div>
      )
    }
  }
  
  export default Login;