const loader = document.getElementById("loader");
const content = document.getElementById("con");
const form = document.getElementById("register-form");
const progressBar = document.getElementById("progress-bar");
const submitBtn = document.getElementById("submit-btn");
const toast = document.getElementById("toast");
const strengthMeter = document.getElementById("strength-meter");
const strengthMeterFill = document.getElementById("strength-meter-fill");
const passwordInfo = document.getElementById("password-info");
const passwordView = document.querySelectorAll(".pass-view");

// Input fields
const fname = document.getElementById("fname");
const lname = document.getElementById("lname");
const email = document.getElementById("email");
const mobile = document.getElementById("mob");
const address = document.getElementById("add");
const password = document.getElementById("pass");
const confirmPass = document.getElementById("confirm-pass");

// Error messages
const fnameError = document.getElementById("fname-error");
const lnameError = document.getElementById("lname-error");
const emailError = document.getElementById("email-error");
const mobileError = document.getElementById("mob-error");
const addressError = document.getElementById("add-error");
const passwordError = document.getElementById("pass-error");
const confirmPassError = document.getElementById("confirm-pass-error");

const passwordHideView = (id, selector) => {
  let isClick = false;
  selector.addEventListener("click", () => {
    isClick = !isClick;
    if (isClick) {
      selector.classList.replace("fa-eye-slash", "fa-eye");
      id.type = "text";
    } else {
      selector.classList.replace("fa-eye", "fa-eye-slash");
      id.type = "password";
    }
  });
};

passwordHideView(password, passwordView[0]);
passwordHideView(confirmPass, passwordView[1]);

const validateField = (field, errorElement, validateFn) => {
  if (!validateFn(field.value)) {
    field.classList.add("error");
    field.classList.remove("success");
    errorElement.classList.add("show");
    return false;
  } else {
    field.classList.remove("error");
    field.classList.add("success");
    errorElement.classList.remove("show");
    return true;
  }
};

const validateName = (value) => value.trim().length >= 2;
const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validateMobile = (value) =>
  /^\d{10,15}$/.test(value.replace(/[^0-9]/g, "")) && value.length === 10;
const validateAddress = (value) => value.trim().length >= 5;
const validatePassword = (value) => value.length >= 8;
const validateConfirmPassword = (value) =>
  value === password.value && value.length >= 8;

// Check password strength
const checkPasswordStrength = (value) => {
  strengthMeter.style.display = "block";
  passwordInfo.style.display = "block";

  let strength = 0;

  if (value.length >= 8) strength += 1;
  if (/[A-Z]/.test(value)) strength += 1;
  if (/[a-z]/.test(value)) strength += 1;
  if (/[0-9]/.test(value)) strength += 1;
  if (/[^A-Za-z0-9]/.test(value)) strength += 1;

  switch (strength) {
    case 0:
      strengthMeterFill.style.width = "0%";
      strengthMeterFill.style.background = "#f5365c";
      passwordInfo.textContent = "Password is too weak";
      break;
    case 1:
    case 2:
      strengthMeterFill.style.width = "25%";
      strengthMeterFill.style.background = "#fb6340";
      passwordInfo.textContent = "Password is weak";
      break;
    case 3:
      strengthMeterFill.style.width = "50%";
      strengthMeterFill.style.background = "#ffd600";
      passwordInfo.textContent = "Password is moderate";
      break;
    case 4:
      strengthMeterFill.style.width = "75%";
      strengthMeterFill.style.background = "#2dce89";
      passwordInfo.textContent = "Password is strong";
      break;
    case 5:
      strengthMeterFill.style.width = "100%";
      strengthMeterFill.style.background = "#2dce89";
      passwordInfo.textContent = "Password is very strong";
      break;
  }
};

const updateProgressBar = () => {
  const totalFields = 7;
  let filledFields = 0;

  if (fname.value.trim() !== "") filledFields++;
  if (lname.value.trim() !== "") filledFields++;
  if (email.value.trim() !== "") filledFields++;
  if (mobile.value.trim() !== "") filledFields++;
  if (address.value.trim() !== "") filledFields++;
  if (password.value.trim() !== "") filledFields++;
  if (confirmPass.value.trim() !== "") filledFields++;

  const progress = (filledFields / totalFields) * 100;
  progressBar.style.width = `${progress}%`;
};

const showToast = (message, type) => {
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
};

fname.addEventListener("input", () => {
  validateField(fname, fnameError, validateName);
  updateProgressBar();
});

lname.addEventListener("input", () => {
  validateField(lname, lnameError, validateName);
  updateProgressBar();
});

email.addEventListener("input", () => {
  validateField(email, emailError, validateEmail);
  updateProgressBar();
});

mobile.addEventListener("input", () => {
  validateField(mobile, mobileError, validateMobile);
  updateProgressBar();
});

address.addEventListener("input", () => {
  validateField(address, addressError, validateAddress);
  updateProgressBar();
});

password.addEventListener("input", () => {
  validateField(password, passwordError, validatePassword);
  checkPasswordStrength(password.value);
  updateProgressBar();

  if (password.value.length >= 8) {
    confirmPass.parentElement.style.display = "block";
  } else {
    confirmPass.parentElement.style.display = "none";
  }

  if (confirmPass.value !== "") {
    validateField(confirmPass, confirmPassError, validateConfirmPassword);
  }
});

confirmPass.addEventListener("input", () => {
  validateField(confirmPass, confirmPassError, validateConfirmPassword);
  updateProgressBar();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isFirstNameValid = validateField(fname, fnameError, validateName);
  const isLastNameValid = validateField(lname, lnameError, validateName);
  const isEmailValid = validateField(email, emailError, validateEmail);
  const isMobileValid = validateField(mobile, mobileError, validateMobile);
  const isAddressValid = validateField(address, addressError, validateAddress);
  const isPasswordValid = validateField(
    password,
    passwordError,
    validatePassword
  );
  const isConfirmPasswordValid = validateField(
    confirmPass,
    confirmPassError,
    validateConfirmPassword
  );

  if (
    isFirstNameValid &&
    isLastNameValid &&
    isEmailValid &&
    isMobileValid &&
    isAddressValid &&
    isPasswordValid &&
    isConfirmPasswordValid
  ) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    submitBtn.classList.add("loading");

    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      submitBtn.classList.remove("loading");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Registration failed with status: ${res.status}`
        );
      }

      form.reset();
      updateProgressBar();
      showToast(
        "Account created successfully! Redirecting to login...",
        "success"
      );

      setTimeout(() => {
        window.location.href = "/user/login";
      }, 2000);
    } catch (err) {
      submitBtn.classList.remove("loading");
      showToast(
        err.message || "Registration failed. Please try again.",
        "error"
      );
    }
  } else {
    showToast("Please Fill all the Field", "error");
  }
});
