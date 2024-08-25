document.getElementById('phone').addEventListener('input', function(event) {
   const phoneInput = event.target;
   phoneInput.value = formatPhoneInput(phoneInput.value);
});

function formatPhoneInput(value) {
  const cleaned = value.replace(/^\+7\s|\D/g, '');
  let formatted = '+7 (___) ___-__-__';
  let index = 0;
  formatted = formatted.replace(/_/g, function() {
      return index < cleaned.length ? cleaned.charAt(index++) : '_';
  });
  return formatted;
}

document.getElementById('registrationForm').addEventListener('submit', async function(event) {
   event.preventDefault();

   const id = document.getElementById('id').value.trim();
   const password = document.getElementById('password').value.trim();
   const email = document.getElementById('email').value.trim();
   const phone = document.getElementById('phone').value.trim(); 

   if (!id || !password || !document.getElementById('surname').value.trim() ||
       !document.getElementById('name').value.trim() ||
       !document.getElementById('patronymic').value.trim() ||
       !email || !phone) {
       errorMessages.innerHTML = 'Все поля должны быть заполнены.';
       return;
   }

   if (!/^\d{8}$/.test(id)) {
       errorMessages.innerHTML = 'ID должен состоять из 8 цифр.';
       return;
   }

   if (!validateEmail(email)) {
       errorMessages.innerHTML = 'Введите корректный email.';
       return;
   }

   const data = {
       id,
       surname: document.getElementById('surname').value.trim(),
       name: document.getElementById('name').value.trim(),
       patronymic: document.getElementById('patronymic').value.trim(),
       email,
       phone: cleanPhoneNumber(phone)
   };
   try {
       const response = await fetch('', { // не забыть заменить URL
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data)
       });

       if (!response.ok) {
           throw new Error('Ошибка сети');
       }

       const result = await response.json();
       console.log(result);
       errorMessages.innerHTML = 'Регистрация прошла успешно!';
   } catch (error) {
       console.error('Ошибка:', error);
       errorMessages.innerHTML = 'Ошибка при отправке данных';
   }
});

function validateEmail(email) {
   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return re.test(email);
}

function cleanPhoneNumber(phone) {
   return phone.replace(/\D/g, '');
}