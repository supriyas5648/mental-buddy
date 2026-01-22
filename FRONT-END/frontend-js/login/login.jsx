import { useState } from "react"; //useState is a hook that allows us to use state in functional components

function Login() {
  const [email, setEmail] = useState(""); //email is the state variable, setEmail is the function to update it
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => { //handleLogin is an async function that triggers when the form is submitted
    e.preventDefault(); //stop browser from refreshing

    const response = await fetch("http://localhost:5000/login", {//fetch is used to make HTTP requests
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), //req send in json format
    });

    //response from backend is stored in resonse variable

    const data = await response.json(); //parse the json response

    if (response.ok) { //gets jwt
      localStorage.setItem("token", data.token); //stores jwt in local storage
      alert("Login successful");
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
