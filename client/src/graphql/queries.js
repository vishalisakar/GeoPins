
 export const USER_QUERY = `
 {
  getUser {
    _id
    name
    email
    picture
  }
}
`;  

export const MAPBOX_API = `
{
  getMapboxKey {
    apiKey
  }
}

 
`;

export const GET_PINS_Query =`
{
  getPins{
    _id
    createdAt
    title
    content
    image
    latitude
    longitude
  
     author{
      _id
      name
    email
      picture
    }
    comments{
      text
      createdAt
      author{
        _id
        name
        email
        picture
      }
    }
    
  }
}
`;