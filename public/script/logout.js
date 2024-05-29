const logOutBtn = document.querySelector('.nav__el--logout');

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/log-out',
    });

    if ((res.data.status = 'success')) location.assign('/overview');
  } catch (err) {
    // console.log(err);
    alert('error', 'Lỗi đăng xuất. Vui lòng thử lại sau!');
  }
};

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
