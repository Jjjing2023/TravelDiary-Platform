    // Load the post details when the page loads
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    console.log(postId);
    fetchPostDetails(postId);
}