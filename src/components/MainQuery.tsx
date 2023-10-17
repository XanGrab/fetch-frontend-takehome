import "../App.css";
import { handleFetch } from "../Util";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "react-query";
import { FETCH_BASE_URI } from "../Util";

const BREEDS_URI = "/dogs/breeds";

export async function fetchDogBreeds() {
  let getHeader = new Headers();
  getHeader.append("Cookie", document.cookie);

  const requestConfig: RequestInit = {
    method: "GET",
    headers: getHeader,
    redirect: "follow",
    credentials: "include",
  };

  const request = new Request(FETCH_BASE_URI + BREEDS_URI, requestConfig);
  let response = await handleFetch(request);
  let raw = await response?.text();
  return JSON.parse(raw as string);
}

function MainQuery() {
  const { data: breeds, status } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchDogBreeds,
  });

  if (status === "loading") {
    //TODO could be loading bar
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error!</p>;
  }

  //TODO: use onChange with some props passed down from the parent
  return (
    <>
      <Autocomplete
        multiple
        id="combo-box-demo"
        options={breeds}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Breeds" />}
      />
    </>
  );
}

export default MainQuery;
