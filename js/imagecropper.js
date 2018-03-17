/* ImageCropper v0.3
ChangeLog:
     *bug in initialisation process fixed
     *padding and margin copyed correctly now
     *example improved significantly
ToDo:
     *upload original, if not existing. Idea: Change name of cropped file, not of original one (makes more sense anyway..)
*/
var ImageCropper = function(imageref, id) {
//   clone this element, in order to send it to the php file later
    this.originalImg = imageref.cloneNode(true);
//get the filename, strip of the ending
    var filename=imageref.src;
    var fileparts=filename.split('.');
    filename = fileparts[0];
    for(var ind=1; ind<fileparts.length-1; ind++)
    {
      filename=filename+"."+fileparts[ind];
    }

    this.filetype = fileparts[ind]; // save the filetype, for later

    filepaths=filename.split('/');
    filename = filepaths[filepaths.length-1];

    var filenameOrigForHashMap = filename+"-original"+"."+fileparts[ind];

//   check whether image has been edited before
    if(imageref.hasAttribute("imgcrpini")){
                                          // if it does, then edit the filename to filename-original.ending, but with the old file, since the new one, with the ending does not exist yet
                                          var filenameOrig="";
                                          for(var pathind=1; pathind<filepaths.length; pathind++)
                                          {
                                            filenameOrig=filenameOrig+"/"+filepaths[pathind];
                                          }
                                          filenameOrig=filenameOrig+"-original"+"."+fileparts[ind];
                                          console.log(filenameOrig);
                                          imageref.src=filenameOrig; //put the original image in place of the cropped one
                                          // Debug
                                          //   alert(imageref.src);

                                          // also, get the old parameters
                                          var imgparas = imageref.getAttribute("imgcrpini").split(',');
                                          // Debug
                                          // Debug alert(imgparas);
    }
    else {
      //check, whether name already appeared and add so many integers, until this is not the case anymore, only do this, if file has never been initialised yet.
      var filenameOld = filename;
      var index = 1;
      while(ImageCropperHashMap[filename+"."+fileparts[ind]]){
              filename = filenameOld+"-"+index;
              index++;
      }
    }

    filename = filename+"."+fileparts[ind];

    console.log(filename);
// set the hashmap to true in any case
    ImageCropperHashMap[filename] = true;
    ImageCropperHashMap[filenameOrigForHashMap] = true;
    console.log(ImageCropperHashMap[filename]);
    this.filename = filename;
    this.imageref = imageref;
    this.id = id;
//   Saving this variable for later
//   this has to be private (var _this), since otherwise it will be changed by other instances of ImageCropper and everything brakes
    var _this = this;
//   Also need initial properties of picture, not the later ones
    var reqWidth = Math.round(parseFloat(getCSSprop(this.imageref, 'width'))) + "px";
    var reqHeight = Math.round(parseFloat(getCSSprop(this.imageref, 'height'))) + "px";
    var reqLeft = getCSSprop(this.imageref, 'left');
    var reqTop = getCSSprop(this.imageref, 'top');
    var reqPadding = getCSSprop(this.imageref, 'padding-top') + " " + getCSSprop(this.imageref, 'padding-right') + " " + getCSSprop(this.imageref, 'padding-bottom') + " " + getCSSprop(this.imageref, 'padding-left');
    var reqMargin = getCSSprop(this.imageref, 'margin-top') + " " + getCSSprop(this.imageref, 'margin-right') + " " + getCSSprop(this.imageref, 'margin-bottom') + " " + getCSSprop(this.imageref, 'margin-left');
    var reqPos = getCSSprop(this.imageref, 'position');
    // console.log(reqPadding);
//     var borderRad = getCSSprop(this.imageref, 'border-radius'); // Something is not working here!! PROBLEM!!
//   alert(borderRad);
//     var reqDspl = getCSSprop(this.imageref, 'display');
// alert(reqWidth);

  //   Setting values of image
  //   If a previous edit was done, then a cropped image exists and we have to move the image around, to its moved position
  //   Also setting up the inital position
    if(typeof imgparas !== "undefined"){
      this.imageref.style.width = imgparas[0];
      this.imageref.style.height = imgparas[1];
      this.imageref.style.left = imgparas[2];
      this.imageref.style.top = imgparas[3];

      this.initialWidth = imgparas[0];
      this.initialHeight = imgparas[1];
      this.initialposX = imgparas[2];
      this.initialposY = imgparas[3];
    }
//   otherwise, do not
    else{
      this.imageref.style.width = "100%";
      this.imageref.style.height = "100%";
      this.imageref.style.left = "0px";
      this.imageref.style.top = "0px";

      this.initialposX = reqLeft;
      this.initialposY = reqTop;
      this.initialWidth = reqWidth;
      this.initialHeight = reqHeight;
    }
    this.imageref.style.padding = "0px";
    this.imageref.style.margin = "0px";
    this.imageref.style.position = "relative";
    this.imageref.style.display = "block";
//     this.imageref.style.borderRadius = "0px";

//     Creating frame and putting image inside
    this.frame = document.createElement('div');
    this.frame.className = "frame";
//     this.frame.style.borderRadius = borderRad;

    wrap(this.imageref, this.frame);

//     Creating five editing buttons

    this.fivebuttons = document.createElement('div');
    this.fivebuttons.className = "buttonchangelist fivebuttons";

    this.buttonminus = document.createElement('button');
    this.buttonminus.className = 'buttonchange';
    this.buttonminus.onclick = function(){_this.scale(0.05);};
    this.buttonminus.innerHTML = "-";
    this.fivebuttons.appendChild(this.buttonminus);

    this.buttonplus = document.createElement('button');
    this.buttonplus.className = 'buttonchange';
    this.buttonplus.onclick = function(){_this.scale(-0.05);};
    this.buttonplus.innerHTML = "+";
    this.fivebuttons.appendChild(this.buttonplus);

    this.buttonfileup = document.createElement('button');
    this.buttonfileup.className = 'buttonchange fileuploader';
    this.buttonfileup.style.color = "#0000FF";
    this.buttonfileup.innerHTML = "&#8682;";
    this.fivebuttons.appendChild(this.buttonfileup);

    this.buttonfinishedit = document.createElement('button');
    this.buttonfinishedit.className = 'buttonchange';
    this.buttonfinishedit.style.color = "#00FF00";
    this.buttonfinishedit.style.textShadow = "#000 0px 0px 0px";
//     this.buttonfinishedit.addEventListener("click", _this.finishedit(_this), false);
    this.buttonfinishedit.onclick = function(){_this.finishedit(_this);};
    this.buttonfinishedit.innerHTML = "&#10003;";
    this.fivebuttons.appendChild(this.buttonfinishedit);

    this.buttonresetedit = document.createElement('button');
    this.buttonresetedit.className = 'buttonchange';
    this.buttonresetedit.style.color = "#F00000";
    this.buttonresetedit.onclick = function(){_this.resetedit(_this);};
    this.buttonresetedit.innerHTML = "x";
    this.fivebuttons.appendChild(this.buttonresetedit);

    this.frame.appendChild(this.fivebuttons);

//   Creating two begin edit buttons

    this.twobuttons = document.createElement('div');
    this.twobuttons.className = "buttonchangelist twobuttons";

    this.buttonfileup2 = document.createElement('button');
    this.buttonfileup2.className = 'buttonchange fileuploader';
    this.buttonfileup2.style.color = "#0000FF";
    this.buttonfileup2.innerHTML = "&#8682;";
    this.twobuttons.appendChild(this.buttonfileup2);

    this.buttonstartedit = document.createElement('button');
    this.buttonstartedit.className = 'buttonchange';
//     this.buttonstartedit.onclick = function(){bind(this,this.startedit();};
//   See http://stackoverflow.com/questions/15356936/object-oriented-javascript-event-handling
//   and startpage "js oop this addEventListener"

    this.buttonstartedit.onclick=function(){_this.startedit(_this);};
    this.buttonstartedit.innerHTML = "&#9997;";
    this.twobuttons.appendChild(this.buttonstartedit);

    this.frame.appendChild(this.twobuttons);

//   Progress Bar
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progressbar';

    this.frame.appendChild(this.progressBar);

//   Creating Ghost Elements and its children, which are the dots and the ghost image
    this.ghostdiv = document.createElement('div');
    this.ghostdiv.className = 'ghost';
//   Checking if we have an original image and have to move it according to the old configuration
    if(typeof imgparas !== "undefined"){
      this.ghostdiv.style.width = imgparas[0];
      this.ghostdiv.style.height = imgparas[1];
      this.ghostdiv.style.left = imgparas[2];
      this.ghostdiv.style.top = imgparas[3];
    }

//   Creating Ghost-IMG
    this.ghostimg = document.createElement('img');
    this.ghostimg.src = this.imageref.src;
    this.ghostimg.className = 'ghostimg';

    this.ghostdiv.appendChild(this.ghostimg);

//   Creating Dots
//   Left Top
    this.dotlefttop = document.createElement('div');
    this.dotlefttop.className = "dot dot-left dot-top nwsecursor";
    this.ghostdiv.appendChild(this.dotlefttop);
//   Middle Top
    this.dotmiddletop = document.createElement('div');
    this.dotmiddletop.className = "dot dot-middle dot-top nscursor";
    this.ghostdiv.appendChild(this.dotmiddletop);
//   Right Top
    this.dotrighttop = document.createElement('div');
    this.dotrighttop.className = "dot dot-right dot-top neswcursor";
    this.ghostdiv.appendChild(this.dotrighttop);
//   Left Bottom
    this.dotleftbottom = document.createElement('div');
    this.dotleftbottom.className = "dot dot-left dot-bottom neswcursor";
    this.ghostdiv.appendChild(this.dotleftbottom);
//   Middle Bottom
    this.dotmiddlebottom = document.createElement('div');
    this.dotmiddlebottom.className = "dot dot-middle dot-bottom nscursor";
    this.ghostdiv.appendChild(this.dotmiddlebottom);
//   Right Bottom
    this.dotrightbottom = document.createElement('div');
    this.dotrightbottom.className = "dot dot-right dot-bottom nwsecursor";
    this.ghostdiv.appendChild(this.dotrightbottom);
//   Left Center
    this.dotleftcenter = document.createElement('div');
    this.dotleftcenter.className = "dot dot-left dot-center ewcursor";
    this.ghostdiv.appendChild(this.dotleftcenter);
//   Right Center
    this.dotrightcenter = document.createElement('div');
    this.dotrightcenter.className = "dot dot-right dot-center ewcursor";
    this.ghostdiv.appendChild(this.dotrightcenter);

    var masterframe1 = document.createElement('div');
    masterframe1.style.position = reqPos;
    masterframe1.style.width = reqWidth;
    masterframe1.style.height = reqHeight;
    masterframe1.style.left = reqLeft;
    masterframe1.style.top = reqTop;
    masterframe1.style.padding = reqPadding;
    masterframe1.style.margin = reqMargin;
    masterframe1.style.display = "inline-block";

    var masterframe2 = document.createElement('div');
    masterframe2.className = 'masterframe';
    wrap(this.frame, masterframe2);

    masterframe2.appendChild(this.ghostdiv);

    wrap(masterframe2, masterframe1);

    //   Setting up other required initial variables
    this.IsMoving = false;
    this.ParentWidth=this.frame.clientWidth; // calculate the width and height of frame
    this.ParentHeight=this.frame.clientHeight;
    this.ParentOffsetX=this.frame.offsetLeft; // offset of parent to left/top corner; needed for ghost boundary conditions
    this.ParentOffsetY=this.frame.offsetTop;
    this.PosOldX; // Old positions of mouse, needed for moving
    this.PosOldY;

    //      Initialisation of global variables for the corner scaling functionality
    this.scaling = false; // am I scaling
    this.leftBool = false; // am I using a left point
    this.topBool = false; // am I using a top point
    this.isCorner = false; // am I using a corner
    this.isTop = false; // if I am not using a corner, is my point at the top/bottom (isTop=true) or at the left/right (isTop=false)

    this.TouchedLeft = false; // has the left border been touched
    this.TouchedRight = false; // -"- right -"-
    this.TouchedTop = false; // -"- top -"-
    this.TouchedBottom = false;  // -"- left -"-

    this.IniMouseX; // Initial Mouse Positions
    this.IniMouseY;

    //------------------------------------- Drag and Drop functionality and image changing -------------------------
    this.preventMulti=true;
    Dropzone.autoDiscover = false;

    this.myDropzone = new Dropzone(_this.frame, { // Make the whole body a dropzone
      url: "./imagecropperupload.php", // Set the url
      autoProcessQueue: false, // Make sure the files aren't queued until manually added
      clickable: [_this.buttonfileup, _this.buttonfileup2], // Define the element that should be used as click trigger to select files.
      init: function() {
        this.on("addedfile", function(file,dataUrl) {
    //       Do not allow multiple file uploads
    //		 There was an error here: this.files[1]!=null does not catch for this.files being undefined, however, like this it works
          if (!(this.files[1]==null) && _this.preventMulti){
          	console.log( "multiple file uploads and this is the old files name " + this.files[1].name);
            this.removeFile(this.files[0]);
          }
          if(_this.preventMulti){
    //       add preview to image container
            var img=_this.imageref;
            var img2=_this.ghostimg;
            var reader = new FileReader();
            var reader2 = new FileReader();
            reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
            reader2.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img2);
            reader.readAsDataURL(file);
            reader2.readAsDataURL(file);

    //        check, whether file exists and if yes, alter the name
            var filename = file.name;
            var fileparts = filename.split('.');
            filename = fileparts[0];
            for(var ind=1; ind<fileparts.length-1; ind++)
            {
              filename = filename+"."+fileparts[ind];
            }

            _this.filetype = fileparts[ind]; //save ending for later

            var filenameOld = filename;
            var index = 1;
            console.log('This is the filename of the file '+filename);
            while(ImageCropperHashMap[filename+"."+fileparts[ind]]){
                    filename = filenameOld+"-"+index;
                    index++;
                    console.log('Went into filename checking.');
            }

            var filenameOrig = filename+"-original"+"."+fileparts[ind]; // just such that no other file can have this name
            filename = filename+"."+fileparts[ind];

            // set the hashmap to true in any case
            ImageCropperHashMap[filename] = true;
            ImageCropperHashMap[filenameOrig] = true;

            //file.name = filename;//this does not work, therefore we have to send the filename extra
            _this.filename = filename;
            console.log(file.name+" and what it should be "+filename); // Debug
          }
        });
        this.on("uploadprogress", function(file, progress, bytesSent){
    //       Shows and pushes the success bar to the required value such that it looks as if it were moving
            _this.progressBar.style.width=(progress/2) + "%";
            _this.progressBar.style.display="";
            _this.progressBar.style.opacity=1;
            _this.progressBar.innerHTML=progress + "%";
        });
        this.on('sending', function(data, xhr, formData){
          _this.sendHTML = _this.originalImg.cloneNode(true);
          _this.sendHTML.src = _this.filename;
          //alert("This is the sendHTML src: " + _this.sendHTML.src);
    //       add some additional data when uploading, in this case properties of the cropped image (width, height, left offset, top offset)
          var sendstr = "";
          sendstr = getCSSprop(_this.ghostdiv, "width");
          sendstr+= "," + getCSSprop(_this.ghostdiv, "height");
          sendstr+= "," + getCSSprop(_this.ghostdiv, "left");
          sendstr+= "," + getCSSprop(_this.ghostdiv, "top");

          _this.sendHTML.setAttribute("imgcrpini", sendstr);

//           alert(_this.sendHTML.outerHTML);
          formData.append('id', _this.id); //sending id, not really needed
          formData.append('org-img-tag', _this.originalImg.outerHTML); //for debug output
          formData.append('crp-img-tag', _this.sendHTML.outerHTML); //for position of original image before cropping
          formData.append("imgname", _this.filename); //image name, for double names

          //alert('This is the filename of the class element ' + _this.filename);
        });
        this.on("queuecomplete", function(){
//           Set originalImg back to the value that is actually saved, to enable further saving
          _this.originalImg = _this.sendHTML.cloneNode(true);
        });
        this.on("complete", function(){
    //       when finished remove success bar
            setTimeout(function() {
                element=_this.progressBar;

                var op = 1;  // initial opacity
                var timer = setInterval(function () {
                    if (op <= 0.1){
                        clearInterval(timer);
                        element.style.display = 'none';
                    }
                    element.style.opacity = op;
                    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
                    op -= op * 0.1;
                }, 50);
            }, 1000);
        });
        this.on("success", function(file, response){
    //       When upload successful, then display php message
           console.log(response);
        });
    //     All of these change the opacity of the image when dragging over it
        this.on("dragenter", function(){
           _this.frame.style.opacity=0.2;
        });
        this.on("dragleave", function(){
          _this.frame.style.opacity=1;
        });
        this.on("drop", function(){
           _this.frame.style.opacity=1;
        });
      },
    //   thumbnailWidth:,
    //   thumbnailHeight: 240,
    //   uploadMultiple: false,
    //   parallelUploads: 2,
    //   previewsContainer: "#testme", // Define the container to display the previews
    });
