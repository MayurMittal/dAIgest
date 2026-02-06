(function () {
  var form = document.querySelector('.waitlist-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('input[type="email"]');
    var button = form.querySelector('button[type="submit"]');
    if (!input || !button) return;

    var email = (input.value || '').trim();
    if (!email) return;

    button.disabled = true;
    button.textContent = 'Thanks — we\'ll be in touch.';
    input.value = '';
    input.placeholder = 'We\'ll notify you at launch.';

    // Optional: send to your backend later
    // fetch('/api/waitlist', { method: 'POST', body: JSON.stringify({ email }) });
  });
})();
