document.addEventListener('DOMContentLoaded', function () {
  // Handle view button click
  document.querySelectorAll('.btn-view-user').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const userId = this.dataset.id;
      try {
        // Fetch user details from the server
        const response = await axios.get(`/api/v1/users/${userId}`);
        const { data } = response.data;
        const { user } = data;

        // Populate the modal with user details
        document.getElementById('userName').textContent = user[0].name;
        document.getElementById('userEmail').textContent = user[0].email;
        document.getElementById('userPhoto').textContent = user[0].photo;
        document.getElementById('userRole').textContent = user[0].role;
        document.getElementById('userActive').textContent = user[0].active
          ? 'Đang hoạt động'
          : 'Ngừng hoạt động';
        // Add other user details as needed

        // Show the modal
        const userModal = new bootstrap.Modal(
          document.getElementById('userModal')
        );
        userModal.show();
      } catch (error) {
        console.error('Lỗi xem thông tin chi tiết người dùng:', error);
        alert('Lỗi xem thông tin chi tiết người dùng');
      }
    });
  });

  document.querySelectorAll('.btn-view-tour').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const tourId = this.dataset.id;

      try {
        // Fetch tour details from the server
        const response = await axios.get(`/api/v1/tours/${tourId}`);
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
        document.getElementById('tourStartDates').textContent = new Date(
          tour.startDates[0]
        )
          .toLocaleDateString('en-GB')
          .replace(/\//g, '-');
        document.getElementById('tourStartLocation').textContent =
          tour.startLocation.map((loc) => loc).join(', ');
        document.getElementById('tourLocations').textContent = tour.locations
          .map((loc) => loc)
          .join(', ');
        document.getElementById('tourGuides').textContent = tour.guides
          .map((guide) => guide.name)
          .join(', ');

        // Show the modal
        const tourModal = new bootstrap.Modal(
          document.getElementById('tourModal')
        );
        tourModal.show();
      } catch (error) {
        console.error('Lỗi xem thông tin chi tiết chuyến đi:', error);
        alert('Lỗi xem thông tin chi tiết chuyến đi');
      }
    });
  });

  document.querySelectorAll('.btn-view-review').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const reviewId = this.dataset.id;

      try {
        // Fetch tour details from the server
        const response = await axios.get(`/api/v1/reviews/${reviewId}`);
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
        console.error('Lỗi xem thông tin chi tiết bài đánh giá:', error);
        alert('Lỗi xem thông tin chi tiết bài đánh giá');
      }
    });
  });

  // Handle edit button click
  document.querySelectorAll('.btn-edit-user').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const userId = this.dataset.id;
      // console.log(userId);

      try {
        // Fetch user data from the server
        const response = await axios.get(`/api/v1/users/${userId}`);
        const userData = response.data.data.user;
        console.log(userData[0]);

        //Populate form fields in the modal with user data
        document.getElementById('editName').value = userData[0].name;
        document.getElementById('editEmail').value = userData[0].email;
        document.getElementById('editRole').value = userData[0].role;
        // document.getElementById('editActive').value =
        //   userData[0].active.toString() || 'true';

        // Store the userId in a hidden field or data attribute to use it later during the update
        document.getElementById('editUserForm').dataset.userId = userId;

        // Open the modal
        const editUserModal = new bootstrap.Modal(
          document.getElementById('editUserModal')
        );
        editUserModal.show();
      } catch (error) {
        console.error('Lỗi cập nhật nười dùng', error);
        alert('Lỗi cập nhật nười dùng');
      }
    });
  });

  document
    .getElementById('editUserForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault();

      // Retrieve the userId from the form's data attribute
      const userId = this.dataset.userId;
      const name = document.getElementById('editName').value;
      const email = document.getElementById('editEmail').value;
      const photo = document.getElementById('editPhoto').files[0];
      const role = document.getElementById('editRole').value;
      const active = document.getElementById('editActive').value === 'true';

      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (photo) {
          formData.append('photo', photo); // Only append if there is a file selected
        }
        formData.append('role', role);
        formData.append('active', active);
        // Send updated data to the server
        const response = await axios.patch(
          `/api/v1/users/${userId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.data.status === 'success') {
          alert('Cập nhật người dùng thành công');
          // Optionally, refresh the page or update the UI with the new user data
          const editUserModal = bootstrap.Modal.getInstance(
            document.getElementById('editUserModal')
          );
          editUserModal.hide();
          location.reload(); // Reload the page to reflect changes
        } else {
          alert('Lỗi cập nhật nười dùng');
        }
      } catch (error) {
        console.error('Lỗi cập nhật nười dùng:', error);
        alert('Lỗi cập nhật nười dùng');
      }
    });

  // Function to handle the click event of the edit buttons and open the modal with tour data
  document.querySelectorAll('.btn-edit-tour').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const tourId = this.dataset.id;

      try {
        // Fetch tour data from the server
        const response = await axios.get(`/api/v1/tours/${tourId}`);
        const tourData = response.data.data.tour;
        // console.log(tourData);
        console.log(tourData.locations.map((loc) => loc).join(', '));

        // Populate form fields in the modal with tour data
        document.getElementById('editTourName').value = tourData.name;
        document.getElementById('editDuration').value = tourData.duration;
        document.getElementById('editMaxGroupSize').value =
          tourData.maxGroupSize;
        document.getElementById('editDifficulty').value = tourData.difficulty;
        document.getElementById('editRatingsAverage').value =
          tourData.ratingsAverage;
        document.getElementById('editRatingsQuantity').value =
          tourData.ratingsQuantity;
        document.getElementById('editPrice').value = tourData.price;
        document.getElementById('editSummary').value = tourData.summary;
        document.getElementById('editDescription').value = tourData.description;
        document.getElementById('editStartDates').value = new Date(
          tourData.startDates[0]
        )
          .toLocaleDateString('en-GB')
          .replace(/\//g, '-');
        document.getElementById('editStartLocation').value =
          tourData.startLocation.map((loc) => loc).join(', ');
        document.getElementById('editLocations').value = tourData.locations
          .map((loc) => loc)
          .join(', ');

        // Set the form's data-tour-id attribute
        document.getElementById('editTourForm').dataset.tourId = tourId;

        // Open the modal
        const editTourModal = new bootstrap.Modal(
          document.getElementById('editTourModal')
        );
        editTourModal.show();
      } catch (error) {
        console.error('Lỗi cập nhật chuyến đi:', error);
        alert('Lỗi cập nhật chuyến đi');
      }
    });
  });

  // Function to handle the form submission and update the tour data
  document
    .getElementById('editTourForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault();

      // Retrieve the tourId from the form's data attribute
      const tourId = this.dataset.tourId;
      const name = document.getElementById('editTourName').value;
      const duration = document.getElementById('editDuration').value;
      const maxGroupSize = document.getElementById('editMaxGroupSize').value;
      const diffVal = document.getElementById('editDifficulty').value;
      const difficulty =
        diffVal === 'easy' ? 'Dễ' : diffVal === 'medium' ? 'Trung Bình' : 'Khó';
      const ratingsAverage =
        document.getElementById('editRatingsAverage').value;
      const ratingsQuantity = document.getElementById(
        'editRatingsQuantity'
      ).value;
      const price = document.getElementById('editPrice').value;
      const summary = document.getElementById('editSummary').value;
      const description = document.getElementById('editDescription').value;
      const imageCover = document.getElementById('editImageCover').files[0];
      const images = Array.from(document.getElementById('editImages').files);
      const startDates = document.getElementById('editStartDates').value;
      const startLocation = document
        .getElementById('editStartLocation')
        .value.split(',')
        .map((loc) => loc.trim());
      const locations = document
        .getElementById('editLocations')
        .value.split(',')
        .map((loc) => loc.trim());

      try {
        // Create a FormData object to handle the file uploads
        const formData = new FormData();
        formData.append('name', name);
        formData.append('duration', duration);
        formData.append('maxGroupSize', maxGroupSize);
        formData.append('difficulty', difficulty);
        formData.append('ratingsAverage', ratingsAverage);
        formData.append('ratingsQuantity', ratingsQuantity);
        formData.append('price', price);
        formData.append('summary', summary);
        formData.append('description', description);
        if (imageCover) {
          formData.append('imageCover', imageCover);
        }
        images.forEach((image, index) => {
          formData.append(`images`, image);
        });
        formData.append('startDates', startDates);
        formData.append('startLocation', startLocation);
        formData.append('locations', locations);

        // Send updated data to the server
        const response = await axios.patch(
          `/api/v1/tours/${tourId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.data.status === 'success') {
          alert('Cập nhật chuyến đi thành công');
          // Close the modal
          const editTourModal = bootstrap.Modal.getInstance(
            document.getElementById('editTourModal')
          );
          editTourModal.hide();
          // Optionally, refresh the page or update the UI with the new tour data
          location.reload(); // Reload the page to reflect changes
        } else {
          alert('Lỗi cập nhật chuyến đi');
        }
      } catch (error) {
        console.error('Lỗi cập nhật chuyến đi:', error);
        alert('Lỗi cập nhật chuyến đi');
      }
    });

  document.querySelectorAll('.btn-edit-review').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const reviewId = this.dataset.id;

      try {
        // Fetch review data from the server
        const response = await axios.get(`/api/v1/reviews/${reviewId}`);
        const reviewData = response.data.data.review;

        // Populate form fields in the modal with review data
        document.getElementById('editReviewText').value = reviewData.review;
        document.getElementById('editReviewRating').value = reviewData.rating;

        // Store the reviewId in a hidden field or data attribute to use it later during the update
        document.getElementById('editReviewForm').dataset.reviewId = reviewId;

        // Open the modal
        const editReviewModal = new bootstrap.Modal(
          document.getElementById('editReviewModal')
        );
        editReviewModal.show();
      } catch (error) {
        console.error('Lỗi cập nhật bài đánh giá:', error);
        alert('Lỗi cập nhật bài đánh giá');
      }
    });
  });

  // Handling the form submission
  document
    .getElementById('editReviewForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault();
      const reviewId = this.dataset.reviewId;

      const formData = new FormData(this);
      const reviewData = Object.fromEntries(formData.entries());

      try {
        const response = await axios.patch(
          `/api/v1/reviews/${reviewId}`,
          reviewData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          alert('Cập nhật đánh giá thành công');
          // Close the modal
          const editReviewModal = bootstrap.Modal.getInstance(
            document.getElementById('editReviewModal')
          );
          editReviewModal.hide();
          location.reload(); // Reload the page to reflect changes
        } else {
          throw new Error('Lỗi cập nhật bài đánh giá');
        }
      } catch (error) {
        console.error('Lỗi cập nhật bài đánh giá:', error);
        alert('Lỗi cập nhật bài đánh giá');
      }
    });

  // Handle delete button click
  document.querySelectorAll('.btn-delete-user').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const userId = this.dataset.id;
      if (confirm('Bạn chắc chắn muốn xóa người dùng?')) {
        try {
          const response = await axios.delete(`/api/v1/users/${userId}`);
          if (response.status === 204) {
            alert('Xoá người dùng thành công');
            // Remove the row from the table
            this.closest('tr').remove();

            //Delete the reviews associated with the tour
            try {
              const reviewResponse = await axios.delete(
                `/api/v1/reviews/users/${userId}`
              );
              if (reviewResponse.status === 204) {
                alert('Bài đánh giá của người dùng được xóa thành công');
                location.reload(); // Reload the page to reflect changes
              } else {
                alert('Lỗi xóa đánh giá của người dùng');
              }
            } catch (error) {
              console.error('Lỗi xóa đánh giá của người dùng:', error);
              alert('Lỗi xóa đánh giá của người dùng');
            }
          } else {
            alert('Lỗi xóa người dùng');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Lỗi xoá người dùng');
        }
      }
    });
  });

  document.querySelectorAll('.btn-delete-tour').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const tourId = this.dataset.id;
      if (confirm('Bạn chắc chắn muốn xóa chuyến đi?')) {
        try {
          const response = await axios.delete(`/api/v1/tours/${tourId}`);
          if (response.status === 204) {
            alert('Xoá chuyến đi thành công');
            // Remove the row from the table
            this.closest('tr').remove();

            // Delete the reviews associated with the tour
            try {
              const reviewResponse = await axios.delete(
                `/api/v1/reviews/tours/${tourId}`
              );
              if (reviewResponse.status === 204) {
                alert('Xóa đánh giá của chuyến đi thành công');
                location.reload(); // Reload the page to reflect changes
              } else {
                alert('Lỗi xóa đánh giá của chuyến đi');
              }
            } catch (error) {
              console.error('Lỗi xóa đánh giá của chuyến đi:', error);
              alert('Lỗi xóa đánh giá của chuyến đi');
            }
          } else {
            alert('Lỗi xóa chuyến đi');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Lỗi xóa chuyến đi');
        }
      }
    });
  });

  document.querySelectorAll('.btn-delete-review').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const reviewId = this.dataset.id;
      if (confirm('Bạn chắc chắn muốn xóa đánh giá?')) {
        try {
          const response = await axios.delete(`/api/v1/reviews/${reviewId}`);
          if (response.status === 204) {
            alert('Xóa đánh giá thành công');
            // Remove the row from the table
            this.closest('tr').remove();
            location.reload(); // Reload the page to reflect changes
          } else {
            alert('Lỗi xóa đánh giá');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Lỗi xóa đánh giá');
        }
      }
    });
  });

  document.querySelectorAll('.btn-delete-email').forEach((button) => {
    button.addEventListener('click', async function (event) {
      event.preventDefault();
      const emailId = this.dataset.id;
      if (confirm('Bạn chắc chắn muốn xóa hộp thư?')) {
        try {
          const response = await axios.delete(`/api/v1/emails/${emailId}`);
          if (response.status === 204) {
            alert('Xóa hộp thư thành công');
            // Remove the row from the table
            this.closest('tr').remove();
            location.reload(); // Reload the page to reflect changes
          } else {
            alert('Lỗi xóa hộp thư');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Lỗi xóa hộp thư');
        }
      }
    });
  });
});