//---------------------------------------------------- Drag and Drop End ------------------------------------
};
// /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
// /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
// /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ -------------------------------------------------- END CONSTRUCTOR -------------------------------------------------- /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
// /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
// /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/



//---------------------------------------- Main Editor functions --------------------------------

// Start the editing
ImageCropper.prototype.startedit = function(_this){
//   Setting the Reset Values
      if(this.initialposX==null){
        this.initialposX=getCSSprop(this.imageref,"left");
        this.initialposY=getCSSprop(this.imageref,"top");
        this.initialWidth=getCSSprop(this.imageref,"width");
        this.initialHeight=getCSSprop(this.imageref,"height");
      }
//   Displaying the twobuttons instead of the five
      this.twobuttons.style.display="none";
      this.fivebuttons.style.display="block";
      this.ghostdiv.style.display="block";

// Adding all the eventlisteners for all the events
      this.ActivateMovingVar = function(event){_this.ActivateMoving(event, _this);};
      this.imageref.addEventListener("mousedown", this.ActivateMovingVar);

      this.ActivateScalingLT = function(event){_this.ActivateScaling(event,"leftTop",_this);};
      this.ActivateScalingMT = function(event){_this.ActivateScaling(event,"middleTop",_this);};
      this.ActivateScalingRT = function(event){_this.ActivateScaling(event,"rightTop",_this);};
      this.ActivateScalingLC = function(event){_this.ActivateScaling(event,"leftCenter",_this);};
      this.ActivateScalingRC = function(event){_this.ActivateScaling(event,"rightCenter",_this);};
      this.ActivateScalingLB = function(event){_this.ActivateScaling(event,"leftBottom",_this);};
      this.ActivateScalingMB = function(event){_this.ActivateScaling(event,"middleBottom",_this);};
      this.ActivateScalingRB = function(event){_this.ActivateScaling(event,"rightBottom",_this);};

      this.dotlefttop.addEventListener("mousedown", this.ActivateScalingLT);
      this.dotmiddletop.addEventListener("mousedown", this.ActivateScalingMT);
      this.dotrighttop.addEventListener("mousedown", this.ActivateScalingRT);
      this.dotleftcenter.addEventListener("mousedown", this.ActivateScalingLC);
      this.dotrightcenter.addEventListener("mousedown", this.ActivateScalingRC);
      this.dotleftbottom.addEventListener("mousedown", this.ActivateScalingLB);
      this.dotmiddlebottom.addEventListener("mousedown", this.ActivateScalingMB);
      this.dotrightbottom.addEventListener("mousedown", this.ActivateScalingRB);

      this.MoveImgVar = function(event){_this.MoveImg(event,_this)};
      document.addEventListener("mousemove", this.MoveImgVar);
      this.MoveCornerVar = function(event){_this.MoveCorner(event,_this)};
      document.addEventListener("mousemove", this.MoveCornerVar);

      this.StopMovingVar = function(){_this.StopMoving(_this);};
      document.addEventListener("mouseup",this.StopMovingVar);
      this.StopScalingVar = function(){_this.StopScaling(_this)};
      document.addEventListener("mouseup",this.StopScalingVar);
};

