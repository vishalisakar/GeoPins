import React, { useState } from "react";
import MapGL, { GeolocateControl } from "react-map-gl";
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from "graphql-request";
import { MAPBOX_API } from "../graphql/queries";
// import dotenv from 'dotenv';

// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const Map = ({ classes }) => {

  async function apiKey() {

    const url = "http://localhost:4000/graphql";
    const client = new GraphQLClient(url);
  
    const mapboxApi = await client.request(MAPBOX_API);
    console.log(mapboxApi);

    
    if( mapboxApi === "pk.eyJ1IjoidmlzaGFsaXZpc2h1IiwiYSI6ImNrNmhrdzduNzFib3czbG52cDJlZzU3YWkifQ.Mst9N0Hlqk3syJ_G66JWwQ") {
      console.log("Matches API", mapboxApi);

    }else {
      console.log("Not Match",mapboxApi);
    }
  }
apiKey();
  

  const [viewport, setViewPort] = useState({
    width: "100vw",
    height: "calc(100vh - 64px)",
    latitude: 11.1271,
    longitude: 78.6569,
    zoom: 13
  });

  const _onViewportChange = viewport =>
    setViewPort({ ...viewport, transitionDuration: 3000 });

  

  return (
    <div className={classes.root}>
      <MapGL
        
        {...viewport}
        onViewportChange={_onViewportChange}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        // mapboxApiAccessToken={MAPBOX_TOKEN}
        mapboxApiAccessToken="pk.eyJ1IjoidmlzaGFsaXZpc2h1IiwiYSI6ImNrNmhrdzduNzFib3czbG52cDJlZzU3YWkifQ.Mst9N0Hlqk3syJ_G66JWwQ"
      ></MapGL>
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
