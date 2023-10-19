import "../App.css";
import { handleFetch } from "../Util";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "react-query";
import { FETCH_BASE_URI, BREEDS_URI, SEARCH_URI } from "../Util";
import DogCard from "../components/DogCard";
import { Container, Grid, Typography } from "@mui/material";
import TempCard from "../components/TempCard";
import { useState } from "react";

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

/**
 *
 * @param body the query params to be passed to the function
 * @returns
 */
//TODO explicit type saftey
export async function fetchDogIds({ queryKey }: { queryKey: any }) {
  let [_key, params] = queryKey;
  let getHeader = new Headers();
  getHeader.append("Content-Type", "application/json");
  getHeader.append("Cookie", document.cookie);

  const requestConfig: RequestInit = {
    method: "GET",
    headers: getHeader,
    redirect: "follow",
    credentials: "include",
  };

  console.dir("DEBUG [MainQuery]: ", params);
  console.log(
    "DEBUG [MainQuery > URL built]: ",
    FETCH_BASE_URI + SEARCH_URI + params.toString()
  );
  const request = new Request(
    FETCH_BASE_URI + SEARCH_URI + params.toString(),
    requestConfig
  );
  let response = await handleFetch(request);
  let raw = await response?.text();
  return JSON.parse(raw as string);
}

function MainQuery() {
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    new URLSearchParams({ from: "0", size: "16" })
  );
  return (
    <Container
      sx={{
        width: "1980px",
      }}
    >
      <BreedComboBox setParams={setQueryParams} />
      <br />
      <DogCardGrid queryParams={queryParams} />
    </Container>
  );
}

function BreedComboBox({ setParams }: { setParams: any }) {
  const { data: breeds, status: breed_status } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchDogBreeds,
  });

  if (breed_status === "loading") {
    //TODO could be loading bar
    return <p>Loading...</p>;
  }
  if (breed_status === "error") {
    return <p>Error!</p>;
  }

  //TODO: use onChange with some props passed down from the parent
  return (
    <>
      <Autocomplete
        multiple
        id="combo-box-demo"
        options={breeds}
        sx={{ width: 500 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="BREED"
            sx={{
              fontWeight: "bold",
            }}
          />
        )}
      />
    </>
  );
}

function DogCardGrid({ queryParams }: { queryParams: URLSearchParams }) {
  const { data: ids, status: ids_status } = useQuery({
    queryKey: ["dogs", queryParams],
    queryFn: fetchDogIds,
  });

  if (ids_status === "loading") {
    return <TempCard />;
  }
  if (ids_status === "error") {
    return <p>Error!</p>;
  }

  console.log("DEBUG [MainQuery > ids]: ", ids);
  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={2}>
        {ids.resultIds.map((id: string) => (
          <DogCard key={id} dogId={id} />
        ))}
      </Grid>
    </Container>
  );
}

export default MainQuery;
