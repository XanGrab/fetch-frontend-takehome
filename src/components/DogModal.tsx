import { Box, CardMedia, Modal, Typography } from "@mui/material";
import { Dog } from "../types/types";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function DogModal({ dog, setDog }: { dog: Dog; setDog: any }) {
  return (
    <Modal
      open={Boolean(dog)}
      onClose={() => {
        setDog(null);
      }}
    >
      <Box sx={modalStyle}>
        <CardMedia
          sx={{ width: 240, height: 140 }}
          image={dog.img}
          title={dog.name}
        />
        <Typography variant="inherit" color="text.primary">
          Name: {dog.name}
        </Typography>
        <Typography variant="inherit" color="text.secondary">
          Breed: {dog.breed}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Age: {dog.age}
        </Typography>
      </Box>
    </Modal>
  );
}

export default DogModal;
