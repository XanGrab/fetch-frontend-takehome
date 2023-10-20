import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { idToDog } from "../util";
import TempCard from "./TempCard";
import { useQuery } from "react-query";
import { useState } from "react";
import { FavoriteBorderRounded, FavoriteRounded } from "@mui/icons-material";

function DogCard({
  dogId,
  selectedDogs = [],
  setSelectedDogs = undefined,
}: {
  dogId: string;
  selectedDogs?: Array<string>;
  setSelectedDogs?: any;
}) {
  const [selected, setSelected] = useState(selectedDogs.includes(dogId));
  const { data: dog, status } = useQuery({
    queryKey: ["dog", dogId],
    queryFn: () => {
      let dog = idToDog([dogId]);
      return dog;
    },
  });

  if (status === "loading") {
    return <TempCard />;
  }
  if (status === "error") {
    return <p>Error!</p>;
  }

  if (dog) {
    return (
      <Card
        elevation={selected ? 8 : 2}
        sx={{
          margin: 4,
          maxWidth: 345,
          width: 240,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid item key={dog.id} xs={12} sm={4}>
          <CardMedia
            sx={{ width: 240, height: 140 }}
            image={dog.img}
            title={dog.name}
          />
          <CardContent sx={{ width: 240 }}>
            <Typography variant="inherit" color="text.primary">
              Name: {dog.name}
            </Typography>
            <Typography variant="inherit" color="text.secondary">
              Breed: {dog.breed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Age: {dog.age}
            </Typography>
          </CardContent>
        </Grid>
        <CardActions>
          {setSelectedDogs && (
            <IconButton
              size="small"
              onClick={() => {
                setSelected(!selected);
                if (selectedDogs.includes(dog.id)) {
                  console.log(
                    `DEBUG [DogCard ${dogId}] remove me ->`,
                    selectedDogs
                  );
                  setSelectedDogs(selectedDogs.filter((id) => id != dog.id));
                } else {
                  console.log(
                    `DEBUG [DogCard ${dogId}] add me ->`,
                    selectedDogs
                  );
                  setSelectedDogs([...selectedDogs, dog.id]);
                }
              }}
            >
              {selected ? (
                <FavoriteRounded fontSize="medium" color="secondary" />
              ) : (
                <FavoriteBorderRounded fontSize="medium" />
              )}
            </IconButton>
          )}
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
