import "./App.css";
import { authUser } from "../UserAuth";
import { User } from "../User";

function UserForm({ setUser }: { setUser: (user: User) => void }) {
  return (
    <>
      <h2>Please Enter User Credentials</h2>
      <form id="userForm">
        <fieldset>
          <label htmlFor="username">Enter your username</label>
          <input type="text" id="username" name="username" />
          <br />
        </fieldset>

        <fieldset>
          <label htmlFor="useremail">Enter your email</label>
          <input type="text" id="useremail" name="useremail" />
          <br />
        </fieldset>
        <br />
        <div className="card">
          <button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              const form: HTMLFormElement = document.getElementById(
                "userForm"
              ) as HTMLFormElement;

              const data = new FormData(form);
              let response = await authUser(data);
              if (response?.ok) {
                setUser({
                  name: data.get("username") as string,
                  email: data.get("useremail") as string,
                });
              }
            }}
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
}

export default UserForm;
