const body = document.body;
const imgFon = document.getElementById('imgfon');
const textFon = document.getElementById('textfon');
const box = document.getElementById('box');
const span = document.querySelector('span');
const spanScore = document.querySelector('#score');
imgFon.style.opacity = '1';

bgImage();

function bgImage() {
  const img1 = "./img/1.jpg";
  const img2 = "./img/2.jpg";
  
  const arr = [img1, img2];
  imgFon.src = "./img/1.jpg";

  let index = 1;
  setInterval(function () {
    imgFon.src = arr[index];
    index += 1;
    if (index === arr.length) {
      index = 0;
    }
  }, 3000);
};

const menu = (event) => {
  if (event.key !== 'Enter') {
    return;
  } else {
    textFon.style.display = 'none';
    let timeId = setInterval(function () {
      imgFon.style.opacity = imgFon.style.opacity - 0.05;
      
    }, 50);
    setTimeout(function () {
      clearInterval(timeId);
      span.classList.remove('hidden');
      spanScore.classList.remove('hidden');
      imgFon.style.display = 'none';
      animate();
    }, 700);
  };
  body.removeEventListener('keydown', menu);
}

body.addEventListener('keydown', menu);
