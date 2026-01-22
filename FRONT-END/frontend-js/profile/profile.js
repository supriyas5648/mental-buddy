// email saved at login time
const email = localStorage.getItem("userEmail");

fetch(`http://localhost:5000/profile/${email}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("name").innerText = data.name;
    document.getElementById("email").innerText = data.email;
    document.getElementById("age").innerText = data.age;
    document.getElementById("gender").innerText = data.gender;
    document.getElementById("stress").innerText = data.stress;
  });
