function signupUser() {
  const name = document.querySelector("#signup-name").value;
  const email = document.querySelector("#signup-email").value;
  const password = document.querySelector("#signup-password").value;

  fetch("/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  })
    .then((response) => {
      // Check if the response status indicates success (status code 200 to 299)
      if (!response.ok) {
        // If not successful, parse the response as JSON to get the error message
        return response.json().then((data) => {
          throw new Error(data.message || "Signup failed!");
        });
      }
      // If successful, return the parsed user data
      return response.json();
    })
    .then((data) => {
      if (data.user) {
        // If there's a user property in the response, signup was successful
        alert("Signup successful!");
        window.location.href = "/index.html"; // Redirect to the login page
      }
    })
    .catch((error) => {
      // Handle any errors that occurred during fetch or while handling the response
      alert(error.message || "An error occurred.");
    });
}
