document.addEventListener("DOMContentLoaded", function () {
   const loginForm = document.getElementById("loginForm");
   const idInput = document.getElementById("id");
   const passwordInput = document.getElementById("password");
   const registerButton = document.querySelector(".btn-reg");

   loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      errorMessages.innerHTML = '';

      const idValue = idInput.value.trim();
      const passwordValue = passwordInput.value.trim();

      if (!/^\d{8}$/.test(idValue)) {
         errorMessages.innerHTML = "ID должен состоять из 8 цифр.";
         return;
      }

      try {
         const response = await fetch("http://127.0.0.1:8000/login/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ id_seller: idValue, password: passwordValue })
         });

         if (!response.ok) {
            throw new Error("Ошибка сети");
         }

         const data = await response.json();
         console.log("Авторизация успешна:", data);
         window.location.href = "main.html"
      } catch (error) {
         console.error("Ошибка:", error);
         errorMessages.innerHTML = "Не удалось авторизоваться. Проверьте данные.";
      }
   });

   registerButton.addEventListener("click", function () {
      window.location.href = "registration.html";
   });
});