ImageCropper.prototype.finishedit = function(_this){
//   Making the two buttons visible, the five buttons not
      this.twobuttons.style.display="block";
      this.fivebuttons.style.display="none";
      this.ghostdiv.style.display="none";

//   removing all the eventlisteners
      this.imageref.removeEventListener("mousedown", this.ActivateMovingVar);

      this.dotlefttop.removeEventListener("mousedown", this.ActivateScalingLT);
      this.dotmiddletop.removeEventListener("mousedown", this.ActivateScalingMT);
      this.dotrighttop.removeEventListener("mousedown", this.ActivateScalingRT);
      this.dotleftcenter.removeEventListener("mousedown", this.ActivateScalingLC);
      this.dotrightcenter.removeEventListener("mousedown", this.ActivateScalingRC);
      this.dotleftbottom.removeEventListener("mousedown", this.ActivateScalingLB);
      this.dotmiddlebottom.removeEventListener("mousedown", this.ActivateScalingMB);
      this.dotrightbottom.removeEventListener("mousedown", this.ActivateScalingRB);

      document.removeEventListener("mousemove", this.MoveImgVar);
      document.removeEventListener("mousemove", this.MoveCornerVar);

      document.removeEventListener("mouseup",this.StopMovingVar);
      document.removeEventListener("mouseup",this.StopScalingVar);
};

