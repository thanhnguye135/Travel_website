document.addEventListener('DOMContentLoaded', function () {
  const rowsPerPage = 10; // Number of rows per page

  function showPage(tabPane, page) {
    const table = tabPane.querySelector('table.table');
    const rowData = Array.from(table.querySelectorAll('tbody tr'));
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Hide all rows, then show only the rows for the current page
    rowData.forEach((row, index) => {
      row.style.display = index >= startIndex && index < endIndex ? '' : 'none';
    });

    // Handle Previous and Next buttons
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

    // Update the active page link
    const paginationLinks = tabPane.querySelectorAll('.page-item');
    paginationLinks.forEach((link) => link.classList.remove('active'));
    const currentPageLink = tabPane.querySelector(
      `.page-item:nth-child(${page + 1})`
    );
    if (currentPageLink) {
      currentPageLink.classList.add('active');
    }
  }

  const tabContent = document.querySelector('.tab-content');

  tabContent.addEventListener('click', function (event) {
    if (
      event.target.tagName === 'A' &&
      event.target.classList.contains('page-link')
    ) {
      event.preventDefault();
      const tabPane = event.target.closest('.tab-pane');
      const currentPage =
        parseInt(tabPane.getAttribute('data-current-page')) || 1;
      let newPage = currentPage;

      if (event.target.textContent === 'Next') {
        newPage = currentPage + 1;
      } else if (event.target.textContent === 'Previous') {
        newPage = currentPage - 1;
      } else {
        newPage = parseInt(event.target.textContent);
      }

      tabPane.setAttribute('data-current-page', newPage);
      showPage(tabPane, newPage);
    }
  });

  // Initial load: show the first page for each tab
  document.querySelectorAll('.tab-pane').forEach((tabPane) => {
    tabPane.setAttribute('data-current-page', 1);
    showPage(tabPane, 1);
  });
});
