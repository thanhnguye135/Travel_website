exports.hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

exports.showAlert = (type, message) => {
  hideAlert();
  const nota = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector('body').insertAdjacentElement('afterbegin', nota);

  window.setTimeout(() => {
    hideAlert();
  }, 5000);
};
