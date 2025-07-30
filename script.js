const scriptURL = 'https://script.google.com/macros/s/AKfycbylzbKqMNWp0MtISWnGDN3-FR8kvLYfH1nS7cnJtiSxwl0z3DeVootZlR06QebxPaHWgg/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  const status = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');
  const userTypeSelect = document.getElementById('userType');

  const formSections = {
    'Job Seeker': document.getElementById('jobSeekerFields'),
    'Employer': document.getElementById('employerFields'),
    'Real Estate': document.getElementById('realEstateFields')
  };

  // Show relevant fields based on selected user type
  if (userTypeSelect) {
    userTypeSelect.addEventListener('change', function () {
      const type = this.value;
      Object.entries(formSections).forEach(([key, section]) => {
        section.classList.toggle('hidden', key !== type);
      });
    });
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Disable button during submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      // Collect all form data
      const formData = new FormData(form);
      const data = {};

      for (const name of new Set([...formData.keys()])) {
        const values = formData.getAll(name);
        data[name] = values.length > 1 ? values : values[0];
      }

      try {
        const response = await fetch(scriptURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.status === 'success') {
          status.innerHTML = `
            <div class="alert-message alert-success">
              <strong>Success!</strong> Your registration has been submitted.
            </div>
          `;
        } else {
          throw new Error(result.message || "Unknown error");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        status.innerHTML = `
          <div class="alert-message alert-error">
            <strong>Error:</strong> ${error.message}
          </div>
        `;
      } finally {
        form.reset();
        Object.values(formSections).forEach(section => section.classList.add('hidden'));

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        }

        status.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
