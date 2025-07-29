const scriptURL = 'https://script.google.com/macros/s/AKfycbyBKsURnjHmLjxKJPdsEXod-_gpFCX_6r6HowZonUCBWVe8eoTXu1BWd2lZt-5MsN_6WQ/exec';

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
    // Convert form data to object with proper field names
    const formData = new FormData(form);
    const data = {};
    
    // Handle all fields including checkboxes
    formData.forEach((value, key) => {
      // Handle checkbox groups
      if (key === 'reServices') {
        if (!data[key]) data[key] = [];
        data[key].push(value);
      } 
      // Handle all other fields
      else {
        data[key] = value;
      }
    });

    // Send data to Google Apps Script
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (result.status === "success") {
      status.innerHTML = `
        <div class="alert-message alert-success">
          <strong>Success!</strong> Your registration has been submitted.
        </div>
      `;
      status.scrollIntoView({ behavior: 'smooth' });
      
      // Reset form
      form.reset();
      Object.values(formSections).forEach(section => {
        if (section) section.classList.add('hidden');
      });
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (error) {
    status.innerHTML = `
      <div class="alert-message alert-error">
        <strong>Error!</strong> ${error.message}
      </div>
    `;
    status.scrollIntoView({ behavior: 'smooth' });
    console.error('Error!', error.message);
  } finally {
    // Re-enable submit button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  }
});
  }
});
