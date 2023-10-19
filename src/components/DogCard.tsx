import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Dog } from "../types";
import TempCard from "./TempCard";
import { useQuery } from "react-query";
import { FETCH_BASE_URI, handleFetch } from "../Util";
import { useState } from "react";

/**
 *
 * @param ids an array of dog ids, trimmed to the first 100 Ids
 * @returns An
 */
async function idToDog({ queryKey }: { queryKey: any }) {
  let [_key, ids] = queryKey;
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
  const request = new Request(FETCH_BASE_URI + "/dogs", requestOptions);

  let dog: Dog | null = null;
  try {
    let response = await handleFetch(request);
    let res_body = await response?.text();
    let res_json = JSON.parse(res_body as string);
    dog = res_json[0];

    return dog;
  } catch (err) {
    console.error(err);
  }
}

function DogCard({
  dogId,
  selectedDogs,
  setSelectedDogs,
}: {
  dogId: string;
  selectedDogs: Array<string>;
  setSelectedDogs: any;
}) {
  const [selected, setSelected] = useState(dogId in selectedDogs);
  const { data: dog, status: dog_status } = useQuery({
    queryKey: ["dog", [dogId]],
    queryFn: idToDog,
  });

  if (dog_status === "loading") {
    return <TempCard />;
  }
  if (dog_status === "error") {
    return <p>Error!</p>;
  }

  if (dog) {
    return (
      <Card
        elevation={selected ? 8 : 2}
        sx={{
          maxWidth: 345,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid item key={dog.id} xs={12} sm={6} md={4}>
          <CardMedia
            sx={{ width: 240, height: 140 }}
            image={dog.img}
            title={dog.name}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {dog.breed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dog.age}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dog.zip_code}
            </Typography>
          </CardContent>
        </Grid>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              setSelected(!selected);
              if (!selected) {
                setSelectedDogs([...selectedDogs, dog.id]);
              } else {
                setSelectedDogs(
                  selectedDogs.filter((id) => {
                    return id !== dog.id;
                  })
                );
              }
            }}
          >
            Select
          </Button>
        </CardActions>
      </Card>
    );
  } else {
    console.error(
      "DEBUG [DogCard] creating card for dog ",
      dogId,
      " which is ",
      dog
    );
  }
}

export default DogCard;
