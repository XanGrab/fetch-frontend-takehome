import "./App.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { LOGOUT_ENDPOINT, BASE_URI, handleFetch } from "./Util";
import { User } from "./User";
import UserForm from "./components/UserForm";
import MainQuery from "./templates/MainQuery";
import {
  AppBar,
  Container,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

const queryClient = new QueryClient();

function App() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogoutAccount = () => {
    logoutUser();
    setAnchorEl(null);
    setAuthUser(null);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar disableGutters>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              flexGrow: 1,
            }}
          >
            FETCH YOUR DOG 🐶
          </Typography>

          {authUser && (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleAccountMenu}
                sx={{ mr: 2 }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="account-menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleLogoutAccount}
              >
                <MenuItem onClick={handleLogoutAccount}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      {authUser ? (
        <QueryClientProvider client={queryClient}>
          <MainQuery />
        </QueryClientProvider>
      ) : (
        <UserForm setUser={setAuthUser} />
      )}
    </>
  );
}

async function logoutUser() {
  let postHeader = new Headers();
  postHeader.append("Content-Type", "application/json");
  postHeader.append("Cookies", document.cookie);

  const config: RequestInit = {
    method: "POST",
    headers: postHeader,
    redirect: "follow",
    credentials: "include",
  };

  let input = BASE_URI + LOGOUT_ENDPOINT;
  const request = new Request(input, config);

  try {
    let responce = await handleFetch(request);
    if (responce?.ok) {
      console.log("POST Sucess: user invalidated\n", responce.ok);
    }
    return responce;
  } catch (err) {
    console.error("[authUser > POST] Error:", err);
  }
}

export default App;
