document.addEventListener("DOMContentLoaded", () => {
  const signUpBtn = document.getElementById("SignUpBtn");

  signUpBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.querySelector("select[name='role']").value;

    const data = {
      name,
      email,
      password,
      role,
    };

    try {
      const response = await fetch("/api/v1/auth/register", {
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

        setTimeout(() => {
          window.location.href = "/login";
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
        text: "Ocurrió un error al registrar el usuario",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      }).showToast();
    }
  });
});