ImageCropper.prototype.resetedit = function(_this){
//   reseting all the values of the image, except the url
      _this.imageref.style.left=_this.initialposX;
      _this.imageref.style.top=_this.initialposY;
      _this.imageref.style.width=_this.initialWidth;
      _this.imageref.style.height=_this.initialHeight;
      _this.ghostdiv.style.left=_this.initialposX;
      _this.ghostdiv.style.top=_this.initialposY;
      _this.ghostdiv.style.width=_this.initialWidth;
      _this.ghostdiv.style.height=_this.initialHeight;
};



//Function for zooming ---------------------------------- Begin ----------------------------------
//This function takes an image and scales it according to the scalefactor, while keeping the quotient of height and width the same
//The function also alters the left and top properties, such that the images center stays fixed -> looks better

ImageCropper.prototype.scale = function(scalefactor){
//        First of all, it is checked, whether the future image might be less wide then the frame allows
            if((1-scalefactor)*parseInt(getCSSprop(this.imageref, "width"))<parseInt(this.ParentWidth)){
//                  Otherwise, a new scalefactor is defined, scaling the image to exactly the right width
                    scalefactor=1-parseInt(this.ParentWidth)/parseInt(getCSSprop(this.imageref, "width"));
            }
//        Doing the same for the height
            if((1-scalefactor)*parseInt(getCSSprop(this.imageref, "height"))<parseInt(this.ParentHeight)){
                    scalefactorMaybe=1-parseInt(this.ParentHeight)/parseInt(getCSSprop(this.imageref, "height"));
//                  Choosing the scalefactor that is smaller, such that both width and height requirements are fulfilled
                    if(scalefactorMaybe<scalefactor)
                    {
                            scalefactor=scalefactorMaybe;
                    }
            }

//        Writing the factors that I want to move top and left
            var moveMeX=parseInt(scalefactor/2*parseInt(getCSSprop(this.imageref, "width")));
            var moveMeY=parseInt(scalefactor/2*parseInt(getCSSprop(this.imageref, "height")));
            this.imageref.style.left=(parseInt(getCSSprop(this.imageref, "left"))+moveMeX) + "px";
            this.imageref.style.top=(parseInt(getCSSprop(this.imageref, "top"))+moveMeY) + "px";
//        Changing width and height according to scalefactor
            this.imageref.style.width=((1-scalefactor)*parseInt(getCSSprop(this.imageref, "width"))) + "px";
            this.imageref.style.height=((1-scalefactor)*parseInt(getCSSprop(this.imageref, "height"))) + "px";
//        Doing all the changes for the ghost as well
            this.ghostdiv.style.left=(parseInt(getCSSprop(this.ghostdiv, "left"))+moveMeX) + "px";
            this.ghostdiv.style.top=(parseInt(getCSSprop(this.ghostdiv, "top"))+moveMeY) + "px";
            this.ghostdiv.style.width=((1-scalefactor)*parseInt(getCSSprop(this.ghostdiv, "width"))) + "px";
            this.ghostdiv.style.height=((1-scalefactor)*parseInt(getCSSprop(this.ghostdiv, "height"))) + "px";

//        Checking boundary conditions as before
            if(parseInt(this.imageref.style.left)>=0){this.imageref.style.left=0 + "px"; this.ghostdiv.style.left=this.ParentOffsetX + "px";} // make sure that it does not exceed the border of what we are looking at!
            else if(parseInt(this.ParentWidth)-parseInt(getCSSprop(this.imageref,"width"))-parseInt(getCSSprop(this.imageref,"left"))>=0){this.imageref.style.left=(this.ParentWidth-parseInt(getCSSprop(this.imageref,"width"))) + "px"; this.ghostdiv.style.left=(this.ParentOffsetX+parseInt(getCSSprop(this.imageref,"left"))) + "px";} // also not on the right

            if(parseInt(this.imageref.style.top)>=0){this.imageref.style.top=0 + "px"; this.ghostdiv.style.top=this.ParentOffsetY + "px";} // make sure it stays inside w.r.t. top
            else if(parseInt(this.ParentHeight)-parseInt(getCSSprop(this.imageref,"height"))-parseInt(getCSSprop(this.imageref,"top"))>=0){this.imageref.style.top=(this.ParentHeight-parseInt(getCSSprop(this.imageref,"height"))) + "px"; this.ghostdiv.style.top=(this.ParentOffsetY+parseInt(getCSSprop(this.imageref,"top"))) + "px";} // and bottom


            return false;
};
//Function for zooming ---------------------------------- End ----------------------------------

