const button = document.querySelector('#change-color-button');
button.addEventListener('click', function() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.backgroundColor = randomColor;
});


const link = document.querySelector('#popup-link');
link.addEventListener('click', function(event) {
  event.preventDefault();
  const popup = window.open(link.href, 'popup', 'width=600,height=400');
  popup.focus();
});

const avatar = document.querySelector('#avatar');
avatar.addEventListener('mouseenter', function() {
  avatar.src = 'path/to/hover-image.png';
});

var avatar = document.getElementById("avatar");
var originalSrc = avatar.getAttribute("src");
var hoverSrc = avatar.getAttribute("data-hover-src");

avatar.addEventListener("mouseover", function() {
  avatar.setAttribute("src", hoverSrc);
});




