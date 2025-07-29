const scriptURL = 'https://script.google.com/macros/s/AKfycbyQtejDmgBCQqzsz4QuoAswuCeawWXWNXUNEbs3QV2jB4c0899mfFzO1D75Gu3gIw-o/exec';

document.addEventListener('DOMContentLoaded', function() {
  // [Your existing DOMContentLoaded code remains the same until the form submission...]

  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      try {
        // Convert form data to object
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
          // Handle checkbox groups
          if (key === 'reServices') {
            if (!data[key]) data[key] = [];
            data[key].push(value);
          } else {
            data[key] = value;
          }
        });

        // First make an OPTIONS request for CORS preflight
        await fetch(scriptURL, {
          method: 'OPTIONS',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // Then make the actual POST request
        const response = await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors', // Important for Google Apps Script
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        // Since we're using no-cors mode, we can't read the response directly
        // So we'll assume success if we get this far
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
