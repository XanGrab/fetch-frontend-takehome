import { Dog } from "./Dog";

const FETCH_BASE_URI = "https://frontend-take-home-service.fetch.com";
const FETCH_AUTH_ENDPOINT = "/auth/login";
const BREEDS_URI = "/dogs/breeds";
const SEARCH_URI = "/dogs/search";

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

/**
 *
 * @param ids an array of dog ids, trimmed to the first 100 Ids
 * @returns An
 */
async function idToDog(ids: Array<string>): Promise<Dog | null> {
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

  let dog: Dog | null = null;
  fetch("https://frontend-take-home-service.fetch.com/dogs", requestOptions)
    .then(async (response) => {
      let raw = await response.text();
      dog = JSON.parse(raw);
      return dog;
    })
    .catch((error) => console.error("error", error));
  return dog;
}

export {
  FETCH_BASE_URI,
  FETCH_AUTH_ENDPOINT,
  BREEDS_URI,
  SEARCH_URI,
  handleFetch,
  idToDog,
};
