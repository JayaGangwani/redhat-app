import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { setWithExpiry } from "../utils"


export const Login = ({ history, location }) => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const isSignUp = location.pathname === "/signup";
    function login() {
        if (!userName || !password) return;
        if (isSignUp && password !== confirmPass) return;

        axios.post(`https://github-app-server.herokuapp.com/${isSignUp ? "signup" : "login"}`, { userName, password }).then(res => {
            if (isSignUp) {
                history.push("/");
            } else {
                setWithExpiry("token", res.data.token, 1000000);
                setWithExpiry("uname", res.data.user.userName, 1000000);
                history.push("/search");
            }
        }).catch(() => {
            localStorage.removeItem("token");
            alert("Please Signup first");
        });
        
    }

    return (
        <div class="dark-background">
            <div class="container">
                <div class="row">
                    <div class="col-md-12 min-vh-100 d-flex flex-column justify-content-center">
                        <div class="row">
                            <div class="col-lg-6 col-md-8 mx-auto">

                                <div class="card rounded shadow shadow-sm">
                                    <div class="card-header">
                                        <h3 class="mb-0" data-testid="title">{isSignUp ? "Signup" : "Login"}</h3>
                                    </div>
                                    <div class="card-body">
                                        <form class="form" role="form" autocomplete="off" onSubmit={(e) => { e.preventDefault(); login(); }} id="formLogin" novalidate="" method="POST">
                                            <div class="form-group">
                                                <label for="uname1">Username</label>
                                                <input type="text" class="form-control form-control-lg rounded-0" name="uname1" id="uname1" required="required" onChange={(e) => setUserName(e.target.value)} />
                                            </div>
                                            <div class="form-group">
                                                <label>Password</label>
                                                <input type="password" class="form-control form-control-lg rounded-0" id="pwd1" required="required" autocomplete="new-password" onChange={(e) => setPassword(e.target.value)} />
                                                <div class="invalid-feedback">Enter your password too!</div>
                                            </div>

                                            {isSignUp && <div class="form-group">
                                                <label>Confirm Password</label>
                                                <input type="password" class="form-control form-control-lg rounded-0" id="pwd1" required="required" autocomplete="new-password" onChange={(e) => setConfirmPass(e.target.value)} />
                                                <div class="invalid-feedback">Enter your password too!</div>
                                            </div>}

                                            <button type="submit" class="btn btn-success btn-lg float-right" id="btnLogin">{isSignUp ? "Signup" : "Login"}</button>
                                            <Link to={isSignUp ? "/" : "/signup"}>{`${!isSignUp ? "Signup" : "login"}`}</Link>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
}

export default Login



