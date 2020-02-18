import React from "react";
import withRoot from "../withRoot";
import Header from "../components/Header";
import Map from '../components/Map';
// import Blog from "../components/Blog";

const App = () => {
  return (
    <>
    <Header />
    <Map />
    
    </>
  );
  
};

export default withRoot(App);
