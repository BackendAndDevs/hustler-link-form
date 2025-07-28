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

      // Create a temporary form for submission
      const tempForm = document.createElement('form');
      tempForm.action = scriptURL;
      tempForm.method = 'POST';
      tempForm.style.display = 'none';
      
      // Create hidden iframe target
      const iframe = document.createElement('iframe');
      iframe.name = 'form-submission-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      tempForm.target = 'form-submission-iframe';

      // Add all form data to the temporary form
      const formData = new FormData(form);
      for (const [name, value] of formData.entries()) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        tempForm.appendChild(input);
      }

      document.body.appendChild(tempForm);
      tempForm.submit();

      // Show success message after short delay
      setTimeout(() => {
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
        document.body.removeChild(tempForm);
        document.body.removeChild(iframe);

        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        }
      }, 1500); // 1.5 second delay to allow submission to complete
    });
  }
});
