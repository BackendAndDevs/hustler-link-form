const scriptURL = 'https://script.google.com/macros/s/AKfycbyBKsURnjHmLjxKJPdsEXod-_gpFCX_6r6HowZonUCBWVe8eoTXu1BWd2lZt-5MsN_6WQ/exec';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  const status = document.getElementById('status');
  const submitBtn = document.getElementById('submitBtn');
  const userTypeSelect = document.getElementById('userType');

  const formSections = {
    'Job Seeker': {
      element: document.getElementById('jobSeekerFields'),
      requiredFields: ['name', 'phone', 'location', 'profession', 'workType']
    },
    'Employer': {
      element: document.getElementById('employerFields'),
      requiredFields: ['employerName', 'contactPerson', 'employerPhone', 'employerLocation', 'workerProfession', 'jobDescription']
    },
    'Real Estate': {
      element: document.getElementById('realEstateFields'),
      requiredFields: ['reName', 'rePhone', 'reLocation']
    }
  };

  // Show relevant fields based on selected user type
  if (userTypeSelect) {
    userTypeSelect.addEventListener('change', function() {
      const type = this.value;
      
      // Hide all sections first
      Object.values(formSections).forEach(section => {
        section.element.classList.add('hidden');
      });
      
      // Show selected section
      if (type && formSections[type]) {
        formSections[type].element.classList.remove('hidden');
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Clear previous validation
      form.querySelectorAll('.is-invalid').forEach(el => {
        el.classList.remove('is-invalid');
      });

      // Validate form
      const currentType = userTypeSelect.value;
      const currentSection = formSections[currentType];
      let isValid = true;
      
      if (currentSection) {
        currentSection.requiredFields.forEach(fieldName => {
          const input = form.querySelector(`[name="${fieldName}"]`);
          if (input && !input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
          }
        });
      }
      
      if (!isValid) {
        status.innerHTML = `
          <div class="alert-message alert-error">
            <strong>Error:</strong> Please fill in all required fields
          </div>
        `;
        status.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Disable button during submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      // Collect all form data
      const formData = new FormData(form);
      const data = {
        userType: formData.get('userType') || '',
        // Job Seeker fields
        name: formData.get('name') || '',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        age: formData.get('age') || '',
        gender: formData.get('gender') || '',
        location: formData.get('location') || '',
        profession: formData.get('profession') || '',
        workType: formData.get('workType') || '',
        language: formData.get('language') || '',
        // Employer fields
        employerName: formData.get('employerName') || '',
        contactPerson: formData.get('contactPerson') || '',
        employerPhone: formData.get('employerPhone') || '',
        employerEmail: formData.get('employerEmail') || '',
        employerLocation: formData.get('employerLocation') || '',
        workerProfession: formData.get('workerProfession') || '',
        jobDescription: formData.get('jobDescription') || '',
        jobDuration: formData.get('jobDuration') || '',
        payRange: formData.get('payRange') || '',
        startDate: formData.get('startDate') || '',
        requirements: formData.get('requirements') || '',
        // Real Estate fields
        reName: formData.get('reName') || '',
        rePhone: formData.get('rePhone') || '',
        reEmail: formData.get('reEmail') || '',
        reCompany: formData.get('reCompany') || '',
        reLocation: formData.get('reLocation') || '',
        reSpecialization: formData.get('reSpecialization') || '',
        reLicense: formData.get('reLicense') || '',
        reServices: formData.getAll('reServices') || [],
        rePriceRange: formData.get('rePriceRange') || '',
        reLanguages: formData.get('reLanguages') || '',
        reBio: formData.get('reBio') || ''
      };

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
          form.reset();
          Object.values(formSections).forEach(section => {
            section.element.classList.add('hidden');
          });
        } else {
          throw new Error(result.message || "Unknown error");
        }
      } catch (error) {
        console.error("Submission failed:", error);
        status.innerHTML = `
          <div class="alert-message alert-error">
            <strong>Error:</strong> ${error.message || "Failed to submit form. Please try again."}
          </div>
        `;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        }
        status.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
