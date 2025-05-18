const checkbox = document.getElementById('menu-bar');
const nav = document.querySelector('nav');
const ad = document.querySelector('.ad');
const toggle = document.getElementById('toggle-bar');
const navBtn = document.querySelector('.nav-btn');
const userAction = document.querySelector('.user-actions');

async function isAuthorised() {
  try {
    const response = await fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!response.ok) {
      navBtn.innerHTML = `<a href="/user/login" target="_blank" class="btn btn-primary"
      >Login</a
    >
    <a
      href="/user/register"
      target="_blank"
      class="btn btn-secondary"
      >Register</a
    >`;
      throw new Error('Something went wrong');
    }

    const { auth, username } = await response.json();
    console.log(username);

    if (auth) {
      userAction.innerHTML = `<div class="user-profile">
                  <img src="/img/user.png" alt="User Profile" />
                  <span>${username.replace('-', ' ')}</span>
                </div>`;
      navBtn.innerHTML = `<a href="/user/logout" target="_blank" class="btn btn-danger"
                  >Logout</a
                >`;
    } else {
      userAction.innerHTML = '';
      navBtn.innerHTML = `<a href="/user/login" target="_blank" class="btn btn-primary"
                  >Login</a
                >
                <a
                  href="/user/register"
                  target="_blank"
                  class="btn btn-secondary"
                  >Register</a
                >`;
    }
  } catch (error) {}
}

isAuthorised();

const adder = () => {
  if (window.scrollY > 40) {
    nav.style.top = '0';
    nav.style.position = 'fixed';
    document.body.style.marginTop = '3.8rem';
  } else {
    nav.style.top = '';
    nav.style.position = '';
    document.body.style.marginTop = '';
  }
};
window.addEventListener('scroll', adder);

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
      toggle.style.left = '-100%';
    }
  });
}
