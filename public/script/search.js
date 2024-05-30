document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn chặn việc gửi form mặc định

    const query = searchInput.value.trim();
    if (query) {
      // Thực hiện tìm kiếm
      searchTours(query);
    }
  });

  function searchTours(query) {
    axios
      .get(`/search?query=${encodeURIComponent(query)}`)
      .then((response) => {
        const tours = response.data; // Giả sử server trả về danh sách các tour
        // Xử lý kết quả tìm kiếm và cập nhật DOM
        displaySearchResults(tours);
      })
      .catch((error) => {
        console.error('There was an error making the search request:', error);
      });
  }

  function displaySearchResults(tours) {
    // Ví dụ: cập nhật một phần của DOM với kết quả tìm kiếm
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Xóa kết quả cũ

    if (tours.length > 0) {
      tours.forEach((tour) => {
        const tourElement = document.createElement('div');
        tourElement.className = 'tour';
        tourElement.innerHTML = `
            <h2>${tour.name}</h2>
            <p>${tour.description}</p>
          `;
        resultsContainer.appendChild(tourElement);
      });
    } else {
      resultsContainer.innerHTML = '<p>Không tìm thấy kết quả nào.</p>';
    }
  }
});
