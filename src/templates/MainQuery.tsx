import "./App.css";

function MainQuery() {
  return (
    <>
      <label htmlFor="dog-search">Find dogs near you</label>
      <br />
      <input type="search" id="dog-search" name="dog-search" />

      <button>Search</button>
    </>
  );
}

export default MainQuery;
