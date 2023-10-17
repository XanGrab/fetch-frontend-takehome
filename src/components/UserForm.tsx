import "../App.css";
import { User } from "../User";
import { FETCH_AUTH_ENDPOINT, FETCH_BASE_URI, handleFetch } from "../Util";

function UserForm({ setUser }: { setUser: (user: User) => void }) {
  return (
    <>
      <h2>Login</h2>
      <form id="userForm">
        <fieldset>
          <label htmlFor="username">Enter your username</label>
          <input type="text" id="username" name="username" />
        </fieldset>

        <fieldset>
          <label htmlFor="useremail">Enter your email</label>
          <input type="text" id="useremail" name="useremail" />
        </fieldset>
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

async function authUser(form: FormData) {
  let postHeader = new Headers();
  postHeader.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    name: form.get("username"),
    email: form.get("useremail"),
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
    console.log("POST Sucess: user authenticated\n", responce?.ok);
    return responce;
  } catch (err) {
    console.error("[authUser > POST] Error:", err);
  }
}

export default UserForm;
