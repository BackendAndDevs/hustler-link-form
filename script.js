const scriptURL = 'https://script.google.com/macros/s/AKfycbxoLiXSF3eh7WxtvoCeoy26s8dmtjhzUHXKd28J47UHawKMYLWVF_Gmwi9UUNmlou7o/exec';

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
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      try {
        const formData = new FormData(form);
        
        // Add timestamp for debugging
        formData.append('submissionTime', new Date().toISOString());
        
        const response = await fetch(scriptURL, {
          method: 'POST',
          body: formData,
          redirect: 'follow'
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.text();
        console.log('Success:', result);
        
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
      } catch (error) {
        console.error('Error:', error);
        if (status) {
          status.innerHTML = `
            <div class="alert-message alert-error">
              <strong>Error!</strong> ${error.message || 'Submission failed'}
            </div>
          `;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        }
      }
    });
  }
});
