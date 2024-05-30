const stripe = Stripe(
  'pk_test_51PJTm4KfOPPh1e1TBuGNFOuhsHq7mOOYLsPjppLLqAujt5oiKmB4AS9cmp5eM3vQzUVclhF0mziTYt7FLh9h765E00XCtsiEAL'
);

const bookTour = async (tourID) => {
  try {
    // 1) Get checkout session
    const {
      data: { session },
    } = await axios.get(`/api/v1/bookings/checkout-session/${tourID}`);

    // 2) Redirect to checkout
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    alert('Error: Không thể đặt lịch ngay bây giờ. Vui lòng thử lại sau.');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const bookBtn = document.getElementById('book-tour');

  if (bookBtn) {
    bookBtn.addEventListener('click', async (event) => {
      event.target.textContent = 'Quá trình đang diễn ra...';
      const { tourID } = event.target.dataset;
      await bookTour(tourID);
      event.target.textContent = 'Đặt lịch ngay';
    });
  }
});