//Functions for moving image --------------------------------- Begin ---------------------------------
ImageCropper.prototype.ActivateMoving = function(event, _this){
            event.preventDefault(); // prevents Browser from doing default things, e.g. Drag&Drop
// alert("gi");
            _this.frame.style.cursor="grabbing";
            document.body.style.cursor="grabbing"; // change mouse symbol

            _this.PosOldX=event.clientX; // set initial conditions for mouse
            _this.PosOldY=event.clientY;

            _this.IsMoving = true; // change flag that allows the image to be moved to true

            return false; // prevent mistakes or some random stuff to happen
};

// In principle the new position of the image is computed by taking the difference in mouse movement. This is done for the ghost (the image with light backgfloor) and the real image.
// Boundary conditions setup by the original image (denoted by ImageCropper as the "frame") are applied.
// The variable _this is needed to devide the different instances of ImageCropper
ImageCropper.prototype.MoveImg = function(event, _this){
            if(!_this.IsMoving){
                    return false; // prevent from function being called, if
            }

            var deltaX=event.clientX-_this.PosOldX;  // calculate difference in mouse position in X direction
            var tmpX=parseInt(getCSSprop(_this.imageref,"left")); // get former position of image
            var tmpGhostX=parseInt(getCSSprop(_this.ghostdiv,"left"));
            _this.imageref.style.left=(tmpX+deltaX) + "px"; // set new position of image
            _this.ghostdiv.style.left=(tmpGhostX+deltaX) + "px";

            if(parseInt(_this.imageref.style.left)>=0){_this.imageref.style.left=0 + "px"; _this.ghostdiv.style.left=_this.ParentOffsetX + "px";} // make sure that it does not exceed the border of what we are looking at!
            else if(parseInt(_this.ParentWidth)-parseInt(getCSSprop(_this.imageref,"width"))-parseInt(getCSSprop(_this.imageref,"left"))>=0){_this.imageref.style.left=(_this.ParentWidth-parseInt(getCSSprop(_this.imageref,"width"))) + "px"; _this.ghostdiv.style.left=(_this.ParentOffsetX+parseInt(getCSSprop(_this.imageref,"left"))) + "px";} // also not on the right

            var deltaY=event.clientY-_this.PosOldY;  // calculate difference in mouse position in Y direction
            var tmpY=parseInt(getCSSprop(_this.imageref,"top")); // get former position of image
            var tmpGhostY=parseInt(getCSSprop(_this.ghostdiv,"top"));
            _this.imageref.style.top=(tmpY+deltaY) + "px"; // set new position of image
            _this.ghostdiv.style.top=(tmpGhostY+deltaY) + "px";

            if(parseInt(_this.imageref.style.top)>=0){_this.imageref.style.top=0 + "px"; _this.ghostdiv.style.top=(_this.ParentOffsetY) + "px";} // make sure it stays inside w.r.t. top
            else if(parseInt(_this.ParentHeight)-parseInt(getCSSprop(_this.imageref,"height"))-parseInt(getCSSprop(_this.imageref,"top"))>=0){_this.imageref.style.top=(_this.ParentHeight-parseInt(getCSSprop(_this.imageref,"height"))) + "px"; _this.ghostdiv.style.top=(_this.ParentOffsetY+parseInt(getCSSprop(_this.imageref,"top"))) + "px";} // and bottom

            _this.PosOldX=event.clientX; // Re-set initial position of mouse
            _this.PosOldY=event.clientY;

            return false; // prevent mistakes or some random stuff to happen
};

