document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("SignInBtn");

  signInBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
      email,
      password,
    };

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Toastify({
          text: result.message,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();

        localStorage.setItem("user", JSON.stringify(result.data));
        localStorage.setItem("token", result.token);

        setTimeout(() => {
          switch (result.data.role) {
            case "usuario":
              window.location.href = "/perfil-usuario";
              break;
            case "abogado":
              window.location.href = "/perfil-abogado";
              break;
            case "admin":
              window.location.href = "/perfil-admin";
              break;
            default:
              console.error("Rol desconocido:", result.data.role);
          }
        }, 3000);
      } else {
        Toastify({
          text: result.message,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }).showToast();
      }
    } catch (error) {
      Toastify({
        text: "Ocurrió un error al iniciar sesión",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
    }
  });
});
