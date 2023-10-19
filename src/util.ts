import { Dog } from "./types/types";

const BASE_URI = "https://frontend-take-home-service.fetch.com";
const AUTH_ENDPOINT = "/auth/login";
const LOGOUT_ENDPOINT = "/auth/login";
const BREEDS_ENDPOINT = "/dogs/breeds";
const MATCH_ENDPOINT = "/dogs/match";
const SEARCH_ENDPOINT = "/dogs/search?";

/**
 * @param ids an array of dog ids, trimmed to the first 100 Ids
 * @returns An
 */
async function idToDog(ids: string[]) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", document.cookie);

  if (ids.length > 100) {
    ids = ids.slice(0, 100);
  }
  var raw = JSON.stringify(ids);

  var requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
    credentials: "include",
  };
  const request = new Request(BASE_URI + "/dogs", requestOptions);

  let dog: Dog | null = null;
  try {
    let response = await handleFetch(request);
    let res_body = await response?.text();
    let res_json = JSON.parse(res_body as string);
    dog = res_json[0] as Dog;
    if (typeof dog === undefined) {
      throw new Error(
        "ERROR [util > idToDog] returning non-Dog type" + res_body
      );
    }

    return dog;
  } catch (err) {
    console.error(err);
  }
}

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
  BASE_URI,
  AUTH_ENDPOINT,
  LOGOUT_ENDPOINT,
  BREEDS_ENDPOINT,
  SEARCH_ENDPOINT,
  MATCH_ENDPOINT,
  handleFetch,
  idToDog,
};
