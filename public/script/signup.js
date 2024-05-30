const signupForm = document.getElementById('signup-form');
console.log(signupForm);
const signup = async (email, name, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/sign-up',
      data: {
        email,
        name,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      alert('success', 'Đăng ký thành công!');
      window.setTimeout(() => {
        location.assign('/overview');
      }, 1500);
    }
  } catch (err) {
    alert('error', err.response.data.message);
  }
};

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(email, name, password, passwordConfirm);
  });
}
