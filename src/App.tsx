import "./App.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { User } from "./User";
import UserForm from "./components/UserForm";
import MainQuery from "./templates/MainQuery";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";

const queryClient = new QueryClient();

function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    name: null,
    email: null,
  });
  //   const [selectedDogs, setSelectedDogs] = useState([] as string[]);
  //   const [queriedDogs, setQueriedDogs] = useState([] as string[]);

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />

      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap>
              Fetch Your Dog 🐶
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <br />
      <section className="body">
        {currentUser.name ? (
          <QueryClientProvider client={queryClient}>
            <MainQuery />
          </QueryClientProvider>
        ) : (
          <UserForm setUser={setCurrentUser} />
        )}
      </section>
    </Container>
  );
}

export default App;
