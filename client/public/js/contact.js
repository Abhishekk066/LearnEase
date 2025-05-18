const faqItems = document.querySelectorAll('.faq-item');

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
document
  .getElementById('contactForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    try {
      const response = await fetch('/sendmail', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!response.ok) {
        throw new Error('Something went wrong.');
      }
      const data = await response.json();
      alert(data.message);
      this.reset();
    } catch (e) {
      console.error(e);
    }
  });
