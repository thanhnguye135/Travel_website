const stripe = Stripe(
  'pk_test_51PJTm4KfOPPh1e1TBuGNFOuhsHq7mOOYLsPjppLLqAujt5oiKmB4AS9cmp5eM3vQzUVclhF0mziTYt7FLh9h765E00XCtsiEAL'
);

const bookTour = async (tourID) => {
  try {
    // 1) Get checkout session
    const {
      data: { session },
    } = await axios.get(
      `http://localhost:5000/api/v1/bookings/checkout-session/${tourID}`
    );

    // 2) Redirect to checkout
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    alert('Error: Unable to book the tour. Please try again later.');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const bookBtn = document.getElementById('book-tour');

  if (bookBtn) {
    bookBtn.addEventListener('click', async (event) => {
      event.target.textContent = 'Processing...';
      const { tourID } = event.target.dataset;
      await bookTour(tourID);
      event.target.textContent = 'Book Now';
    });
  }
});
