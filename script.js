const scriptURL = 'https://script.google.com/macros/s/AKfycbyQtejDmgBCQqzsz4QuoAswuCeawWXWNXUNEbs3QV2jB4c0899mfFzO1D75Gu3gIw-o/exec';

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('userForm');
  const status = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');
  const userTypeSelect = document.getElementById('userType');

  // Initialize form sections
  const formSections = {
    'Job Seeker': document.getElementById('jobSeekerFields'),
    'Employer': document.getElementById('employerFields'),
    'Real Estate': document.getElementById('realEstateFields')
  };

  // Handle user type selection
  if (userTypeSelect) {
    userTypeSelect.addEventListener('change', function() {
      const type = this.value;
      Object.entries(formSections).forEach(([key, section]) => {
        if (section) section.classList.toggle('hidden', key !== type);
      });
    });
  }

  // Handle form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      // Create hidden iframe for form submission
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Create a form specifically for the iframe submission
      const iframeForm = document.createElement('form');
      iframeForm.action = scriptURL;
      iframeForm.method = 'POST';
      iframeForm.target = 'hidden-iframe';
      iframeForm.style.display = 'none';

      // Copy all form data to the new form
      const formData = new FormData(form);
      for (const [name, value] of formData.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        iframeForm.appendChild(input);
      }

      document.body.appendChild(iframeForm);
      
      // Submit the form through the iframe
      iframeForm.submit();

      // Set a timeout to check for completion
      setTimeout(() => {
        // Show success message
        if (status) {
          status.innerHTML = `
            <div class="alert-message alert-success">
              <strong>Success!</strong> Your registration has been submitted.
            </div>
          `;
          status.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Reset form
        form.reset();
        Object.values(formSections).forEach(section => {
          if (section) section.classList.add('hidden');
        });

        // Clean up
        document.body.removeChild(iframe);
        document.body.removeChild(iframeForm);

        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        }
      }, 2000); // 2 second delay to allow submission to complete
    });
  }
});
