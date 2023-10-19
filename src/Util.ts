import { Dog } from "./types";

const FETCH_BASE_URI = "https://frontend-take-home-service.fetch.com";
const FETCH_AUTH_ENDPOINT = "/auth/login";
const BREEDS_URI = "/dogs/breeds";
const SEARCH_URI = "/dogs/search?";

//Create a POST req and return the response object
async function handleFetch(req: Request) {
  try {
    const response = await fetch(req);
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response;
  } catch (err) {
    console.error("HTTPS Request Failed", req, err);
  }
}

export {
  FETCH_BASE_URI,
  FETCH_AUTH_ENDPOINT,
  BREEDS_URI,
  SEARCH_URI,
  handleFetch,
};
