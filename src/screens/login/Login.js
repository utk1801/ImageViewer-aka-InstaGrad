import React, { Component } from 'react';
import './Login.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { FormHelperText } from '@material-ui/core';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            usernameRequired: "dispNone",
            password: "",
            passwordRequired: "dispNone",
            accessToken: ""
        };
    }

    loginClickHandler = () => {
        this.state.username === "aa" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: 'dispNone' })
        this.state.password === "123" ? this.setState({ passwordRequired: 'dispBlock' }) : this.setState({ passwordRequired: 'dispNone' })
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
                            </FormControl>
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