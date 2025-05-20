document.addEventListener('DOMContentLoaded', function () {
  var loader = document.getElementById('loader');
  var content = document.getElementById('con');
  setTimeout(function () {
    loader.style.display = 'none';
    content.style.display = 'block';
    setTimeout(function () {
      content.style.opacity = 1;
    }, 50);
  }, 1000);
});
