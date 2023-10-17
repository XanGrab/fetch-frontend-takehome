import "./App.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { User } from "./User";
import UserForm from "./components/UserForm";
import MainQuery from "./components/MainQuery";
import {
  AppBar,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { purple, yellow } from "@mui/material/colors";

const queryClient = new QueryClient();

function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    name: null,
    email: null,
  });

  const theme = createTheme({
    palette: {
      primary: purple,
      secondary: yellow,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppBar color="primary" position="static">
        <CssBaseline />
        <Typography variant="h6" noWrap>
          Fetch Your Dog 🐶
        </Typography>
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
    </ThemeProvider>
  );
}

export default App;
