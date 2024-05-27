document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.form');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#mail').value;

    const response = await axios({
      method: 'POST',
      url: '/api/v1/booking-email',
      data: {
        name,
        email,
      },
    });

    // console.log(response);

    if (response.ok) {
      alert('Đăng kí được lưu thành công!');
    } else {
      alert('Lỗi lưu đăng kí!');
    }
  });
});
