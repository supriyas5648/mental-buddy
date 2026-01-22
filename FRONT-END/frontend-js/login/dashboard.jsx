import { useEffect } from "react";

function Dashboard() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return <h2>Dashboard (Protected)</h2>;
}

export default Dashboard;
