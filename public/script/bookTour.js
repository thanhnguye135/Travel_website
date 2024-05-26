import axios from 'axios';
const stripe = Stripe(
  'pk_test_51PJTm4KfOPPh1e1TBuGNFOuhsHq7mOOYLsPjppLLqAujt5oiKmB4AS9cmp5eM3vQzUVclhF0mziTYt7FLh9h765E00XCtsiEAL'
);

export const bookTour = async (tourID) => {
  try {
    //1) get checkout session
    const session = await axios(`/api/v1/bookings/checkout-session/${tourID}`);
    // console.log(session);

    //2) create checkout form
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    // console.log(err);
    alert(err);
  }
};

const bookBtn = document.getElementById('book-tour');

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourID } = e.target.dataset;
    bookTour(tourID);
  });
}
