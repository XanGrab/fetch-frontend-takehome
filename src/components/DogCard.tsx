import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { Dog } from "../Dog";
import { idToDog } from "../Util";
import { useState } from "react";

function DogCard({ dogId }: { dogId: string }) {
  const [dog, setDog] = useState<Dog>({
    id: "",
    img: "",
    name: "...",
    age: 0,
    zip_code: "",
    breed: "",
  });

  async function loadDog(id: string) {
    let newDog = await idToDog([id]);
    setDog(newDog as Dog);
  }

  loadDog(dogId);

  return (
    <Card sx={{ maxWidth: 345 }}>
      {dog ? (
        <Grid item key={dog.id} xs={12} sm={6} md={4}>
          <CardMedia sx={{ height: 140 }} src={dog.img} title={dog.name} />
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
      ) : (
        <Grid item key={"skeletonImg"} xs={12} sm={6} md={4}>
          <Skeleton
            sx={{ width: 210, height: 140 }}
            animation="wave"
            variant="rectangular"
          />
          <Skeleton sx={{ width: 210, height: 40 }} variant="text" />
          <Skeleton sx={{ width: 210, height: 40 }} variant="text" />
          <Skeleton sx={{ width: 210, height: 40 }} variant="text" />
        </Grid>
      )}
      <CardActions>
        <Button size="small">Select</Button>
      </CardActions>
    </Card>
  );
}

export default DogCard;
