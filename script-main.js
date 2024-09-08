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