ImageCropper.prototype.StopMoving = function (_this){
            if(_this.IsMoving){
                    _this.IsMoving = false; // stop moving image

                    _this.frame.style.cursor="grab";
                    document.body.style.cursor="auto"; // reset cursor
            }
            return false; // prevent mistakes or some random stuff to happen
};
//         Functions for moving image --------------------------------- End ---------------------------------

//         Functions for scaling the edges -------------------------------- Start --------------------------------
//      Function to start the scaling
ImageCropper.prototype.ActivateScaling = function(event, cornerchosen, _this){
//         Do not have any dodgy stuff
                event.preventDefault();

//         Set the initial mouse positions
                _this.IniMouseX=event.clientX;
                _this.IniMouseY=event.clientY;

                var newcursor="auto";

//         Set the globals according to point chosen. Also set the way the cursor shall look like
                if(cornerchosen=="leftTop"){_this.leftBool=true; _this.topBool=true; _this.isCorner=true; newcursor="nwse-resize";}
                if(cornerchosen=="middleTop"){_this.leftBool=false; _this.topBool=true; _this.isCorner=false; _this.isTop=true; newcursor="ns-resize"}
                if(cornerchosen=="rightTop"){_this.leftBool=false; _this.topBool=true; _this.isCorner=true; newcursor="nesw-resize"}
                if(cornerchosen=="leftCenter"){_this.leftBool=true; _this.topBool=false; _this.isCorner=false; _this.isTop=false; newcursor="ew-resize"}
                if(cornerchosen=="rightCenter"){_this.leftBool=false; _this.topBool=false; _this.isCorner=false; _this.isTop=false; newcursor="ew-resize"}
                if(cornerchosen=="leftBottom"){_this.leftBool=true; _this.topBool=false; _this.isCorner=true; newcursor="nesw-resize"}
                if(cornerchosen=="middleBottom"){_this.leftBool=false; _this.topBool=false; _this.isCorner=false; _this.isTop=true; newcursor="ns-resize"}
                if(cornerchosen=="rightBottom"){_this.leftBool=false; _this.topBool=false; _this.isCorner=true; newcursor="nwse-resize"}
//         Change the cursor
                _this.frame.style.cursor=newcursor;
                document.body.style.cursor=newcursor;
//         No border has been touched
                _this.TouchedLeft=false;
                _this.TouchedRight=false;
                _this.TouchedTop=false;
                _this.TouchedBottom=false;
//         Start scaling
                _this.scaling = true;

                return false;
};

