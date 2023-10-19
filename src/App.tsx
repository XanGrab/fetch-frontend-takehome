import "./App.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { User } from "./User";
import UserForm from "./components/UserForm";
import MainQuery from "./templates/MainQuery";
import { AppBar, CssBaseline, Toolbar, Typography } from "@mui/material";

const queryClient = new QueryClient();

function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    name: null,
    email: null,
  });

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar disableGutters>
          <Typography component="h1" variant="h5" align="center">
            FETCH YOUR DOG 🐶
          </Typography>
        </Toolbar>
      </AppBar>
      <br />
      {/* <Container maxWidth="xl"> */}
      {currentUser.name ? (
        <QueryClientProvider client={queryClient}>
          <MainQuery />
        </QueryClientProvider>
      ) : (
        <UserForm setUser={setCurrentUser} />
      )}
      {/* </Container> */}
    </>
  );
}

export default App;
