document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".menu-icon");
  const navMenu = document.querySelector("nav ul");
  const playIcon = document.querySelector(".play-icon");
  const videoPlayer = document.querySelector(".video-player");
  const video = videoPlayer ? videoPlayer.querySelector("video") : null;
  const loginButton = document.querySelector(".btn a");

  if (menuIcon && navMenu) {
    menuIcon.addEventListener("click", function () {
      if (navMenu.style.display === "block") {
        navMenu.style.display = "none";
      } else {
        navMenu.style.display = "block";
      }
    });
  }

  if (playIcon && videoPlayer) {
    playIcon.addEventListener("click", function () {
      videoPlayer.classList.remove("hide");
    });

    videoPlayer.addEventListener("click", function (event) {
      if (video && !video.contains(event.target)) {
        videoPlayer.classList.add("hide");
      }
    });
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.role) {
    switch (user.role) {
      case "usuario":
        loginButton.href = "/perfil-usuario";
        loginButton.textContent = "Perfil";
        break;
      case "abogado":
        loginButton.href = "/perfil-abogado";
        loginButton.textContent = "Perfil";
        break;
      case "admin":
        loginButton.href = "/perfil-admin";
        loginButton.textContent = "Perfil";
        break;
      default:
        console.error("Rol desconocido:", user.role);
    }
  }
});
