const loader = document.getElementById('loader');
const content = document.getElementById('con');
const form = document.getElementById('register-form');
const progressBar = document.getElementById('progress-bar');
const submitBtn = document.getElementById('submit-btn');
const toast = document.getElementById('toast');
const passwordView = document.querySelectorAll('.pass-view');

// Input fields
const email = document.getElementById('email');
const password = document.getElementById('pass');

// Error messages
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('pass-error');

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    loader.style.display = 'none';
    content.style.display = 'block';
    setTimeout(function () {
      content.style.opacity = 1;
    }, 50);
  }, 1000);
});

const passwordHideView = (id, selector) => {
  let isClick = false;
  selector.addEventListener('click', () => {
    isClick = !isClick;
    if (isClick) {
      selector.classList.replace('fa-eye-slash', 'fa-eye');
      id.type = 'text';
    } else {
      selector.classList.replace('fa-eye', 'fa-eye-slash');
      id.type = 'password';
    }
  });
};

passwordHideView(password, passwordView[0]);

const validateField = (field, errorElement, validateFn) => {
  if (!validateFn(field.value)) {
    field.classList.add('error');
    field.classList.remove('success');
    errorElement.classList.add('show');
    return false;
  } else {
    field.classList.remove('error');
    field.classList.add('success');
    errorElement.classList.remove('show');
    return true;
  }
};

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validateMobile = (value) =>
  /^\d{10,15}$/.test(value.replace(/[^0-9]/g, ''));
const validatePassword = (value) => value.length >= 8;

const updateProgressBar = () => {
  const totalFields = 2;
  let filledFields = 0;

  if (email.value.trim() !== '') filledFields++;
  if (password.value.trim() !== '') filledFields++;

  const progress = (filledFields / totalFields) * 100;
  progressBar.style.width = `${progress}%`;
};

const showToast = (message, type) => {
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};

email.addEventListener('input', () => {
  validateField(email, emailError, validateEmail);
  updateProgressBar();
});

password.addEventListener('input', () => {
  validateField(password, passwordError, validatePassword);
  updateProgressBar();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isEmailValid = validateField(email, emailError, validateEmail);
  const isPasswordValid = validateField(
    password,
    passwordError,
    validatePassword,
  );

  if (isEmailValid && isPasswordValid) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    submitBtn.classList.add('loading');

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      submitBtn.classList.remove('loading');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Registration failed with status: ${res.status}`,
        );
      }

      form.reset();
      updateProgressBar();
      showToast('Login successfully! Redirecting to Dashboard...', 'success');

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      submitBtn.classList.remove('loading');
      showToast(
        err.message || 'Registration failed. Please try again.',
        'error',
      );
      console.error('Registration failed:', err);
    }
  } else {
    showToast('Please Fill all the Field', 'error');
  }
});

const getData = async () => {
  try {
    const res = await fetch('/user');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error('Fetching users failed:', err);
  }
};

getData();
