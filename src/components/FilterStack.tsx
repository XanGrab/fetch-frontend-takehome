import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { Pets, SearchRounded } from "@mui/icons-material";
import { useQuery } from "react-query";
import {
  BASE_URI,
  BREEDS_ENDPOINT,
  MATCH_ENDPOINT,
  handleFetch,
  idToDog,
} from "../util";
import { useState } from "react";
import { Dog } from "../types/types";

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
    <Container
      sx={{
        margin: 8,
      }}
    >
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
        sx={{ width: 280, marginTop: 32 }}
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
      <br />
    </Container>
  );
}

async function matchRequest(ids: string[]) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Cookie", document.cookie);

  var raw = JSON.stringify(ids);
  var requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
    credentials: "include",
  };
  const request = new Request(BASE_URI + MATCH_ENDPOINT, requestOptions);

  let match = "";
  try {
    let response = await handleFetch(request);
    let res_body = await response?.text();
    let res_json = JSON.parse(res_body as string);
    match = res_json.match;
  } catch (err) {
    console.error(err);
  }
  let dog: Dog = await idToDog([match]);

  return dog;
}

//TODO function type safety
function FilterStack({
  params,
  setParams,
  refetch,
  selectedDogs,
  setMatch,
}: {
  params: URLSearchParams;
  setParams: any;
  refetch: any;
  selectedDogs: string[];
  setMatch: any;
}) {
  const [sendAlert, setAlertState] = useState(false);
  const handleClick = async () => {
    if (selectedDogs.length > 0) {
      let matchedDog = await matchRequest(selectedDogs);
      try {
        if (matchedDog === null || matchedDog === undefined) {
          throw new TypeError(
            "ERROR [FilterStack > handleClick] invalid dog returned from Promise"
          );
        }
        console.dir(
          "DEBUG [FilterStack > handleClick] matched with ",
          matchedDog
        );
        setMatch(matchedDog);
      } catch (err) {
        console.error(err);
      }
    } else {
      // User has tried to request a match wo selecting dogs
      setAlertState(true);
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    event;
    if (reason === "clickaway") {
      return;
    }

    setAlertState(false);
  };

  return (
    <Stack direction="column">
      <BreedComboBox params={params} setParams={setParams} refetch={refetch} />
      <Button
        variant="contained"
        endIcon={<SearchRounded />}
        onClick={handleClick}
        sx={{
          marginY: 16,
          margin: 32,
          minWidth: 100,
          maxHeight: 50,
        }}
      >
        MATCH!
      </Button>
      <Snackbar open={sendAlert} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          variant="filled"
          severity="info"
          sx={{ width: "100%" }}
          onClose={handleClose}
        >
          Please select some nice dogs!
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default FilterStack;
