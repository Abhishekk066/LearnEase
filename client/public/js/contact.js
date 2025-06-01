const faqItems = document.querySelectorAll('.faq-item');
const toast = document.getElementById('toast');
const sendBtn = document.getElementById('send-btn');

faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    item.classList.toggle('active');
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
      }
    });
  });
});
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  sendBtn.innerHTML = ` <span class="btn-text">Sending Message</span>&nbsp;&nbsp;
                  <i class="fas fa-spinner fa-spin"></i>`;

  try {
    const response = await fetch('/sendmail', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ name, email, subject, message }),
    });
    if (!response.ok) {
      sendBtn.innerHTML = 'Send Message';
      showToast('Something went wrong', 'error');
      throw new Error('Something went wrong.');
    }
    const data = await response.json();
    showToast(data.message, data.level);
    sendBtn.innerHTML = 'Send Message';
    this.reset();
  } catch (e) {
    sendBtn.innerHTML = 'Send Message';
    showToast('Something went wrong', 'error');
  }
});

const showToast = (message, type) => {
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};
