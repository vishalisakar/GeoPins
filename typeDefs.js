const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
    geopins: [Pin]
  }

  type Pin {
    _id: ID
    createdAt: String
    title: String
    content: String
    image: String
    latitude: Float
    longitude: Float
    author: User
    comments: [Comment]
  }

  type Comment {
    _id: ID
    text: String
    createdAt: String
    author: User
  }

  type mapboxApi {
    apiKey: String
  }

  type Query {
    getUser: User
    getMapboxKey: mapboxApi 
    
  }

 
`;
