$(function () {
  $("input[type=file]").change(function () {
    var t = $(this).val();
    var labelText = "File : " + t.substr(12, t.length);
    $(this).prev("label").text(labelText);
  });
});
$(function() {
  // Xử lý khi nút "Upload" được click
  $('#uploadButton').click(function(){
    var fileInput = document.getElementById('myFile');
    var uploadedImage = document.getElementById('uploadedImage');
    var label = $('label[for="myFile"]');

    // Kiểm tra xem đã chọn tệp tin hay chưa
    if (fileInput.files.length > 0) {
      var file = fileInput.files[0];
      var reader = new FileReader();

      // Đọc tệp tin và hiển thị nó khi đã sẵn sàng
      reader.onload = function(e) {
        uploadedImage.src = e.target.result;
        uploadedImage.alt = file.name;
        label.text('File : ' + file.name);
      };

      reader.readAsDataURL(file);
    } else {
      // Nếu không có tệp tin được chọn, giữ nguyên hình ảnh và label mặc định
      uploadedImage.src = 'http://www.washaweb.com/tutoriaux/fileupload/imgs/image-temp-220.png';
      uploadedImage.alt = 'No image';
      label.text('Please choose a file on your computer.');
    }
  });

  // Xử lý khi nút "Remove" được click
  $('#removeImage').click(function(){
    // Xóa tệp tin và đặt lại hình ảnh và label mặc định
    var fileInput = document.getElementById('myFile');
    fileInput.value = '';
    $('#uploadedImage').attr('src', 'http://www.washaweb.com/tutoriaux/fileupload/imgs/image-temp-220.png');
    $('#uploadedImage').attr('alt', 'No image');
    $('label[for="myFile"]').text('Please choose a file on your computer.');
  });
});
