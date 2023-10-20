import "../App.css";
import { handleFetch } from "../util";
import { useQuery } from "react-query";
import { BASE_URI, SEARCH_ENDPOINT } from "../util";
import DogCard from "../components/DogCard";
import FilterStack from "../components/FilterStack";
import { Container, Grid, Pagination } from "@mui/material";
import TempCard from "../components/TempCard";
import { useEffect, useState } from "react";
import React from "react";
import { keepPreviousData } from "@tanstack/react-query";
import Confetti from "react-confetti";
import { Dog } from "../types/types";
import DogModal from "../components/DogModal";

const resultsPerPage = 18;

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

function DogCardGrid({
  queryResponse,
  selectedDogs,
  setSelectedDogs,
}: {
  queryResponse: any; // currently displayed dogs
  selectedDogs: Array<string>; // currently selected dogs
  setSelectedDogs: any;
}) {
  //   console.log("DEBUG [DogCardGrid] ids:", queryResponse);
  return (
    <Container sx={{ marginTop: 32, alignItems: "center" }}>
      <Grid container spacing={4}>
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

function MainQuery() {
  const [queryParams, setQueryParams] = useState<URLSearchParams>(
    new URLSearchParams({ from: "0", size: "" + resultsPerPage })
  );
  const [page, setPage] = useState(1);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
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
    <Container>
      {matchedDog ? (
        <>
          <Confetti />
          <DogModal matchedDog={matchedDog} setMatchedDog={setMatchedDog} />
        </>
      ) : (
        <></>
      )}
      <Grid container sx={{ display: "flex" }}>
        <Grid item xs={3}>
          <FilterStack
            params={queryParams}
            setParams={setQueryParams}
            selectedDogs={selectedDogs}
            setMatch={setMatchedDog}
            refetch={refetch}
          />
        </Grid>
        <Grid item xs={8} sx={{ margin: 16 }}>
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default MainQuery;
