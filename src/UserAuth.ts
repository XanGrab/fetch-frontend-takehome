import { User } from "./User";
const fetch_base_uri = "https://frontend-take-home-service.fetch.com";
const fetch_auth_endpoint = "/auth/login";

//Create a POST req and return the response object
async function POST(req: Request) {
  try {
    const response = await fetch(req);
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response;
  } catch (err) {
    console.error("[POST]", err);
  }
}

async function authUser(form: FormData) {
  let postHeader = new Headers();
  postHeader.append("Content-Type", "application/json");
  postHeader.append(
    "Cookie",
    "AWSALB=LLo9yUwBMA6u/ppHxD5EdKh+6hguzt7/JoB1IgLF2DGW5Xgfk5GWl9FWXRk5FwZqsEEzXnxla+klwQuBvCLfRjz6Yj+iACe0fd+qm/UZPITzSoQMy+xnsmps5tfW; AWSALBCORS=LLo9yUwBMA6u/ppHxD5EdKh+6hguzt7/JoB1IgLF2DGW5Xgfk5GWl9FWXRk5FwZqsEEzXnxla+klwQuBvCLfRjz6Yj+iACe0fd+qm/UZPITzSoQMy+xnsmps5tfW; fetch-access-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiWGFuZGVyIiwiZW1haWwiOiJzdW5iaXJkLmdyYWJvd3NraUBnbWFpbC5jb20iLCJpYXQiOjE2OTcyODI2NTIsImV4cCI6MTY5NzI4NjI1Mn0.sdTvQ7I3qJLUMLjeemCJBW0JAul8ME8zRmoolCdCj4U"
  );
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
  let input = fetch_base_uri + fetch_auth_endpoint;
  const request = new Request(input, config);

  try {
    let responce = await POST(request);
    console.log("POST Sucess: user authenticated\n", responce?.ok);
    return responce;
  } catch (err) {
    console.error("[authUser > POST] Error:", err);
  }
}

export { authUser };
