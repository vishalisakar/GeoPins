import React, { useContext } from "react";
import Login from "../components/Auth/Login";
import Context from "../context";
import { Redirect } from "react-router-dom";

const Splash = () => {
  const { state } = useContext(Context);

  // if true redirect to root route else stay in login page 
  return  state.isAuth ? <Redirect  to = '/' /> : <Login />
};

export default Splash;
