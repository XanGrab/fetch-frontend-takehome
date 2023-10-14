import { useState } from "react";
import "./App.css";
import UserForm from "./UserForm";
import MainQuery from "./MainQuery";
import { User } from "../User";

function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    name: null,
    email: null,
  });

  function setUser(user: User) {
    setCurrentUser(user);
  }

  return (
    <section className="body">
      <h1>Fetch Latests Dogs 🐶</h1>
      {currentUser.name ? <MainQuery /> : <UserForm setUser={setUser} />}
    </section>
  );
}

export default App;
