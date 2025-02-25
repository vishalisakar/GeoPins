import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";

import Context from "../context";
import NoContent from "./Pin/NoContent";
import CreatePin from "./Pin/CreatePin";
import PinContent from "./Pin/PinContent";

import { Paper } from "@material-ui/core";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

const Blog = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const { state } = useContext(Context);
  const { draft, currentPin } = state;

  let BlogContent;
  if (!draft && !currentPin) {
    //  nocontent
    BlogContent = NoContent;
  } else if (draft && !currentPin) { 
    //  creat pin
    BlogContent = CreatePin;
  }else if(!draft && currentPin){
    BlogContent = PinContent
  }
  return (
    <Paper className={mobileSize ? classes.rootMobile : classes.root}>
      <BlogContent />
     </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center",
    float: "right"
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
};

export default withStyles(styles)(Blog);
