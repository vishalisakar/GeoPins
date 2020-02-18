import React, { useState, useEffect, useContext } from "react";
import MapGL, { NavigationControl, Marker, Popup } from "react-map-gl";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
// import { GraphQLClient } from "graphql-request";
// import { MAPBOX_API } from "../graphql/queries";
import { Subscription } from "react-apollo";

import { useClient } from "../client";
import { GET_PINS_Query } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION
} from "../graphql/subscriptions";
import PinIcon from "./PinIcon";
import Blog from "./Blog";
import Context from "../context";
import differenceInMinutes from "date-fns/difference_in_minutes";
// import { Paper } from "@material-ui/core";
// import dotenv from 'dotenv';

// import Button from "@material-ui/core/Button";
const INITIAL_VIEWPORT = {
  width: "100vw",
  height: "calc(100vh - 64px)",
  latitude: 11.1271,
  longitude: 78.6569,
  zoom: 13
};

const Map = ({ classes }) => {
  const client = useClient();
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    getPins();
  }, []);

  const [viewport, setViewPort] = useState(INITIAL_VIEWPORT);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    getUserPosition();
  }, []);
  const [popup, setPopup] = useState(null);
  // remove popup if pin itself is deleted  by the author of the pin 

  useEffect(() => {
    const pinExists = popup && state.pins.findIndex(pin => pin._id === 
      popup._id ) > -1
      if(!pinExists){
        setPopup(null)
      }
  }, [state.pins.lenght])

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewPort({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_Query);

    console.log({ getPins });
    dispatch({ type: "GET_PINS", payload: getPins });
  };
  // const handleMapClick = event => {
  //   console.log(event);
  // }

  const handleMapClick = ({ lngLat, leftButton }) => {
    // console.log({ lngLat, leftButton });
    if (!leftButton) return;

    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;

    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude }
    });
  };

  const highlightNewPin = pin => {
    const isNewPin =
      differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return isNewPin ? "limegreen" : "darkblue";
  };

  const handleSelectPin = pin => {
    setPopup(pin);
    dispatch({ type: "SET_PIN", payload: pin });
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id };
    await client.request(DELETE_PIN_MUTATION, variables);

    // dispatch({ type: "DELETE_PIN", payload: deletePin });

    setPopup(null);
  };

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <MapGL
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxApiAccessToken="pk.eyJ1IjoidmlzaGFsaXZpc2h1IiwiYSI6ImNrNmhrdzduNzFib3czbG52cDJlZzU3YWkifQ.Mst9N0Hlqk3syJ_G66JWwQ"
        scrollZoom={!mobileSize}
        onViewportChange={newViewport => setViewPort(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        {/* Navigation control */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewPort(newViewport)}
          />
        </div>

        {/* pin for Uer's current position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}

        {/* draft pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}

        {/* created pins */}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={19}
            offsetTop={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size={40}
              color={highlightNewPin(pin)}
            />
          </Marker>
        ))}
        {/* Popup dialog for create pins */}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)},{popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Subscription for Creating/ updating/ Deleting Pins */}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          console.log({ pinAdded });
          dispatch({ type: "CREATE_PIN", payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          console.log({ pinUpdated });
          dispatch({ type: "CREATE_COMMENT", payload: pinUpdated });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          console.log({ pinDeleted });
          dispatch({ type: "DELETE_PIN", payload: pinDeleted });
        }}
      />

      {/* <Paper className={classes.rootPaper}> */}
      <Blog />
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
  },
  rootPaper: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: "calc(100vh - 64px)",
    overflowY: "scroll",
    display: "flex",
    justifyContent: "center",
    float: "right"
  }
};

export default withStyles(styles)(Map);
