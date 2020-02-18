import { useState } from "react";
import { GraphQLClient } from "graphql-request";
import { useEffect } from "react";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "<insert-production-url>"
    : "http://localhost:4000/graphql";

export const useClient = () => {
  const [idToken, setIdToken] = useState("");

  useEffect(() => {
    const token = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().id_token;
    setIdToken(token);
  }, []);

   const client = new GraphQLClient(BASE_URL, {
      headers : {authorization: idToken }
  })

  console.log(`useclient`, client);
  return client;

};

