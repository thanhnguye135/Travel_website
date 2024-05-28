document.addEventListener('DOMContentLoaded', function () {
  // Handle view button click
  document.querySelectorAll('.btn-view-user').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const userId = this.dataset.id;
      try {
        // Fetch user details from the server
        const response = await axios.get(
          `http://localhost:5000/api/v1/users/${userId}`
        );
        const { data } = response.data;
        const { user } = data;

        // Populate the modal with user details
        document.getElementById('userName').textContent = user[0].name;
        document.getElementById('userEmail').textContent = user[0].email;
        document.getElementById('userPhoto').textContent = user[0].photo;
        document.getElementById('userRole').textContent = user[0].role;
        document.getElementById('userActive').textContent = user[0].active
          ? 'Dung hoat dong'
          : 'Dang hoat dong';
        // Add other user details as needed

        // Show the modal
        const userModal = new bootstrap.Modal(
          document.getElementById('userModal')
        );
        userModal.show();
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Failed to fetch user details');
      }
    });
  });

  document.querySelectorAll('.btn-view-tour').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const tourId = this.dataset.id;

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

  document.querySelectorAll('.btn-view-review').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const reviewId = this.dataset.id;

      try {
        // Fetch tour details from the server
        const response = await axios.get(
          `http://localhost:5000/api/v1/reviews/${reviewId}`
        );
        const review = response.data.data.review;

        // Populate the modal with tour details
        document.getElementById('reviewUserName').textContent =
          review.user.name;
        document.getElementById('reviewTourName').textContent =
          review.tour.name;
        document.getElementById('reviewText').textContent = review.review;
        document.getElementById(
          'reviewRating'
        ).textContent = `Đánh giá: ${review.rating}`;
        document.getElementById(
          'reviewCreatedAt'
        ).textContent = `Thời gian: ${new Date(
          review.creatAt
        ).toLocaleString()}`;

        // Show the modal
        const reviewModal = new bootstrap.Modal(
          document.getElementById('reviewModal')
        );
        reviewModal.show();
      } catch (error) {
        console.error('Error fetching tour details:', error);
        alert('Failed to fetch tour details');
      }
    });
  });

  // Handle edit button click
  document.querySelectorAll('.btn-edit-user').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const userId = this.dataset.id;

      try {
        // Fetch user data from the server
        const response = await axios.get(
          `http://localhost:5000/api/v1/users/${userId}`
        );
        const userData = response.data.data.user;

        // Populate form fields in the modal with user data
        document.getElementById('editName').value = userData.name;
        document.getElementById('editEmail').value = userData.email;
        document.getElementById('editRole').value = userData.role;
        document.getElementById('editActive').value = userData.active
          ? 'Đang hoạt động'
          : 'Không hoạt động';

        // Open the modal
        const editUserModal = new bootstrap.Modal(
          document.getElementById('editUserModal')
        );
        editUserModal.show();
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch user data');
      }
    });
  });

  document
    .getElementById('editUserForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault();

      const userId = document.querySelector('.btn-edit-user').dataset.id;
      const name = document.getElementById('editName').value;
      const email = document.getElementById('editEmail').value;
      const role = document.getElementById('editRole').value;
      const active =
        document.getElementById('editActive').value === 'Đang hoạt động';

      try {
        // Send updated data to the server
        const response = await axios.patch(
          `http://localhost:5000/api/v1/users/${userId}`,
          {
            name,
            email,
            role,
            active,
          }
        );

        if (response.data.status === 'success') {
          alert('User updated successfully');
          // Optionally, refresh the page or update the UI with the new user data
        } else {
          alert('Failed to update user');
        }
      } catch (error) {
        console.error('Error updating user data:', error);
        alert('Failed to update user data');
      }
    });

  // Handle delete button click
  document.querySelectorAll('.btn-delete-user').forEach((button) => {
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

            //Delete the reviews associated with the tour
            try {
              const reviewResponse = await axios.delete(
                `http://localhost:5000/api/v1/reviews/users/${userId}`
              );
              if (reviewResponse.status === 204) {
                alert('Reviews of the tour deleted successfully');
              } else {
                alert('Failed to delete reviews of the tour');
              }
            } catch (error) {
              console.error('Error deleting reviews:', error);
              alert('Failed to delete reviews of the tour');
            }
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

  document.querySelectorAll('.btn-delete-tour').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const tourId = this.dataset.id;
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/v1/tours/${tourId}`
          );
          if (response.status === 204) {
            alert('User deleted successfully');
            // Remove the row from the table
            this.closest('tr').remove();

            // Delete the reviews associated with the tour
            try {
              const reviewResponse = await axios.delete(
                `http://localhost:5000/api/v1/reviews/tours/${tourId}`
              );
              if (reviewResponse.status === 204) {
                alert('Reviews of the tour deleted successfully');
              } else {
                alert('Failed to delete reviews of the tour');
              }
            } catch (error) {
              console.error('Error deleting reviews:', error);
              alert('Failed to delete reviews of the tour');
            }
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

  document.querySelectorAll('.btn-delete-review').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const reviewId = this.dataset.id;
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/v1/reviews/${reviewId}`
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

  document.querySelectorAll('.btn-delete-email').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const emailId = this.dataset.id;
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/api/v1/emails/${emailId}`
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
