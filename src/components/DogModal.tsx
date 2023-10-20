import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { Dog } from "../types/types";

function DogModal({
  matchedDog,
  setMatchedDog,
}: {
  matchedDog: Dog;
  setMatchedDog: any;
}) {
  const [dog, setDog] = useState<Dog | null>(matchedDog);
  useEffect(() => {
    console.dir("DEBUG [DogModal] dog:", dog);
  }, [dog]);

  if (typeof matchedDog == null || typeof matchedDog == undefined) {
    console.error("ERROR [DogModal] received invalid dog ", dog);
  } else {
    setDog(matchedDog);
  }

  return (
    <Modal
      open={Boolean(dog)}
      onClose={() => {
        setDog(null);
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
