const loginForm = document.querySelector('.login-form');

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/log-in',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      alert('success', 'Đăng nhập thành công!');
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1500);
    }
  } catch (err) {
    alert('error', err.response.data.message);
  }
};

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}
