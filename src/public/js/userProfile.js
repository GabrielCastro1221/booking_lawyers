document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(
    ".buttons button, .btn-appointments"
  );
  const contents = document.querySelectorAll(".content div");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category");

      if (category === "profile") {
        location.reload();
        return;
      }

      contents.forEach((content) => {
        if (content.getAttribute("data-category") === category) {
          content.style.display = "block";
        } else {
          content.style.display = "none";
        }
      });
    });
  });
});
