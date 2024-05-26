document.addEventListener('DOMContentLoaded', function () {
  const tabContent = document.querySelector('.tab-content');

  tabContent.addEventListener('click', function (event) {
    if (
      event.target.tagName === 'A' &&
      event.target.classList.contains('page-link')
    ) {
      event.preventDefault();
      const page = parseInt(event.target.textContent);
      const tabPane = event.target.closest('.tab-pane');
      const table = tabPane.querySelector('table.table');
      const rowsPerPage = 10; // Số hàng trên mỗi trang

      // Tính toán vị trí bắt đầu và kết thúc của dữ liệu trên trang
      const startIndex = (page - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;

      // Lấy dữ liệu của trang hiện tại
      const rowData = Array.from(table.querySelectorAll('tbody tr'));
      const currentPageData = rowData.slice(startIndex, endIndex);

      // Hiển thị chỉ các hàng của trang hiện tại
      rowData.forEach((row) => (row.style.display = 'none'));
      currentPageData.forEach((row) => (row.style.display = ''));

      // Xử lý nút Previous và Next
      const previousBtn = tabPane.querySelector('.page-item.previous');
      const nextBtn = tabPane.querySelector('.page-item.next');

      if (page === 1) {
        previousBtn.classList.add('disabled');
      } else {
        previousBtn.classList.remove('disabled');
      }

      if (endIndex >= rowData.length) {
        nextBtn.classList.add('disabled');
      } else {
        nextBtn.classList.remove('disabled');
      }
    }
  });
});
