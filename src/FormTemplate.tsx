import "./App.css";
import { User } from "./User";
import { authUser } from "./UserAuth";

function FormTemplate() {
  return (
    <>
      <h1>Enter User Credentials</h1>
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
            onClick={(e) => {
              e.preventDefault();
              const form: HTMLFormElement = document.getElementById(
                "userForm"
              ) as HTMLFormElement;

              const data = new FormData(form);
              authUser(data);
            }}
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
}

export default FormTemplate;
