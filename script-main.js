document.addEventListener('DOMContentLoaded', function() {
   loadData();

   const searchInput = document.getElementById('searchInput');
   searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
         performSearch(searchInput.value);
      }
  });
});

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

      tableBody.appendChild(row);
   });
}

var modal = document.getElementById("myModal-add");
var btn = document.getElementById("openModalBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
    modal.style.display = "block";
}
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

let alldata = [];
document.getElementById('btn_add_book').addEventListener('click', async function(event) {
   event.preventDefault();
   Messages.innerHTML = '';

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
      const response = await fetch('', { // заменить URL
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
      });

      if (!response.ok) {
         throw new Error('Ошибка сети');
      }

      const result = await response.json();
      alldata = result;
      populateTable(alldata);
      Messages.innerHTML = 'Книга успешно добавлена!'
   } catch (error) {
      console.error('Ошибка:', error);
      Messages.innerHTML = 'Ошибка при отправке данных';
   }
});