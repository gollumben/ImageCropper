<?php
ini_set('display_errors', 1);
error_reporting(~0);

function uploadimg($location){
  $target_dir = $location;
	$target_file = $target_dir . basename($_FILES["file"]["name"]);
	$uploadOk = 1;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

  // Check if image file is a actual image or fake image
	$check = getimagesize($_FILES["file"]["tmp_name"]);
	if($check !== false) {
		echo "Note - File is an image - " . $check["mime"] . ".
";
		$uploadOk = 1;
	} else {
		echo "Error - File is not an image.
";
		$uploadOk = 0;
	}
	// Check if file already exists
	if (file_exists($target_file)) {
	    echo "Warning - The file already exists and will be overwritten.
";
// 	    $uploadOk = 0;
	}
	// Check file size
	if ($_FILES["file"]["size"] > 10485760) {
	    echo "Error - Sorry, your file is too large.
";
	    $uploadOk = 0;
	}
	// Allow certain file formats
	if($imageFileType != "jpg" && $imageFileType != "JPG" && $imageFileType != "png" && $imageFileType != "jpeg"
	&& $imageFileType != "gif" ) {
	    echo "Error - Sorry, only JPG, JPEG, PNG & GIF files are allowed.
";
	    $uploadOk = 0;
	}
	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
	    echo "Error - Sorry, your file was not uploaded, as an error occured before.
";
	// if everything is ok, try to upload file
	} else {
	    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
		    echo "Success - The file ". basename( $_FILES["file"]["name"]). " has been uploaded.
";
		    return $target_dir . basename( $_FILES["file"]["name"]);
	    } else {
		echo "Error - Sorry, there was an error uploading your file. You may want to check your writing permissions or the upload_max_filesize in your php.ini.
";
	    }
	}
	return NULL;
  }





$endingreq = "-cropped";
$returnstr = "";

if($_FILES['file']['error']!=0 || !isset($_FILES['file'])){
    echo 'An error in the php upload has occured. Error number: '. $_FILES['file']['error'] . '.
';
    return NULL;
}
foreach($_FILES as $entry){
    echo 'The requested filetype is: ' . $entry['type'] . '.
';
}

// this is the name used for saving
$filename_upload=$_POST['imgname'];
// this is the name used for differentiating between the cropped and not cropped image
$filename=$_FILES['file']['name'];
echo $filename . '
';

if(substr($filename, -strlen($endingreq)) == $endingreq){
      echo "Cropped image being processed.
";
      $filename=substr($filename, 0, -strlen($endingreq));
      echo $filename . '
';
//       $filename='test-cropped.jpg';
//       change the name to the right name
      $_FILES['file']['name']=$filename_upload;

      echo $_FILES['file']['name'] . '
';

      uploadimg('./');

      // Change the html file
      $filename = "index.html";

      $original = file_get_contents($filename);
      if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN'){$original = str_replace("\n", "\r\n", $original);}


      $id = $_POST['id'];
      $splitter = "img-editable";

      $partsofit = explode($splitter, $original);

      for($i=1; $i<count($partsofit); $i++){
        $partsofit[$i]=$splitter . $partsofit[$i];
      }


      $whereisimg = strrpos($partsofit[$id], "<img");
      $whereisend = strpos($partsofit[$id+1], '>');

      $firstpartofimg = substr($partsofit[$id], $whereisimg);
      $partsofit[$id] = substr($partsofit[$id], 0, -strlen($firstpartofimg));

      $secondpartofimg = substr($partsofit[$id+1], 0, $whereisend+1);
      $partsofit[$id+1] = substr($partsofit[$id+1], $whereisend+1);

      $completeimg = $firstpartofimg . $secondpartofimg;

      $bigstr = '';

      if($completeimg!==$_POST['org-img-tag']){
         echo "An error occurred while trying to find the objects to change. Please contact the developer.
         ";
        echo $completeimg;
        echo $_POST['org-img-tag'];
        exit();
      }
      else{
          for($i=0; $i<count($partsofit); $i++){
            $bigstr .= $partsofit[$i];
            if($i==$id){
               $bigstr.= $_POST['crp-img-tag'];
            }
          }
      }
    //
    //   echo $partsofit[$id] . '<br>';
    //   echo $completeimg . '<br>';
    //   echo $partsofit[$id+1] . '<br>';

    // echo $_POST['org-img-tag'];
    // echo $_POST['crp-img-tag'];


    if (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN'){$backagain = str_replace("\r\n", "\n", $bigstr);}
    /*++++++++++++++++++++++++++++++++++++++++++++++++++

    Filewriting part, do not touch

    ++++++++++++++++++++++++++++++++++++++++++++++++++*/
    // Open file, write the content, close it, redirect
    // echo $filename . " This is the filename. "; Test, whether filename is transfered correctly
    $myfile = fopen($filename, "w") or die("Unable to open file!");
    $towrite=$backagain;
    fwrite($myfile, $towrite);
    fclose($myfile);

    echo "HTML sucessfully saved.";
    // header("refresh:1;url=editor.php"); // Old redirect

}
else{
      echo "Original image being processed.
";
//    filename_upload provides the name under which we will save the original with the original tag
      $justname=pathinfo($filename_upload, PATHINFO_FILENAME);
      $extension=pathinfo($filename_upload, PATHINFO_EXTENSION);

      $filename=$justname . "-original" . "." . $extension;

      echo $filename . '
';

      $_FILES['file']['name']=$filename;
      uploadimg('./');
}
?>
