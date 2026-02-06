(function () {
  var form = document.querySelector('.waitlist-form');
  if (!form) return;

  var input = form.querySelector('input[type="email"]');
  var button = form.querySelector('button[type="submit"]');
  var messageEl = document.getElementById('waitlist-message');

  function setMessage(text, isError) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.hidden = false;
    messageEl.classList.toggle('waitlist-message--error', !!isError);
  }

  function clearMessage() {
    if (messageEl) {
      messageEl.textContent = '';
      messageEl.hidden = true;
      messageEl.classList.remove('waitlist-message--error');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!input || !button) return;

    var email = (input.value || '').trim();
    if (!email) return;

    button.disabled = true;
    clearMessage();

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (res.ok) {
            setMessage(data.message || "Thanks — we'll be in touch.", false);
            input.value = '';
            input.placeholder = "We'll notify you at launch.";
          } else {
            setMessage(data.error || 'Something went wrong. Please try again.', true);
          }
        });
      })
      .catch(function () {
        setMessage('Something went wrong. Please check your connection and try again.', true);
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
