const { AuthenticationError } = require('apollo-server')
require("dotenv").config();
 /* const user = {
    _id: "1",
    name: "Vishu",
    email: "vishu@gmail.com",
    picture: "https://cloudinary.com/asdf"
}  */

 const mapboxApi = {
    // apiKey: process.env.MAPBOX_TOKEN
    apiKey: "pk.eyJ1IjoidmlzaGFsaXZpc2h1IiwiYSI6ImNrNmhrdzduNzFib3czbG52cDJlZzU3YWkifQ.Mst9N0Hlqk3syJ_G66JWwQ"
 }

const authenticated = next => (root, args, ctx, info ) => {

    if(!ctx.currentUser) {
        throw new AuthenticationError('You must be Logged in ')
    }
    console.log(ctx.currentUser)
    return next(root, args, ctx, info)
}

// function getMapBoxApi () {
//     const mapboxApi = process.env.MAPBOX_TOKEN;
//    console.log(mapboxApi);
//    return mapboxApi;
// }

module.exports = {
    Query: {
        getUser: authenticated( (root, args, ctx) => ctx.currentUser ),
        // me : () => user 
        getMapboxKey: () => mapboxApi

    }
}