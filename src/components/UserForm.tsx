import { Box, Button, Container, TextField } from "@mui/material";
import "../App.css";
import { User } from "../User";
import { FETCH_AUTH_ENDPOINT, FETCH_BASE_URI, handleFetch } from "../Util";

function UserForm({ setUser }: { setUser: (user: User) => void }) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log("DEBUG [UserForm > handleSubmit] data:", data);

    let response = await authUser(data);
    if (response?.ok) {
      setUser({
        name: data.get("name") as string,
        email: data.get("email") as string,
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <h2>Fetch your perfect match!</h2>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
}

async function authUser(form: FormData) {
  let postHeader = new Headers();
  postHeader.append("Content-Type", "application/json");
  postHeader.append("Cookies", document.cookie);
  const raw = JSON.stringify({
    name: form.get("name"),
    email: form.get("email"),
  });

  const config: RequestInit = {
    method: "POST",
    headers: postHeader,
    body: raw,
    redirect: "follow",
    credentials: "include",
  };

  let input = FETCH_BASE_URI + FETCH_AUTH_ENDPOINT;
  const request = new Request(input, config);

  try {
    let responce = await handleFetch(request);
    if (responce?.ok) {
      console.log("POST Sucess: user authenticated\n", responce.ok);
    }
    return responce;
  } catch (err) {
    console.error("[authUser > POST] Error:", err);
  }
}

export default UserForm;
