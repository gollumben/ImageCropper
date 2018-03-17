# ImageCropper
## A lightweight image cropper tool
This tool allows you to crop and modify your images. It is written in vanilla javascript and uses php to save the changes. Therefore, you require a server with php-parsing support, if you wish to save the images you modified. Other implementations for saving the files are not included so far. I am most open to suggestions, though and encourage you to put them forward :)!

## Setup
To use the image cropper, add the following lines to the head in your html file:
```html     
<!-- ImageCropper required files -->
<link rel="stylesheet" type="text/css" href="./css/imagecropper.css">
<script type="text/javascript" src="./js/imagecropper.js"></script>
<script type="text/javascript" src="./js/dropzone.js"></script>
```
To each image, that you would to edit, add the class 'img-editable'
```html
<img src="exampleImage.png" class="img-editable">
```

## Usage
When reloading your html file, a box with two buttons will appear in the top left corner of your image. One of the symbols allows to switch to edit mode, the other to select a new image. In edit mode, you can stretch your image by pulling the corners. Further you can use the '+' and '-' button to zoom it. Use the arrow to finish editing and the cross, to abort you changes. Use the mouse to move the image around. You can drag and drop new images into an images canvas to change the image.

## Save images
To save the changes you made, you can use the provided 'imagecropperupload.php' file. To initiate the saving process, call the javascript function
```javascript
saveCroppedImages()
```
e.g. by assigning it to a button:
```html
<button onclick="saveCroppedImages();">Save</button>
```
If saving was successful, then the edited images will contain an extra tag 'imgcrpini', making the image html source code looking somewhat like this
```html
<img src="exampleImage.png" class="img-editable" imgcrpini="299px,302px,-68px,-23px">
```
The four numbers specify, at which point the image was, when you stopped editing it. When you work with imageCropper the first time, then after first saving, the original images will be stored by the saver file, to allow you to modify your images next time. The original images are labelled by a '-original' before the file ending.

## Example
An example file can be found in index.html, which is hosted <a href="https://gollumben.github.io/ImageCropper/">here</a>.

## Licence
Published under the MIT Licence.
