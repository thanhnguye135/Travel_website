document.addEventListener('DOMContentLoaded', function () {
  // Handle view button click
  document.querySelectorAll('.btn-view').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const userId = this.dataset.id;
      const tourId = this.dataset.id;

      //   try {
      //     // Fetch user details from the server
      //     const response = await axios.get(
      //       `http://localhost:5000/api/v1/users/${userId}`
      //     );
      //     const { data } = response.data;
      //     const { user } = data;

      //     // Populate the modal with user details
      //     document.getElementById('userName').textContent = user[0].name;
      //     document.getElementById('userEmail').textContent = user[0].email;
      //     document.getElementById('userPhoto').textContent = user[0].photo;
      //     document.getElementById('userRole').textContent = user[0].role;
      //     document.getElementById('userActive').textContent = user[0].active
      //       ? 'Dung hoat dong'
      //       : 'Dang hoat dong';
      //     // Add other user details as needed

      //     // Show the modal
      //     const userModal = new bootstrap.Modal(
      //       document.getElementById('userModal')
      //     );
      //     userModal.show();
      //   } catch (error) {
      //     console.error('Error fetching user details:', error);
      //     alert('Failed to fetch user details');
      //   }

      try {
        // Fetch tour details from the server
        const response = await axios.get(
          `http://localhost:5000/api/v1/tours/${tourId}`
        );
        const tour = response.data.data.tour;

        // Populate the modal with tour details
        document.getElementById('tourName').textContent = tour.name;
        document.getElementById(
          'tourDuration'
        ).textContent = `${tour.duration} days`;
        document.getElementById(
          'tourMaxGroupSize'
        ).textContent = `${tour.maxGroupSize} people`;
        document.getElementById('tourDifficulty').textContent = tour.difficulty;
        document.getElementById('tourRatingsAverage').textContent =
          tour.ratingsAverage;
        document.getElementById('tourRatingsQuantity').textContent =
          tour.ratingsQuantity;
        document.getElementById('tourPrice').textContent = `${tour.price} VND`;
        document.getElementById('tourSummary').textContent = tour.summary;
        document.getElementById('tourDescription').textContent =
          tour.description;
        document.getElementById('tourImageCover').textContent = tour.imageCover;
        document.getElementById('tourImages').textContent =
          tour.images.join(', ');
        document.getElementById('tourStartDates').textContent =
          tour.startDates.join(', ');
        document.getElementById(
          'tourStartLocation'
        ).textContent = `${tour.startLocation.description}, ${tour.startLocation.address}`;
        document.getElementById('tourLocations').textContent = tour.locations
          .map((loc) => loc.description)
          .join(', ');
        document.getElementById('tourGuides').textContent =
          tour.guides.join(', ');

        // Show the modal
        const tourModal = new bootstrap.Modal(
          document.getElementById('tourModal')
        );
        tourModal.show();
      } catch (error) {
        console.error('Error fetching tour details:', error);
        alert('Failed to fetch tour details');
      }
    });
  });

  // Handle edit button click
  document.querySelectorAll('.btn-edit').forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      const userId = this.dataset.id;
      // Perform edit action, e.g., open a modal with a form populated with user data
      alert(`Edit user with ID: ${userId}`);
      // Example: openModalWithUserData(userId);
    });
  });

  // Handle delete button click
  document.querySelectorAll('.btn-delete').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const userId = this.dataset.id;
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/v1/users/${userId}`
          );
          if (response.status === 204) {
            alert('User deleted successfully');
            // Remove the row from the table
            this.closest('tr').remove();
          } else {
            alert('Failed to delete user');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Failed to delete user');
        }
      }
    });
  });
});