// This function moves the image according to the corner chosen
// The quantity to move is again calculated by the actual and the former mouse position and as well ghost as image are moved.
// For dots in the center of an edge a special procedure is needed, as not two values (i.e. top and left) shall be changed at the same time. Instead, only one shall be.
// The boundary conditions by the original image were again implemented.
// Press the SHIFT button, to keep the relations of the image.
// This was pretty hard to write.
// _this is again needed, as it is supposed to work for every instance.
ImageCropper.prototype.MoveCorner = function(event, _this){
//         If I am not _this.scaling, return
                if(!_this.scaling){
                    return false;
                }
//         _this part scales/moves the function in X direction. It is only needed, if my point is a corner OR if my point is at the left-middle or right-middle
            if(_this.isCorner || !_this.isTop){
//                      if I have a point at the left, then I will have to do some movements on left, otherwise increasing the width will look strange, since the image will not be pulled to the left, but increase to the right. If I touched the left side, then the image shall not move.
                        if(_this.leftBool && !_this.TouchedLeft){
                                var deltaX=_this.IniMouseX-event.clientX;  // calculate difference in mouse position in X direction, when on the left

                                var tmpX=parseInt(getCSSprop(_this.imageref,"left")); // get former position of images
                                var tmpGhostX=parseInt(getCSSprop(_this.ghostdiv,"left"));

                                _this.imageref.style.left=(tmpX-deltaX) + "px"; // set new position of images
                                _this.ghostdiv.style.left=(tmpGhostX-deltaX) + "px";
                        }
                        else{
                                var deltaX=event.clientX-_this.IniMouseX;  // calculate difference in mouse position in X direction, when on right. Different sign, as mouse moves to opposite direction
                        }

//                      If I have touched the left border, but am then moving to the left again, such that I go past the border, then I may scale again
                        if(_this.TouchedLeft && (parseInt(event.clientX)<parseInt(_this.ParentOffsetX))){
                                    _this.TouchedLeft=false;
//                                  Do not let image scale to left if shiftKey is pressed and I am still below the top border
                                    if(event.shiftKey && _this.TouchedTop && (parseInt(event.clientY)>parseInt(_this.ParentOffsetY))){
                                            _this.TouchedLeft=true;
                                    }
//                                  Do not let image scale to left if shiftKey is pressed and I am still below the bottom border
                                    if(event.shiftKey && _this.TouchedBottom && (parseInt(event.clientY)<parseInt(_this.ParentOffsetY)+parseInt(_this.ParentHeight))){
                                            _this.TouchedLeft=true;
                                    }

                        }

//                      Same for the right border
                        if(_this.TouchedRight && (parseInt(event.clientX)>parseInt(_this.ParentOffsetX)+parseInt(_this.ParentWidth))){
                                    _this.TouchedRight=false;

                                    if(event.shiftKey && _this.TouchedTop && (parseInt(event.clientY)>parseInt(_this.ParentOffsetY))){
                                            _this.TouchedRight=true;
                                    }
                                    if(event.shiftKey && _this.TouchedBottom && (parseInt(event.clientY)<parseInt(_this.ParentOffsetY)+parseInt(_this.ParentHeight))){
                                            _this.TouchedRight=true;
                                    }
                        }

//                      Only change the width, if I have not touched the left or right border, in which case I do not wish to scale anything
                        if(!_this.TouchedLeft && !_this.TouchedRight){
                                    var tmpWthX=parseInt(getCSSprop(_this.imageref,"width")); // get former widths of images
                                    var tmpGhostWthX=parseInt(getCSSprop(_this.ghostdiv,"width"));
                                    _this.imageref.style.width=(tmpWthX+deltaX) + "px"; // set new width of images
                                    _this.ghostdiv.style.width=(tmpGhostWthX+deltaX) + "px";
                        }

//                      If the image width becomes smaller than the frame width, change _this
                        if(parseInt(_this.imageref.style.width)<parseInt(_this.ParentWidth)){
                                    _this.imageref.style.width=(_this.ParentWidth) + "px";
                                    _this.ghostdiv.style.width=(_this.ParentWidth) + "px";
                        }

//                      If I exceed the left border, move image to it and stop movement and _this.scaling
                        if(parseInt(_this.imageref.style.left)>0){ // make sure that it does not exceed the border of what we are looking at!
                                    _this.imageref.style.left=0 + "px";
                                    _this.ghostdiv.style.left=_this.ParentOffsetX + "px";
                                    _this.TouchedLeft=true;
                        }

//                      Same for the right border
                        if(parseInt(_this.ParentWidth)-parseInt(getCSSprop(_this.imageref,"width"))-parseInt(getCSSprop(_this.imageref,"left"))>0){ // also not on the right
                                    _this.imageref.style.left=(_this.ParentWidth-parseInt(getCSSprop(_this.imageref,"width"))) + "px";
                                    _this.ghostdiv.style.left=(_this.ParentOffsetX+parseInt(getCSSprop(_this.imageref,"left"))) + "px";
                                    _this.TouchedRight=true;
                        }
//                      Set new initial mouse condition
                        _this.IniMouseX=event.clientX;

            }

//          Same as for X direction for Y direction, except shiftKey conditions
            if(_this.isCorner || _this.isTop){
                        if(_this.topBool && !_this.TouchedTop){
//                              If I have a corner and the shiftKey is pressed, then scale proportionally
                                if(event.shiftKey && _this.isCorner){
//                                      If I have not touched the left or right border, then assign deltaY to deltaX
                                        if(!_this.TouchedLeft && !_this.TouchedRight){
                                                var deltaY=deltaX;
                                        }
//                                      Otherwise there is no _this.scaling
                                        else{
                                                var deltaY=0;
                                        }
                                }
//                              Otherwise just use the default mouse
                                else{
                                        var deltaY=_this.IniMouseY-event.clientY;  // calculate difference in mouse position in Y direction, top side
                                }

                                var tmpY=parseInt(getCSSprop(_this.imageref,"top")); // get former position of image
                                var tmpGhostY=parseInt(getCSSprop(_this.ghostdiv,"top"));

                                _this.imageref.style.top=(tmpY-deltaY) + "px"; // set new position of image
                                _this.ghostdiv.style.top=(tmpGhostY-deltaY) + "px";
                        }
                        else{
//                              Same as before for bottom corners
                                if(event.shiftKey && _this.isCorner){
                                        if(!_this.TouchedLeft && !_this.TouchedRight){
                                                var deltaY=deltaX;
                                        }
                                        else{
                                                var deltaY=0;
                                        }
                                }
                                else{
                                        var deltaY=event.clientY-_this.IniMouseY;  // calculate difference in mouse position in Y direction, bottom side
                                }
                        }

                        if(_this.TouchedTop && (parseInt(event.clientY)<parseInt(_this.ParentOffsetY))){
                                    _this.TouchedTop=false;
                        }


                        if(_this.TouchedBottom && (parseInt(event.clientY)>parseInt(_this.ParentOffsetY)+parseInt(_this.ParentHeight))){
                                    _this.TouchedBottom=false;
                        }

                        if(!_this.TouchedTop && !_this.TouchedBottom){
                                    var tmpWthY=parseInt(getCSSprop(_this.imageref,"height")); // get former position of image
                                    var tmpGhostWthY=parseInt(getCSSprop(_this.ghostdiv,"height"));
                                    _this.imageref.style.height=(tmpWthY+deltaY) + "px"; // set new position of image
                                    _this.ghostdiv.style.height=(tmpGhostWthY+deltaY) + "px";
                        }

                        if(parseInt(_this.imageref.style.height)<parseInt(_this.ParentHeight)){
                                    _this.imageref.style.height=_this.ParentHeight + "px";
                                    _this.ghostdiv.style.height=_this.ParentHeight + "px";
                        }

                        if(parseInt(_this.imageref.style.top)>0){ // make sure it stays inside w.r.t. top
                                    _this.imageref.style.top=0 + "px";
                                    _this.ghostdiv.style.top=_this.ParentOffsetY + "px";
                                    _this.TouchedTop=true;
//                                  Prevent image from _this.scaling beyond fixed scale by shiftKey when touching the top border
                                    if(event.shiftKey && _this.leftBool){_this.TouchedLeft=true;}
                                    if(event.shiftKey && !_this.leftBool){_this.TouchedRight=true;}
                        }
                        else if(parseInt(_this.ParentHeight)-parseInt(getCSSprop(_this.imageref,"height"))-parseInt(getCSSprop(_this.imageref,"top"))>0){ // and bottom
                                    _this.imageref.style.top=(_this.ParentHeight-parseInt(getCSSprop(_this.imageref,"height"))) + "px";
                                    _this.ghostdiv.style.top=(_this.ParentOffsetY+parseInt(getCSSprop(_this.imageref,"top"))) + "px";
                                    _this.TouchedBottom=true;
//                                  Prevent image from _this.scaling beyond fixed scale by shiftKey when touching the bottom border
                                    if(event.shiftKey && _this.leftBool){_this.TouchedLeft=true;}
                                    if(event.shiftKey && !_this.leftBool){_this.TouchedRight=true;}
                        }

                        _this.IniMouseY=event.clientY;
            }

                return false;
};

