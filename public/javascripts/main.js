
let scrollBtn = document.querySelector('.arrowAnchor-img')

let allInputs = document.querySelectorAll('input')
let textArea = document.querySelectorAll('textarea')
let base = 300;


if(scrollBtn){
    scrollBtn.addEventListener('mouseenter', function(){
       
        scrollBtn.classList.remove('animated')
    })
    scrollBtn.addEventListener('mouseleave', function(){
        scrollBtn.classList.add('animated')
    })
    scrollBtn.addEventListener('click',function() {
        setTimeout(function () {
            window.scrollTo(0, base);
        },2);
        base *=2
    })

    
   
}
textArea.forEach(input => {
 
    input.addEventListener('focus', inputFocus)
    
  })
  
  textArea.forEach(input => {
 
    input.addEventListener('blur', inputUnfocus)
    
  })
allInputs.forEach(input => {
 
  input.addEventListener('focus', inputFocus)
  
})

allInputs.forEach(input => {
 
  input.addEventListener('blur', inputUnfocus)
  
})

function inputFocus(){
  this.style.background = 'white'
}

function inputUnfocus(){
  this.style.background = 'rgba(255, 200, 100, 0.4)'
}

// let submitBtn = document.getElementById('submit')
// submitBtn.addEventListener("click", function(event){
//   event.preventDefault()
//   dropMessage()
// });

// function dropMessage(){
//   document.getElementById('messIm').style.display="inline"

// }




function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    locationOutput.value = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
console.log(position)
  document.getElementById('lat').value = position.coords.latitude
  document.getElementById('long').value = position.coords.longitude
  
}


var myWidget = cloudinary.createUploadWidget({
  cloudName: 'bobbynicholsoncloud', 
  uploadPreset: 'fpngtl3l'}, (error, result) => { 
    if (!error && result && result.event === "success") { 
      console.log('Done! Here is the image info: ', result.info); 
      document.getElementById('img').value = result.info.secure_url
    }
  }
)
let uploadBtn = document.getElementById('upload_widget')
if(uploadBtn){
  document.getElementById("upload_widget").addEventListener("click", function(){
    myWidget.open();
  }, false);
}





