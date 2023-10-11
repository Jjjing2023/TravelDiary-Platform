// Login function
function loginUser() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const messageElement = document.getElementById("login-message");

  fetch("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((err) => {
          throw new Error(err.message || "Failed to login.");
        });
      }
    })
    .then((data) => {
      console.log("Response data:", data);
      console.log(data);
      if (data.id) {
        localStorage.setItem("userId", data.id);
      }
      if (data.name) {
        localStorage.setItem("userName", data.name);
      }
      if (data.posts) {
        localStorage.setItem("userPosts", JSON.stringify(data.posts));
      }
      document.getElementById("login-section").style.display = "none";
      document.getElementById("welcome-section").style.display = "block";
      document.getElementById("username-display").textContent = data.name;
      messageElement.textContent = "Successfully logged in!";
      messageElement.style.color = "green";

    })
    .catch((error) => {
      console.error("Error:", error);
      messageElement.textContent = error.message || "Invalid email or password";
      messageElement.style.color = "red";
    });
}

// Check when refresh if the user is already logged in
document.addEventListener("DOMContentLoaded", (event) => {
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  if (userId && userName) {
    // Update UI to show that the user is logged in
    document.getElementById("login-section").style.display = "none";
    document.getElementById("welcome-section").style.display = "block";
    document.getElementById("username-display").textContent = userName; // Displaying user ID for now, replace with username if available
  }
});

// Logout function
function logoutUser() {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userPosts");
  // Update UI to show that the user is logged out
  document.getElementById("login-section").style.display = "block";
  document.getElementById("welcome-section").style.display = "none";
  window.location.href = "./"; // Redirect to the login page
}

// Function to display the new post form
document.getElementById("newpost-btn").addEventListener("click", function () {
  document.getElementById("newpost-section").style.display = "block";
});

// Function to fetch and display my posts
function fetchMyPosts() {
  const userPosts = JSON.parse(localStorage.getItem("userPosts"));

  if (!userPosts || !Array.isArray(userPosts)) {
    console.error("User posts not found or not in the correct format.");
    return;
  }
  // Fetch each post one by one using Promise.all
  const fetchPromises = userPosts.map((postId) =>
    fetch(`/posts/${postId}`)
  );

  Promise.all(fetchPromises)
    .then((responses) => Promise.all(responses.map((r) => r.json())))
    .then((posts) => {
      console.log(posts);
      console.log(JSON.stringify(posts, null, 2));

      // Now, 'posts' is an array of the user's posts
      renderPosts(posts, true); // true indicates these are "my posts"
    })
    .catch((error) => console.error("Error fetching user's posts:", error));
}

