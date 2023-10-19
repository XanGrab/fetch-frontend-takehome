import "../App.css";
import { handleFetch } from "../Util";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "react-query";
import { FETCH_BASE_URI, BREEDS_URI, SEARCH_URI } from "../Util";
import DogCard from "../components/DogCard";
import { Container, Grid, Pagination } from "@mui/material";
import TempCard from "../components/TempCard";
import { useState } from "react";
import React from "react";
import { keepPreviousData } from "@tanstack/react-query";

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
    new URLSearchParams({ from: "0", size: "" + resultsPerPage })
  );
  const [page, setPage] = useState(1);
  const [selectedDogs, setSelectedDogs] = useState<Array<string>>([]);

  function handlePageChange(_event: React.ChangeEvent<any>, newPage: number) {
    console.log("DEBUG [MainQuery > handlePageChange] newPage", newPage);
    setPage(newPage);

    queryParams.set("from", "" + resultsPerPage * (newPage - 1));
    setQueryParams(queryParams);
    refetch();
  }

  const { data, refetch } = useQuery({
    queryKey: ["dogs", queryParams],
    queryFn: fetchDogIds,
    placeholderData: keepPreviousData,
  });

  //   useEffect(() => {
  //     refetch();
  //   }, [queryParams, page]);

  //TODO make dog card grid update on state change
  console.log("DEBUG [MainQuery] queryParams:", queryParams);
  return (
    <Container
      sx={{
        width: "1980px",
      }}
    >
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
          count={data.total / resultsPerPage}
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
