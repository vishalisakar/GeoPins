import React, { useContext } from "react";
import { GraphQLClient } from "graphql-request";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import { USER_QUERY } from "../../graphql/queries";
import Context from "../../context";
import Typography from "@material-ui/core/Typography";

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);

  const onSuccess = async googleUser => {
    try {
      const idToken = await googleUser.getAuthResponse().id_token;


      // console.log({ idToken });
      /* sending the id token to the server  */
      const url = "http://localhost:4000/graphql";
      const client = new GraphQLClient(url, {
        headers: { authorization: idToken }
      });

      const { me } = await client.request(USER_QUERY);
      console.log(`After the verification of user with the server :`, { me });

      /* update the state */
      dispatch({
        type: "LOGIN_USER",
        payload: me
      });
      dispatch({
        type: "IS_LOGGED_IN",
        payload: googleUser.isSignedIn()
      });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = err => {
    console.error("Error logging in", err);
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        style={{ color: "rgb(66, 133, 244)" }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="129370408827-bmd6hinonuaqmuhpk81ekl5pioba2vmv.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
        buttonText="Login with Google "
        theme="dark"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
