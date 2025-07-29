const scriptURL = 'https://script.google.com/macros/s/AKfycbyBKsURnjHmLjxKJPdsEXod-_gpFCX_6r6HowZonUCBWVe8eoTXu1BWd2lZt-5MsN_6WQ/exec';

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
    userTypeSelect.addEventListener('change', function() {
      const type = this.value;
      Object.entries(formSections).forEach(([key, section]) => {
        section.classList.toggle('hidden', key !== type);
      });
    });
  }

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

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
