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
  selectedDogs,
  setSelectedDogs,
}: {
  dogId: string;
  selectedDogs: Array<string>;
  setSelectedDogs: any;
}) {
  const [selected, setSelected] = useState(dogId in selectedDogs);
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
          {setSelectedDogs && (
            <IconButton
              size="small"
              onClick={() => {
                setSelected(!selected);
                if (dog.id in selectedDogs) {
                  let temp = [...selectedDogs];
                  temp.filter((id) => {
                    return id !== dog.id;
                  });
                  setSelectedDogs(temp);
                } else {
                  setSelectedDogs([...selectedDogs, dog.id]);
                }
              }}
            >
              {selected ? (
                <FavoriteRounded fontSize="medium" />
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
