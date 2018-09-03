/**
 * This file converts the uploaded image in each post into a URL using File Api to send it to the dao as a string. 
 */
// The below code has been insprired from: https://stackoverflow.com/questions/22087076/how-to-make-a-simple-image-upload-using-javascript-html/22369599
// and the concept of conversion to File Url from: https://www.html5rocks.com/en/tutorials/file/dndfiles/
var imageUrl;
function previewFile(){
  var file    = document.querySelector('input[type=file]').files[0]; //sames as here
  var reader  = new FileReader();

  reader.onloadend = function () {
      file.src = reader.result;
      imageUrl = file.src;
      console.log(imageUrl.length);
  }
  if (file) {
    //   The below function allows to convert the image to a URL. 
      reader.readAsDataURL(file); 
  } else {
      file.src = "";
  } 
}



