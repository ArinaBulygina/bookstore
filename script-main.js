// обработчик загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
   loadData();

   const searchInput = document.getElementById('searchInput');
   searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
         performSearch(searchInput.value);
      }
  });
});

// запрос к серверу на получение данных о всех книгах
let allData = []; 
async function loadData() {
   try {
      const response = await fetch('http://127.0.0.1:8000/book-details/'); // Надо вставить

      if (!response.ok) {
         throw new Error(`Ошибка: ${response.status}`);
      }

      const data = await response.json();
      allData = data;
      populateTable(allData);
   } catch (error) {
      console.error('Ошибка при получении данных:', error);
   }
}

// функция для поиска книг
function performSearch(query) {
   const lowerCaseQuery = query.toLowerCase();
      const filteredData = allData.filter(item => {
         const authorNames = item.authors.map(author => 
            `${author.author_last_name.toLowerCase()} ${author.author_first_name.toLowerCase()}`
         ).join(' ');

         return (
            item.title.toLowerCase().includes(lowerCaseQuery) || 
            item.publishing.toLowerCase().includes(lowerCaseQuery) || 
            item.genre.name_of_genre.toLowerCase().includes(lowerCaseQuery) || 
            authorNames.includes(lowerCaseQuery)
         );
      });
   populateTable(filteredData);
}

// функция заполнения таблицы с книгами данными с сервера
let selectedBook = null;
let selectedBooks = [];
function populateTable(data) {
   const tableBody = document.getElementById('data-table').querySelector('tbody');
   tableBody.innerHTML = '';

   data.forEach(item => {
      const row = document.createElement('tr');
      
      const idCell = document.createElement('td');
      idCell.textContent = item.id_book;
      row.appendChild(idCell);

      const titleCell = document.createElement('td');
      titleCell.textContent = item.title;
      row.appendChild(titleCell);

      const publishingCell = document.createElement('td');
      publishingCell.textContent = item.publishing;
      row.appendChild(publishingCell);

      const priceCell = document.createElement('td');
      priceCell.textContent = item.price;
      row.appendChild(priceCell);

      const rack_numberCell = document.createElement('td');
      rack_numberCell.textContent = item.rack_number;
      row.appendChild(rack_numberCell);

      const number_of_copiesCell = document.createElement('td');
      number_of_copiesCell.textContent = item.number_of_copies;
      row.appendChild(number_of_copiesCell);

      const discounted_priceCell = document.createElement('td');
      discounted_priceCell.textContent = item.discounted_price;
      row.appendChild(discounted_priceCell);

      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = item.description;
      row.appendChild(descriptionCell);

      const genreCell = document.createElement('td');
      genreCell.textContent = item.genre.name_of_genre;
      row.appendChild(genreCell);

      const name_of_discountCell = document.createElement('td');
      name_of_discountCell.textContent = item.discount && item.discount.name_of_discount ? item.discount.name_of_discount : '';
      row.appendChild(name_of_discountCell);

      const discountCell = document.createElement('td');
      discountCell.textContent = item.discount && item.discount.discount_percentage ? `${item.discount.discount_percentage}%` : '';
      row.appendChild(discountCell);

      const authorsCell = document.createElement('td');
      const authors = item.authors.map(author => `${author.author_last_name} ${author.author_first_name}`).join(', ');
      authorsCell.textContent = authors;
      row.appendChild(authorsCell);

      Array.from(row.children).forEach(cell => {
         cell.style.wordWrap = "break-word";
         cell.style.whiteSpace = "normal";
      });

      row.addEventListener('click', function() {
         selectedBook = item; 
      });

      row.addEventListener('click', function() {
         const index = selectedBooks.indexOf(item.id_book);

         if (index > -1) { // книга уже выбрана, убираем
            selectedBooks.splice(index, 1);
            row.classList.remove('selected');
         } else { // книга не выбрана, добавляем
            selectedBooks.push(item.id_book);
            row.classList.add('selected');
         }
      });

      tableBody.appendChild(row);
   });
}

var modal = document.getElementById("myModal-add");
var btn = document.getElementById("openModalBtn");
var span = document.getElementsByClassName("close-add")[0];
// открытие модального окна добавления книги
btn.onclick = function() {
    modal.style.display = "block";
}
// закрытие модального окна добавления книги
span.onclick = function() {
   modal.style.display = "none";
}
window.onclick = function(event) {
   if (event.target == modal) {
      modal.style.display = "none";
   }
}