//      Stop scaling from happening
ImageCropper.prototype.StopScaling = function(_this){
            _this.scaling = false; // stop scaling image
//          Reset all cursors
            _this.frame.style.cursor="grab";
            document.body.style.cursor="auto"; // reset cursor

            return false; // prevent mistakes or some random stuff to happen
};
//         Functions for scaling the edges -------------------------------- Stop --------------------------------

//------------------------------------- Drag and Drop functionality and image modification -------------------------

// -------------------------------------------------------------- Save the whole story --------------------------------------------------------------
// This works by creating a canvas, in which the cropped image is put. The resulting dataURI is then converted to a blob and an additional image is added to dropzonejs.
// Dropzonejs then submits the images. Via some php file.
ImageCropper.prototype.SaveAndCropImage= function(){
//   _this is required again, since it is not known in the .onload bit
      var _this = this;

      var imageObj = new Image();

      imageObj.onload = function() {
            // draw cropped image, i.e. create canvas with right properties
            var sourceX = Math.round(imageObj.width / parseFloat(getCSSprop(_this.imageref,"width")) * Math.abs(parseFloat(getCSSprop(_this.imageref,"left"))));
            var sourceY = Math.round(imageObj.height / parseFloat(getCSSprop(_this.imageref,"height")) * Math.abs(parseFloat(getCSSprop(_this.imageref,"top"))));
            var sourceWidth = Math.round(imageObj.width / parseFloat(getCSSprop(_this.imageref,"width")) * _this.ParentWidth);
            var sourceHeight = Math.round(imageObj.height / parseFloat(getCSSprop(_this.imageref,"height")) * _this.ParentHeight);
//         alert(_this.ParentWidth);
            var destX = 0;
            var destY = 0;
            var destWidth = sourceWidth;
            var destHeight = sourceHeight;

            var canvas = document.createElement('canvas');
            canvas.id="tmp-cropping-canvas";
            canvas.width=sourceWidth;
            canvas.height=sourceHeight;
            canvas.style.position="absolute";

//             _this.frame.appendChild(canvas);

//             var content=document.getElementById("tmp-cropping-canvas");
            var content = canvas;
            var context = content.getContext('2d');

            context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

// Get DataURL from the canvas
            //check png
            if(_this.filetype=="png" || _this.filetype=="PNG"){
                  var base64ImageData = content.toDataURL();
            }
            else { //in any other case, save as jpg
                  var base64ImageData = content.toDataURL("image/jpeg", 1);
            }
//         create a blob and a new file from _this blob
            var newFile = dataURItoBlob(base64ImageData);
            newFile.name=_this.filename + "-cropped"; //name does not really matter, since sent as extra argument, but -cropped matters!
//            if(typeof _this.myDropzone.files[0] !== 'undefined'){
//				a new file has been uploaded, so get the name of the new file
//                newFile.name=_this.myDropzone.files[0].name + "-cropped";
//            }
//            else{
//				no new file has been uploaded, so take the old name
//              Get the name of the cropped image (the one that was there first, hence originalImg, bad name, to be changed at some point..), otherwise we will always overwrite the original
//                newFile.name=_this.originalImg.getAttribute("src") + "-cropped";
//            }

//         Debug
//             console.log("Hi");
//             console.log(newFile);
//             console.log("there");

//         Allow multiple upload
            _this.preventMulti = false;
//         add the cropped image to the original one
            _this.myDropzone.addFile(newFile);
//         disallow multiple upload again, to allow new files to be uploaded
            _this.preventMulti = true;
//             content.parentNode.removeChild(content);

//             var data = "<p>_this is 'myWindow'</p><img src='" + base64ImageData + "'>";
//             myWindow = window.open(base64ImageData);
//             myWindow.focus();

//             console.log("I was there before you!");
            _this.myDropzone.processQueue();

//			require to allow multiple saves after each other
            newFile.name=newFile.name.replace("-cropped","");
            //alert("This is the filename of the dropzone " + newFile.name);
      };

    imageObj.src = this.imageref.src;
};


// /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\------------------------------------------------------ End of Class - Begin of Document ------------------------------------------------------------------/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

var getEditableImages = document.getElementsByClassName("img-editable");
var ImageCropperHashMap = {}; // this variable holds all the different names of the different images and is the hashmap
var ImageCropperInstaces = [];

window.addEventListener('load', createImageCropperInstances, false);

function createImageCropperInstances(){
     for (var i = 0; i < getEditableImages.length; i++) {
          ImageCropperInstaces[i] = new ImageCropper(getEditableImages[i], i);

     }
}

function saveCroppedImages(){
//   Save all images
  for (i = 0; i < getEditableImages.length; i++) {
    ImageCropperInstaces[i].SaveAndCropImage();
  }
}

// Wrap wrapper around el, e.g. a div around a div
function wrap(el, wrapper) {
	    el.parentNode.insertBefore(wrapper, el);
	    wrapper.appendChild(el);
}

// gives me the property written in css, even if it is not written inline, i.e. via class and id; cssvalue has to be a string
function getCSSprop(elementID, cssvalue){
            var returnvalue="";
            returnvalue=document.defaultView.getComputedStyle(elementID, null).getPropertyValue(cssvalue);
            return returnvalue;
}

// function that converts a URI to a Blob
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

// Check, whether file exists with javascript
function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}
