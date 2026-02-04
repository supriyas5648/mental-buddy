import axios from "axios";
import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState({});

  if (!profile) { //avoid blank page illusion
  return <h2>Loading profile...</h2>;
}

  useEffect(() => {
    axios.get("http://localhost:5000/api/profile", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
    .then(res => setProfile(res.data))
     .catch(err => {
      console.error("PROFILE API ERROR:", err);
  });
  }, []);

  return <pre>{JSON.stringify(profile, null, 2)}</pre>;
}

export default Profile;
