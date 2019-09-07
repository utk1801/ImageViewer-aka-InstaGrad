import React, { Component } from 'react';
import './Login.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { FormHelperText } from '@material-ui/core';
import Home from '../home/Home';
import ReactDOM from 'react-dom';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            usernameRequired: "dispNone",
            password: "",
            passwordRequired: "dispNone",
            accessToken: "",
            loggedIn: false,
            loggedInRequired:"dispBlock"

        };
    }

    loginClickHandler = () => {
        let username = "aa";
        let password = "123";
        let accessToken = "18489759624.aee6821.0878e86f66df43fa99202ff08b765816";
        let xhrLogin = new XMLHttpRequest();
        let that = this;
        this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: 'dispNone' })
        this.state.password === "" ? this.setState({ passwordRequired: 'dispBlock' }) : this.setState({ passwordRequired: 'dispNone' }) 
        if(this.state.username === username && this.state.password === password && this.state.loggedIn === false){
            ReactDOM.render(<Home />, document.getElementById('root'));
            sessionStorage.setItem('accessToken', xhrLogin.getResponseHeader(accessToken));
            that.setState({
                loggedIn: true
            });
        }

        else if(this.state.loggedIn === false){
            
            this.state.loggedIn = true;
        }

    }

    inputUsernameChangeHandler = (e) => {
        this.setState({ username: e.target.value })
    }

    inputPasswordChangeHandler = (e) => {
        this.setState({ password: e.target.value })
    }

    render() {
        return (
            <div>
                <header className="app-header" >
                    <div className="logo"> Image Viewer</div>
                </header>
                
                <div className="login-card">
                    <Card>
                        <div className="login-header">LOGIN</div>
                        <CardContent>
                            <FormControl required>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input id="username" type="text" username={this.state.username}
                                    onChange={this.inputUsernameChangeHandler} />
                                <FormHelperText className={this.state.usernameRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br /><br />
                            <FormControl required>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input id="password" type="password" password={this.state.password}
                                    onChange={this.inputPasswordChangeHandler} />
                                <FormHelperText className={this.state.passwordRequired}><span className="red">required</span></FormHelperText>
                            </FormControl><br/><br/>
                            

                            {this.state.loggedIn === true &&
                                <FormControl>
                                <FormHelperText className = {this.state.loggedInRequired}>
                                    <span className="red">
                                        Incorrect username and/or password
                                    </span>
                                    </FormHelperText>
                                </FormControl>
                            }

                            <Button className="login-button" variant="contained" color="primary"
                                onClick={this.loginClickHandler}>LOGIN</Button>
                        </CardContent>

                    </Card>
                </div>
            </div>
        );
    }
}

export default Login;