// обработчик нажатия кнопки "Добавить книгу" на модальном окне
let alldata = [];
document.getElementById('btn_add_book').addEventListener('click', async function(event) {
   event.preventDefault();
   Messages_add.innerHTML = '';

   const title = document.getElementById('name-book').value.trim();
   const publishing = document.getElementById('publishing-book').value.trim();
   const price = document.getElementById('price-book').value.trim();
   const rack_number = document.getElementById('rack-number-book').value.trim();
   const description = document.getElementById('description-book').value.trim(); 
   const genre = document.getElementById('genre-book').value.trim();
   const name_of_discount = document.getElementById('name-of-discount-book').value.trim();
   const authorsStr = document.getElementById('authors-book').value.trim();
   const reg_numbersStr = document.getElementById('reg-numbers-book').value.trim();

   const authorsArr = authorsStr.split(',').map(author => {
      const parts = author.trim().split(' ');
      return {
         author_last_name: parts[0] || '',
         author_first_name: parts[1] || '',
         author_patronymic: parts[2] || null
      };
   });

   const regNumbersArr = reg_numbersStr ? reg_numbersStr.split(',').map(number => number.trim()) : [];

   const data = {
      title,
      publishing,
      price,
      genre,
      rack_number,
      description,
      discount: name_of_discount,
      authors: authorsArr,
      book_numbers: regNumbersArr,
   };
   try {
      const response = await fetch('http://127.0.0.1:8000/book/add/', { // заменить URL
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
      });

      if (!response.ok) {
         throw new Error('Ошибка сети');
      }

      const result = await response.json();
      alldata = Array.isArray(result) ? result : [];
      populateTable(alldata);
      Messages_add.innerHTML = 'Книга успешно добавлена!'
   } catch (error) {
      console.error('Ошибка:', error);
      Messages_add.innerHTML = 'Ошибка при отправке данных';
   }
});

var modal_up = document.getElementById("myModal-update");
var btn_up = document.getElementById("openModalBtn-update");
var span_up = document.getElementsByClassName("close-update")[0];
// открытие модального окна редактирования книги с данными о книге
btn_up.onclick = function() {
   openModalWithBookData(selectedBook);
}
// закрытие модального окна редактирования книги
span_up.onclick = function() {
   modal_up.style.display = "none";
   selectedBook = null;
}
window.onclick = function(event) {
   if (event.target == modal_up) {
      modal_up.style.display = "none";
      selectedBook = null;
   }
}

// функция автоматического заполнения input-ов в модальном окне для редактирования книг
function openModalWithBookData(bookData) {
   if (bookData) {
      document.getElementById('name-book-update').value = bookData.title;
      document.getElementById('publishing-book-update').value = bookData.publishing;
      document.getElementById('price-book-update').value = bookData.price;
      document.getElementById('rack-number-book-update').value = bookData.rack_number;
      document.getElementById('description-book-update').value = bookData.description;
      document.getElementById('genre-book-update').value = bookData.genre.name_of_genre;
      document.getElementById('name-of-discount-book-update').value = bookData.discount && bookData.discount.name_of_discount ? bookData.discount.name_of_discount : '';
      const authorsString = bookData.authors.map(author => `${author.author_last_name} ${author.author_first_name}`).join(', ');
      document.getElementById('authors-book-update').value = authorsString;;
      document.getElementById('myModal-update').style.display = 'block';
   } else {
      Swal.fire({
         icon: 'warning',
         title: 'Ошибка',
         text: 'Пожалуйста, выберите книгу для редактирования.'
      });
   }
}


// обработчик нажатия кнопки "Редактировать книгу" в модальном окне
let Alldata = [];
document.getElementById('btn_update_book').addEventListener('click', async function(event) {
   event.preventDefault();
   Messages_update.innerHTML = '';

   const title = document.getElementById('name-book-update').value.trim();
   const publishing = document.getElementById('publishing-book-update').value.trim();
   const price = document.getElementById('price-book-update').value.trim();
   const rack_number = document.getElementById('rack-number-book-update').value.trim();
   const description = document.getElementById('description-book-update').value.trim(); 
   const genre = document.getElementById('genre-book-update').value.trim();
   const name_of_discount = document.getElementById('name-of-discount-book-update').value.trim();
   const authorsStr = document.getElementById('authors-book-update').value.trim();
   const reg_numbersStr = document.getElementById('reg-numbers-book-update').value.trim();

   const authorsArr = authorsStr.split(',').map(author => {
      const parts = author.trim().split(' ');
      return {
         author_last_name: parts[0] || '',
         author_first_name: parts[1] || '',
         author_patronymic: parts[2] || null
      };
   });

   const regNumbersArr = reg_numbersStr ? reg_numbersStr.split(',').map(number => number.trim()) : [];

   const data = {
      title,
      publishing,
      price,
      genre,
      rack_number,
      description,
      discount: name_of_discount,
      authors: authorsArr,
      book_numbers: regNumbersArr,
   };
   try {
      const response = await fetch(`http://127.0.0.1:8000/book/${selectedBook.id_book}/update/`, { // заменить URL
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
      });

      if (!response.ok) {
         throw new Error('Ошибка сети');
      }

      const result = await response.json();
      Alldata = Array.isArray(result) ? result : [];
      populateTable(Alldata);
      Messages_update.innerHTML = 'Книга успешно отредактирована!'
   } catch (error) {
      console.error('Ошибка:', error);
      Messages_update.innerHTML = 'Ошибка при отправке данных';
   }
});