// Function to render posts
function renderPosts(posts, isMyPosts = false) {
  const postsSection = document.getElementById("posts-list");
  postsSection.innerHTML = "<h2>My posts</h2>"; // Clear current posts
  posts.forEach((post) => {
    if (post && post.post) {
      const postDiv = document.createElement("div");

      postDiv.className = "post";
      postDiv.innerHTML = `
    <div
    class="col-12 each-post"
    style="margin-bottom: 50px">
    <div
        class="post card">
        <div class="row">
            <div class="col-3 post-image">
                <img
                    src="${post.post.image}"
                    class="card-img-left"
                    alt="Post image"
                    style="width: 200px; height: 100%" />
            </div>
            <div class="col-7">
                <div class="card-body">
                    <h3>${post.post.title}</h3>
                    <p>${post.post.description}</p>
                </div>
            </div>
        </div>
    </div>
</div>
        `;

      postsSection.appendChild(postDiv);

      if (isMyPosts) {
        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-primary";
        editBtn.innerText = "Edit";
        editBtn.onclick = () => {
          const form = postDiv.querySelector(".edit-post-form");
          form.style.display = "block"; // Display the form
        };
        postDiv.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger";
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = () => deletePost(post.post._id); // Assuming each post has an _id
        postDiv.appendChild(deleteBtn);
      }

      // Add the edit form
      const editForm = document.createElement("form");
      editForm.className = "edit-post-form";
      editForm.style.display = "none"; // Initially hidden
      editForm.innerHTML = `
      <div class="mb-3">
      <label for="title">Title:</label>
      <input class="form-control" type="text" value="${
        post.post.title
      }" id="title" required>
  </div>
  <div class="mb-3">
      <label for="description">Description:</label>
      <textarea class="form-control" id="description" required>${
        post.post.description
      }</textarea>
  </div>
  <div class="mb-3">
      <label for="location">Location:</label>
      <input class="form-control" type="text" value="${
        post.post.location
      }" id="location" required>
  </div>
  <div>
      <label for="date">Date:</label>
      <input class="form-control" type="date" value="${
        new Date(post.post.date).toISOString().split("T")[0]
      }" id="date" required>
  </div>
  <div>
      <label for="image">Image URL:</label>
      <input class="form-control" type="text" value="${
        post.post.image
      }" id="image" required>
  </div>
  <div class="edit-button"><button class="btn btn-primary" type="submit">Update Post</button></div>
        
      `;
      postDiv.appendChild(editForm);

      // Handle edit form submission
      editForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const updatedTitle = e.target.elements.title.value;
        const updatedDescription = e.target.elements.description.value;
        const updatedLocation = e.target.elements.location.value;
        const updatedDate = e.target.elements.date.value;
        const updatedImage = e.target.elements.image.value;

        fetch(`/posts/${post.post._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription,
            location: updatedLocation,
            date: updatedDate,
            image: updatedImage,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              alert("Post updated successfully!");
            } else {
              alert(data.message || "Failed to update post.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Error updating post.");
          });
      });
    }
  });
}

// Function to add a new post
document
  .getElementById("newpost-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // To prevent the default form submission behavior

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const image = document.getElementById("image").value;


    const user = localStorage.getItem("userId");

    fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, location, date, image, user }),
    })
      .then((response) => response.json())
      .then((newPost) => {
        console.log(newPost);
        alert("Post added successfully");
        const userPosts = JSON.parse(localStorage.getItem("userPosts") || "[]");
        userPosts.push(newPost.post._id);
        localStorage.setItem("userPosts", JSON.stringify(userPosts));
        fetchMyPosts();
      })
      .catch((error) => console.error("Error:", error));
  });

// Function to delete a post
function deletePost(postId) {
  fetch(`/posts/${postId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Successfully deleted
        const userPosts = JSON.parse(localStorage.getItem("userPosts"));
        const updatedPosts = userPosts.filter((id) => id !== postId);
        localStorage.setItem("userPosts", JSON.stringify(updatedPosts));

        alert("Post deleted successfully");

        fetchMyPosts();
      } else {
        return response.json().then((err) => {
          throw new Error(err.message || "Failed to delete post.");
        });
      }
    })
    .catch((error) => {
      console.error("Error deleting post:", error);
      alert(error.message || "Error deleting post.");
    });
}


// Function to fetch and display all posts
function displayPosts() {
  fetch("/posts")
    .then((response) => response.json())
    .then((data) => {
      const postsSection = document.getElementById("posts-list");
      postsSection.innerHTML = "<h2>All Posts</h2>"; // Clear current posts
      const posts = data.posts;
      posts.forEach((post) => {
        postsSection.innerHTML += `
            <div
                            class="col-12 each-post"
                            style="margin-bottom: 50px">
                            <div
                                class="post card">
                                <div class="row">
                                    <div class="col-3 post-image">
                                        <img
                                            src="${post.image}"
                                            class="card-img-left"
                                            alt="Post image"
                                            style="width: 200px; height: 100%" />
                                    </div>
                                    <div class="col-7">
                                        <div class="card-body">
                                            <h3>${post.title}</h3>
                                            <p>${post.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <!-- /card -->
                                <button class="btn btn-primary" onclick="viewPostDetails('${post._id}')">View Details</button>
                            </div>
                        </div>
            `;
      });
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

// Go to post details page
function viewPostDetails(postId) {
  window.location.href = `post-details.html?id=${postId}`;
}

function fetchPostDetails(postId) {
  fetch(`/posts/${postId}`)
    .then((response) => response.json())
    .then((data) => {
      const postDetailsSection = document.getElementById("post-details");

      postDetailsSection.innerHTML = `
      <div id="post-detail" class="row">
      <div
          class="col-lg-4 post-image">
          <img src="${data.post.image}" alt="post image: ${data.post.title}" />
          </div>
          <div
          class="col-lg-8 post-content">
          <h3>${data.post.title}</h3>
                          <p>${data.post.description}</p>
                          <div class="post-footer">
                          <p>Location: ${data.post.location}</p>
            <p>Date: ${new Date(data.post.date).toLocaleDateString()}</p>
            </div>
          </div>
        `;
    })
    .catch((error) => console.error("Error fetching post details:", error));
}
// Load posts when the page loads
window.onload = displayPosts;
