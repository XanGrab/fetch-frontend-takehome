import { Pets, SearchRounded } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import { useQuery } from "react-query";
import {
  BREEDS_ENDPOINT,
  BASE_URI,
  handleFetch,
  MATCH_ENDPOINT,
  idToDog,
} from "../Util";
import { Dog } from "../types";

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
        paddingTop: 16,
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
        sx={{ width: 280 }}
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

  let dog: Dog | null | undefined = null;
  let match = "";
  try {
    let response = await handleFetch(request);
    let res_body = await response?.text();
    let res_json = JSON.parse(res_body as string);
    match = res_json.match;
  } catch (err) {
    console.error(err);
  }
  try {
    dog = await idToDog([match]);
    if (typeof dog != typeof Dog) {
      throw new Error("ERROR [matchRequest > idToDog] returned non-Dog type");
    }
  } catch (err) {
    console.error(err);
  }
}

//TODO function type safety
function FilterStack({
  params,
  setParams,
  refetch,
  selectedDogs,
}: {
  params: URLSearchParams;
  setParams: any;
  refetch: any;
  selectedDogs: string[];
}) {
  return (
    <Stack direction="row">
      <BreedComboBox params={params} setParams={setParams} refetch={refetch} />
      <Button
        variant="contained"
        endIcon={<SearchRounded />}
        onClick={() => {
          matchRequest(selectedDogs);
        }}
        sx={{
          marginY: 16,
          margin: 32,
          minWidth: 100,
          maxHeight: 50,
        }}
      >
        MATCH!
      </Button>
    </Stack>
  );
}

export { FilterStack };
