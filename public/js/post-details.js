// Load the post details when the page loads
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  console.log(postId);
  fetchPostDetails(postId);
};

// button controller
document.querySelector("#allPostsbtn1").addEventListener("click", function () {
  location.href = "/#posts-list";
});
document.querySelector("#signupButton").addEventListener("click", function () {
  document.location.href = "/signup.html";
});