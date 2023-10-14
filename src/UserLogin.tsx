import "./App.css";

function LoginForm() {
  return (
    <>
      <h1>Enter User Credentials</h1>
      <form>
        <fieldset>
          <label for="username">Enter your username</label>
          <input type="text" id="username" name="username" />
          <br />
        </fieldset>
        <fieldset>
          <label for="useremail">Enter your email</label>
          <input type="text" id="useremail" name="useremail" />
          <br />
        </fieldset>
      </form>
    </>
  );
}

export default LoginForm;
