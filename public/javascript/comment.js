async function commentHandler(event) {
  event.preventDefault();

  const input_text = document
    .querySelector('textarea[name="comment-input"]')
    .value.trim();
  const blog_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  if (input_text) {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ blog_id, input_text }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText);
    }
  }
}

document
  .querySelector(".comment-form")
  .addEventListener("submit", commentHandler);
