const scriptURL = 'https://script.google.com/macros/s/AKfycbyBKsURnjHmLjxKJPdsEXod-_gpFCX_6r6HowZonUCBWVe8eoTXu1BWd2lZt-5MsN_6WQ/exec';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('userForm');
  const status = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');
  const userTypeSelect = document.getElementById('userType');

  const formSections = {
    'Job Seeker': document.getElementById('jobSeekerFields'),
    'Employer': document.getElementById('employerFields'),
    'Real Estate': document.getElementById('realEstateFields')
  };

  // Show only relevant section
  if (userTypeSelect) {
    userTypeSelect.addEventListener('change', function() {
      const type = this.value;
      Object.entries(formSections).forEach(([key, section]) => {
        if (section) section.classList.toggle('hidden', key !== type);
      });
    });
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Disable button during submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      // Create hidden iframe
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Create form for iframe submission
      const iframeForm = document.createElement('form');
      iframeForm.action = scriptURL;
      iframeForm.method = 'POST';
      iframeForm.target = 'hidden-iframe';
      iframeForm.style.display = 'none';

      // Capture form data (including checkboxes with same name)
      const formData = new FormData(form);
      const fieldNames = new Set([...formData.keys()]);
      for (const name of fieldNames) {
        const values = formData.getAll(name);
        for (const value of values) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = value;
          iframeForm.appendChild(input);
        }
      }

      document.body.appendChild(iframeForm);
      iframeForm.submit();

      // Wait and reset
      setTimeout(() => {
        if (status) {
          status.innerHTML = `
            <div class="alert-message alert-success">
              <strong>Success!</strong> Your registration has been submitted.
            </div>
          `;
          status.scrollIntoView({ behavior: 'smooth' });
        }

        form.reset();
        Object.values(formSections).forEach(section => {
          if (section) section.classList.add('hidden');
        });

        document.body.removeChild(iframe);
        document.body.removeChild(iframeForm);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        }
      }, 2000); // delay to allow Google Apps Script to process
    });
  }
});
