const dark = document.getElementById('dark');
const light = document.getElementById('light');
const head = document.querySelector('head');
const link = document.createElement('link');

dark.style.lineHeight = '36px';
light.style.lineHeight = '36px';

const savedmode = localStorage.getItem('mode');

if (savedmode === 'dark') {
  head.appendChild(link);
  light.style.display = 'block';
  dark.style.display = 'none';
  document.documentElement.classList.add('dark');
} else {
  light.style.display = 'none';
  dark.style.display = 'block';
  document.documentElement.classList.remove('dark');
}

dark.addEventListener('click', () => {
  document.documentElement.classList.add('dark');
  dark.style.display = 'none';
  dark.style.display = 'none';
  light.style.lineHeight = '36px';
  localStorage.setItem('mode', 'dark');
  light.style.display = 'block';
});

light.addEventListener('click', () => {
  document.documentElement.classList.remove('dark');
  light.style.display = 'none';
  light.style.display = 'none';
  dark.style.lineHeight = '36px';
  localStorage.setItem('mode', 'light');
  setTimeout(() => {
    dark.style.display = 'block';
  }, 500);
});
