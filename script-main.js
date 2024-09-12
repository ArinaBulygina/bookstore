// обработчик загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
   loadData();
   
   // поиск по таблице
   const searchInput = document.getElementById('searchInput');
   const resetButton = document.getElementById('resetButton');
   searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
         performSearch(searchInput.value);
         resetButton.style.display = 'inline-block';
      }
   });

   // сброс поиска
   resetButton.addEventListener('click', function() {
      searchInput.value = ''; 
      populateTable(allData); 
      resetButton.style.display = 'none'; 
      filteredData = allData; 
   });

   // обработчик кнопки "Сортировка по возрастанию"
   const sortAscButton = document.getElementById('sortAscButton');
   sortAscButton.addEventListener('click', function() {
      const sortedData = sortBooksByPrice(filteredData, 'asc');
      populateTable(sortedData);
   });

   // обработчик кнопки "Сортировка по убыванию"
   const sortDescButton = document.getElementById('sortDescButton');
   sortDescButton.addEventListener('click', function() {
      const sortedData = sortBooksByPrice(filteredData, 'desc');
      console.log("sortedData:", sortedData);
      populateTable(sortedData);
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

// функция для поиска книг по данным из таблицы
let filteredData = [];
function performSearch(query) {
   const lowerCaseQuery = query.toLowerCase();
      filteredData = allData.filter(item => {
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
   console.log('filteredData:', filteredData);
   populateTable(filteredData);
}

// сортировка данных в указанном виде
function sortBooksByPrice(data, order) {
   return data.slice().sort((a, b) => {
       if (order === 'asc') {
         return a.price - b.price;
      } else {
         return b.price - a.price;
      }
  });
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
      const response = await fetch('http://127.0.0.1:8000/book-infforsale/', { //добавить!!!!!!!!!!!!!!!!!!
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
      showModal(booksData.books);
   } catch (error) {
      console.error('Ошибка при получении данных выбранных книг:', error);
   }
});

function showModal(booksData) {
   const modal = document.getElementById('modal');
   const modalContent = document.getElementById('modal-content-sell');
   
   modalContent.innerHTML = booksData.map(book => `
      <div style="margin: 10px;">
            <div style="font-size: 16px; color: white;">ID:</div>
            <input type="text" style="margin: 10px; width: 50%;" class="input-book" id="id_${book.id_book}" value="${book.id_book}" readonly>
    
            <div style="font-size: 16px; color: white;">Название:</div>
            <input type="text" style="margin: 10px;  width: 50%;" class="input-book" id="title_${book.id_book}" value="${book.title}" readonly>

            <div style="font-size: 16px; color: white;">Цена:</div>
            <input type="number" style="margin: 10px; width: 50%;" class="input-book" id="price_${book.price_of_sale}" value="${book.price_of_sale}" readonly>
    
            <div style="font-size: 16px; color: white;">Регистрационные номера:</div>
            <input type="text" style="margin: 10px; width: 50%;" class="input-book" id="book_numbers_${book.id_book}" value="${book.book_numbers.join(', ')}">
      </div>
      `).join('');
   
   modal.style.display = "block";

   var span_sell = document.getElementsByClassName("close-sell")[0];
   span_sell.onclick = function() {
      modal.style.display = "none";
      selectedBooks = [];
   }

   window.onclick = function(event) {
      if (event.target == modal) {
         modal.style.display = "none";
         selectedBooks = [];
      }
   }
}

function getCookie(name) {
   const nameEQ = name + "=";
   const ca = document.cookie.split(';');
   for(let i = 0; i < ca.length; i++) {
       let c = ca[i];
       while (c.charAt(0) === ' ') {
           c = c.substring(1, c.length);
       }
       if (c.indexOf(nameEQ) === 0) {
           return c.substring(nameEQ.length, c.length);
       }
   }
   return null;
}

const userId = getCookie("userId");

// Обработчик событий для кнопки "Продать"
let AllDatas = [];
document.getElementById('sell-books').addEventListener('click', async function() {
    const booksToSell = [];
    Messages_sell.innerHTML = ''

    // Получение всех блоков, содержащих информацию о каждой книге
    const bookBlocks = document.querySelectorAll('#modal-content-sell > div');

    bookBlocks.forEach(block => {
        const bookNumberInput = block.querySelector('input[id^="book_numbers_"]');
        const priceInput = block.querySelector('input[id^="price_"]');

        // Получение данных книги
        const bookNumber = bookNumberInput.value.split(',').map(num => num.trim());
        const priceOfSale = parseFloat(priceInput.value);

        // Создание объекта для каждой книги и добавление в массив
        bookNumber.forEach(number => {
            booksToSell.push({
                book_number: number,
                id_seller: userId,
                price_of_sale: priceOfSale
            });
        });
    });

    try {
        // Отправка данных на сервер
        const response = await fetch('', { //добавить!!!!
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(booksToSell)
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const result = await response.json();
        AllDatas = Array.isArray(result) ? result : [];
        populateTable(AllDatas);
        Messages_sell.innerHTML = 'Книги успешно проданы!'
    } catch (error) {
        console.error('Ошибка при продаже книг:', error);
        Messages_sell.innerHTML = 'Ошибка :(';
    }
});