var modal_del = document.getElementById("myModal-delete");
var btn_del = document.getElementById("openModalBtn-delete");
var span_del = document.getElementsByClassName("close-delete")[0];
// открытие модального окна удаления книги с данными о книге
btn_del.onclick = function() {
   if (selectedBook) {
      if (Number(selectedBook.number_of_copies) == 0) {
         openModalDelete(selectedBook);
      } else {
         Swal.fire({
            icon: 'warning',
            title: 'Ошибка',
            text: 'Книгу нельзя удалить, так как есть непроданные экземпляры.'
         });
      }
   } else {
      Swal.fire({
         icon: 'warning',
         title: 'Ошибка',
         text: 'Пожалуйста, выберите книгу для удаления.'
      });
   }
}

// закрытие модального окна удаления книги
span_del.onclick = function() {
   modal_del.style.display = "none";
   selectedBook = null;
}
window.onclick = function(event) {
   if (event.target == modal_del) {
      modal_del.style.display = "none";
      selectedBook = null;
   }
}

// функция автоматического заполнения input-ов в модальном окне для удаления книг
function openModalDelete(bookData) {
      document.getElementById('name-book-delete').value = bookData.title;
      document.getElementById('publishing-book-delete').value = bookData.publishing;
      document.getElementById('price-book-delete').value = bookData.price;
      document.getElementById('rack-number-book-delete').value = bookData.rack_number;
      document.getElementById('description-book-delete').value = bookData.description;
      document.getElementById('genre-book-delete').value = bookData.genre.name_of_genre;
      document.getElementById('name-of-discount-book-delete').value = bookData.discount && bookData.discount.name_of_discount ? bookData.discount.name_of_discount : '';
      const authorsString = bookData.authors.map(author => `${author.author_last_name} ${author.author_first_name}`).join(', ');
      document.getElementById('authors-book-delete').value = authorsString;;
      document.getElementById('myModal-delete').style.display = 'block';
}

// обработчик нажатия кнопки "Удалить книгу" в модальном окне
let AllData = [];
document.getElementById('btn_delete_book').addEventListener('click', async function(event) {
   event.preventDefault();
   Messages_delete.innerHTML = '';

   try {
      const response = await fetch(`http://127.0.0.1:8000/books/${selectedBook.id_book}/`, {
         method: 'DELETE',
         headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
         throw new Error('Ошибка сети');
      }

      const result = await response.json();
      AllData = Array.isArray(result) ? result : [];
      populateTable(AllData);
      Messages_delete.innerHTML = 'Книга успешно удалена!'
   } catch (error) {
      console.error('Ошибка:', error);
      Messages_delete.innerHTML = 'Ошибка :(';
   }
});





document.getElementById('select-for-sale').addEventListener('click', async function() {
   if (selectedBooks.length === 0) {
      Swal.fire({
         icon: 'warning',
         title: 'Ошибка',
         text: 'Пожалуйста, выберите книги для продажи.'
      });
      return;
   }

   try {
      const response = await fetch('', { //добавить!!!!!!!!!!!!!!!!!!
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ book_ids: selectedBooks })
      });

      if (!response.ok) {
         throw new Error(`Ошибка: ${response.status}`);
      }

      const booksData = await response.json();
      showModal(booksData);
   } catch (error) {
      console.error('Ошибка при получении данных выбранных книг:', error);
   }
});

function showModal(booksData) {
   const modal = document.getElementById('modal');
   const modalContent = document.getElementById('modal-content-sell');
   
   modalContent.innerHTML = booksData.map(book => `
      <div>
            <strong>ID:</strong>
            <input type="text" id="id_${book.id_book}" value="${book.id_book}" readonly>
    
            <strong>Название:</strong>
            <input type="text" id="title_${book.id_book}" value="${book.title}" readonly>
    
            <strong>Издательство:</strong>
            <input type="text" id="book_numbers_${book.id_book}" value="${book.book_numbers.join(', ')}">
        </div>
      `).join('');
   
   modal.classList.add('open');

   var span_sell = document.getElementsByClassName("close-sell")[0];
   span_sell.onclick = function() {
      modal.classList.remove('open');
      selectedBooks = null;
   }

   window.onclick = function(event) {
      if (event.target == modal) {
         modal.classList.remove('open');
         selectedBooks = null;
      }
   }
}