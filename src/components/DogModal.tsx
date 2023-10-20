import { Box, CardMedia, Modal, Typography } from "@mui/material";
import { Dog } from "../types/types";
import TempCard from "./TempCard";
import { useEffect, useState } from "react";

function DogModal({
  matchedDog,
  setMatchedDog,
}: {
  matchedDog: Dog;
  setMatchedDog: any;
}) {
  const [dog, setDog] = useState(matchedDog);
  useEffect(() => {
    console.dir("DEBUG [DogModal] dog:", dog);
  }, [dog]);

  return (
    <Modal
      open={Boolean(dog)}
      onClose={() => {
        setMatchedDog(null);
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <img src="src/assets/dog_emoji.svg" alt="test" />
        {/* {dog ? <img src={dog.img} alt={dog.name} /> : <TempCard />} */}
      </Box>
    </Modal>
  );
}

export default DogModal;
