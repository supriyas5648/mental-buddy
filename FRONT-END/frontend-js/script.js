document.getElementById("submitBtn").addEventListener("click", async () => {
    const text = document.getElementById("moodText").value;

    if (!text) {
        alert("Please write something");
        return;
    }
    //async means : i will wait for the server's response (cant use await without async)
    //fetch is used to make network requests
    //await means : wait for this to finish before moving on

    //“Send a request to server’s /analyze route”
    const response = await fetch("http://localhost:5000/analyze", { //send data to backend server
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text }) //json obj -> json string
    });

    const data = await response.json(); //get response from backend server

    localStorage.setItem("result", JSON.stringify(data)); //save object as string in local storage
    window.location.href = "result.html"; //redirect to result page
});
