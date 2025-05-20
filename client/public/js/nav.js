const checkbox = document.getElementById('menu-bar');
const nav = document.querySelector('nav');
const ad = document.querySelector('.ad');
const toggle = document.getElementById('toggle-bar');
const navBtn = document.querySelectorAll('.nav-btn');
const userAction = document.querySelectorAll('.user-actions');
const tContainer = document.querySelector('.t-container ');

async function isAuthorised() {
  try {
    const response = await fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      navBtn.forEach(
        (e) =>
          (e.innerHTML = `<a href="/user/login" class="btn btn-primary"
        >Login</a
      >
      <a
        href="/user/register"
        class="btn btn-secondary"
        >Register</a
      >`),
      );
      throw new Error('Something went wrong');
    }

    const { auth, username } = await response.json();

    if (auth) {
      userAction.forEach(
        (e) =>
          (e.innerHTML = `<div class="user-profile">
                  <img src="/img/user.png" alt="User Profile" />
                  <span>${username.split('-')[0]}</span>
                </div>`),
      );
      navBtn.forEach(
        (e) =>
          (e.innerHTML = `<a href="/user/logout" class="btn btn-danger"
      >Logout</a
    >`),
      );
    } else {
      userAction.forEach((e) => (e.innerHTML = ''));
      navBtn.forEach(
        (e) =>
          (e.innerHTML = `<a href="/user/login" class="btn btn-primary"
        >Login</a
      >
      <a
        href="/user/register"
        class="btn btn-secondary"
        >Register</a
      >`),
      );
    }
  } catch (error) {}
}

isAuthorised();

const adder = () => {
  const isMobile = window.innerWidth <= 425;
  let value = isMobile ? 96 : 40;
  let tvalue = isMobile ? 'calc(6rem + 3.8rem)' : 'calc(3.8rem + 40px)';

  if (window.scrollY > value) {
    nav.style.top = '0';
    nav.style.position = 'fixed';
    document.body.style.marginTop = '3.8rem';
    tContainer.style.top = '3.8rem';
    ad.style.display = 'none';
  } else {
    nav.style.top = '';
    nav.style.position = '';
    document.body.style.marginTop = '';
    tContainer.style.top = tvalue;
    ad.style.display = '';
  }
};
window.addEventListener('scroll', adder);
window.addEventListener('resize', adder);
adder();

if (checkbox) {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      toggle.style.transition = 'all 0.5s ease';
      toggle.style.right = '0';
    } else {
      toggle.style.right = '-100%';
      toggle.style.transition = 'all 0.5s ease';
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      checkbox.checked = false;
      toggle.style.transition = 'all 0.5s ease';
      toggle.style.right = '-100%';
    }
  });
}

if (window.location.pathname === '/') {
  document.querySelector('footer').style.marginTop = '0';
}
