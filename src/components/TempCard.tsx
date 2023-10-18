import { Card, Grid, Skeleton } from "@mui/material";

function TempCard() {
  return (
    <Card sx={{ maxWidth: 345 }}>
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
    </Card>
  );
}

export default TempCard;
