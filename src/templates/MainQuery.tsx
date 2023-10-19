import "../App.css";
import { handleFetch } from "../util";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "react-query";
import { BASE_URI, BREEDS_ENDPOINT, SEARCH_ENDPOINT } from "../util";
import DogCard from "../components/DogCard";
import { Box, Container, Grid, Pagination } from "@mui/material";
import TempCard from "../components/TempCard";
import { useEffect, useState } from "react";
import React from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Pets } from "@mui/icons-material";

const resultsPerPage = 16;

export async function fetchDogBreeds() {
  let getHeader = new Headers();
  getHeader.append("Cookie", document.cookie);

  const requestConfig: RequestInit = {
    method: "GET",
    headers: getHeader,
    redirect: "follow",
    credentials: "include",
  };

  const request = new Request(BASE_URI + BREEDS_ENDPOINT, requestConfig);
  let response = await handleFetch(request);
  let raw = await response?.text();
  return JSON.parse(raw as string);
}

/**
 * @param body the query params to be passed to the function
 * @returns
 */
//TODO explicit type saftey
export async function fetchDogIds({ queryKey }: { queryKey: any }) {
  let [_key, params]: [_key: string, params: URLSearchParams] = queryKey;
  let getHeader = new Headers();
  getHeader.append("Content-Type", "application/json");
  getHeader.append("Cookie", document.cookie);

  const requestConfig: RequestInit = {
    method: "GET",
    headers: getHeader,
    redirect: "follow",
    credentials: "include",
  };

  console.log(
    "DEBUG [MainQuery > URL built]: ",
    BASE_URI + SEARCH_ENDPOINT + params.toString()
  );
  const request = new Request(
    BASE_URI + SEARCH_ENDPOINT + params.toString(),
    requestConfig
  );
  let response = await handleFetch(request);
  let raw = await response?.text();
  return JSON.parse(raw as string);
}

function MainQuery() {
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    new URLSearchParams({ from: "0", size: "" + resultsPerPage })
  );
  const [page, setPage] = useState(1);
  const [selectedDogs, setSelectedDogs] = useState<Array<string>>([]);

  useEffect(() => {
    console.dir("DEBUG [MainQuery] queryParams:", queryParams);
  }, [queryParams]);
  useEffect(() => {
    console.dir("DEBUG [MainQuery] selected:", selectedDogs);
  }, [selectedDogs]);

  function handlePageChange(_event: React.ChangeEvent<any>, newPage: number) {
    console.log("DEBUG [MainQuery > handlePageChange] newPage", newPage);
    setPage(newPage);

    /* TODO Having URLSearchParams as state may have been a bad idea
    having issues with local testing */
    // https://reactrouter.com/en/main/hooks/use-search-params
    // let newParams = new URLSearchParams();
    // for (const [key, value] of queryParams) {
    //   newParams.append(key, value);
    // }
    // newParams.set("from", "" + resultsPerPage * (newPage - 1));

    queryParams.set("from", "" + resultsPerPage * (newPage - 1));
    setQueryParams(queryParams);
    refetch();
  }

  const { data, refetch } = useQuery({
    queryKey: ["dogs", queryParams],
    queryFn: fetchDogIds,
    placeholderData: keepPreviousData,
  });

  // TODO make dog card grid update locally on state change
  // issue lies in the URLSearchParams as a state object
  return (
    <Container
      sx={{
        width: "1980px",
      }}
    >
      <br />
      <BreedComboBox
        params={queryParams}
        setParams={setQueryParams}
        refetch={refetch}
      />
      <br />
      {data ? (
        <DogCardGrid
          queryResponse={data}
          selectedDogs={selectedDogs}
          setSelectedDogs={setSelectedDogs}
        />
      ) : (
        <TempCard />
      )}
      {data ? (
        <Pagination
          count={Math.ceil(data.total / resultsPerPage)}
          color="primary"
          page={page}
          onChange={handlePageChange}
          size="large"
        />
      ) : (
        <></>
      )}
    </Container>
  );
}

function BreedComboBox({
  params,
  setParams,
  refetch,
}: {
  params: URLSearchParams;
  setParams: any;
  refetch: any;
}) {
  const { data: breeds, status: breed_status } = useQuery({
    queryKey: ["breeds"],
    queryFn: fetchDogBreeds,
    refetchOnWindowFocus: false,
  });

  if (breed_status === "loading") {
    //TODO could be Skeleton
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
        onChange={(_event, breeds) => {
          params.delete("breeds");
          setParams(params); // remove old breed params
          for (const breed of breeds) {
            // Iterate over this ComboBox and add all the breeds as queryParams if they do not exsist already
            params.append("breeds", breed as string);
            setParams(params);
          }
          console.dir(
            "DEBUG [MainQuery > BreedComboBox > onChange] params:",
            params
          );
          refetch();
        }}
        sx={{ width: 500 }}
        renderInput={(params) => (
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <Pets
              fontSize="large"
              sx={{
                color: "action.active",
                mr: 6,
                my: 6,
              }}
            />
            <TextField
              {...params}
              label="BREED"
              sx={{
                fontWeight: "bold",
              }}
            />
          </Box>
        )}
      />
    </>
  );
}

function DogCardGrid({
  queryResponse,
  selectedDogs,
  setSelectedDogs,
}: {
  queryResponse: any; // currently displayed dogs
  selectedDogs: Array<string>; // currently selected dogs
  setSelectedDogs: any;
}) {
  console.log("DEBUG [DogCardGrid] ids:", queryResponse);
  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={2}>
        {queryResponse.resultIds.map((id: string) => (
          <DogCard
            key={id}
            dogId={id}
            selectedDogs={selectedDogs}
            setSelectedDogs={setSelectedDogs}
          />
        ))}
      </Grid>
      <br />
    </Container>
  );
}

export default MainQuery;
