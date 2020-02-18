const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { findOrCreateUser } = require('./controllers/userController')

//  getMapApi();

/* unction getMapBoxApi (){
    const mapboxApi = process.env.MAPBOX_TOKEN;
   console.log(mapboxApi)
   return mapApi;
}
 */
/* connecting the Database with the server */

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log("DB connected! "))
  .catch(err => console.error(err))

// initiating the server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  /* getting the authtoken from client and authorzing it */
  context: async ({ req }) => {
    let authToken = null 
    let currentUser = null 
    try {
      authToken = await req.headers.authorization
      console.log( `server received the ID token  from client: ${authToken}`)
      console.log(currentUser)
      if(authToken) {
        // find or create user 
       currentUser = await findOrCreateUser(authToken)
        console.log (currentUser);
      }
    }catch (err) {
      console.error(`Unable to authenticate user with token ${authToken}`)
    }
    return{ currentUser }
  }
}); 


/* checking the server is working */
server.listen().then(({ url }) => {
  console.log(`server listening on ${url}`);
});


  

