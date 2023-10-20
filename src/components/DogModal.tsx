import { Box, CardMedia, Modal, Stack, Typography } from "@mui/material";
import { Dog } from "../types/types";

function DogModal({ dog, setMatchedDog }: { dog: Dog; setMatchedDog: any }) {
  console.dir("DEBUG [DogModal] Open Modal for ", dog);

  return (
    <Modal
      open={Boolean(dog)}
      onClose={() => {
        setMatchedDog(null);
      }}
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.paper",
          boxShadow: 24,
          width: "30%",
          height: "30%",
        }}
      >
        <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
          <CardMedia
            sx={{ width: 240, height: 140, marginY: 8 }}
            image={dog.img}
            title={dog.name}
          />
          <Typography variant="h2" color="text.primary">
            {dog.name}
          </Typography>
        </Stack>
      </Box>
    </Modal>
  );
}

export default DogModal;
