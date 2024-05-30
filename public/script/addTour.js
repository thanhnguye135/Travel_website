document.addEventListener('DOMContentLoaded', function () {
  const addTourForm = document.querySelector('#addTourForm');

  if (addTourForm) {
    addTourForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData();

      // Get form values and append them to formData
      formData.append('name', document.querySelector('#addTourName').value);
      formData.append('duration', document.querySelector('#addDuration').value);
      formData.append(
        'maxGroupSize',
        document.querySelector('#addMaxGroupSize').value
      );
      formData.append(
        'difficulty',
        document.querySelector('#addDifficulty').value
      );
      formData.append(
        'ratingsAverage',
        document.querySelector('#addRatingsAverage').value
      );
      formData.append(
        'ratingsQuantity',
        document.querySelector('#addRatingsQuantity').value
      );
      formData.append('price', document.querySelector('#addPrice').value);
      formData.append('summary', document.querySelector('#addSummary').value);
      formData.append(
        'description',
        document.querySelector('#addDescription').value
      );

      const imageCover = document.querySelector('#addImageCover').files[0];
      if (imageCover) {
        formData.append('imageCover', imageCover);
      }

      const images = document.querySelector('#addImages').files;
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

      formData.append(
        'startDates',
        document.querySelector('#addStartDates').value
      );
      formData.append(
        'startLocation',
        document.querySelector('#addStartLocation').value
      );
      formData.append(
        'locations',
        document.querySelector('#addLocations').value
      );

      //   console.log(formData);

      try {
        const response = await axios.post(`/api/v1/tours/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // console.log(response);

        if (response.data.status === 'success') {
          alert('Thêm chuyến đi thành công!');
          window.location.reload(); // Reload the page to see the new tour
        } else {
          alert('Lỗi thêm chuyến đi.');
        }
      } catch (error) {
        // console.error(error);
        alert('Error: Không thể thêm chuyến đi bây giờ. Vui lòng thử lại sau!');
      }
    });
  }
});
