const scriptURL = 'https://script.google.com/macros/s/AKfycbxoLiXSF3eh7WxtvoCeoy26s8dmtjhzUHXKd28J47UHawKMYLWVF_Gmwi9UUNmlou7o/exec';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('userForm');
  const status = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');

  const formSections = {
    'Job Seeker': document.getElementById('jobSeekerFields'),
    'Employer': document.getElementById('employerFields'),
    'Real Estate': document.getElementById('realEstateFields')
  };

  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Disable submit button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }

    try {
      const formData = new FormData(form);
      const data = {};

      formData.forEach((value, key) => {
        if (key === 'reServices') {
          if (!data[key]) data[key] = [];
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });

      const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json(); // Only works if Apps Script sends JSON
        status.innerHTML = `
          <div class="alert-message alert-success">
            <strong>Success!</strong> ${result.message || "Your registration has been submitted."}
          </div>
        `;
      } else {
        status.innerHTML = `
          <div class="alert-message alert-error">
            <strong>Submission failed.</strong> Please try again later.
          </div>
        `;
      }

      status.scrollIntoView({ behavior: 'smooth' });
      form.reset();
      Object.values(formSections).forEach(section => {
        if (section) section.classList.add('hidden');
      });

    } catch (error) {
      status.innerHTML = `
        <div class="alert-message alert-error">
          <strong>Error!</strong> ${error.message}
        </div>
      `;
      console.error('Submission Error:', error);
      status.scrollIntoView({ behavior: 'smooth' });

    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      }
    }
  });
});
