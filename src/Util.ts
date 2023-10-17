// import { User } from "./User";
const FETCH_BASE_URI = "https://frontend-take-home-service.fetch.com";
const FETCH_AUTH_ENDPOINT = "/auth/login";

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

export { FETCH_BASE_URI, FETCH_AUTH_ENDPOINT, handleFetch };
