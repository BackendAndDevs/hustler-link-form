
const scriptURL = 'https://script.google.com/macros/s/AKfycbzt5q5HORvhEW15w4-VCRHaBSepCzm3jc6aXNJCK3WwgPzYKKiNChy9FfL7bkBpVnL7/exec';

document.getElementById('userForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const status = document.getElementById('status');

  fetch(scriptURL, { method: 'POST', body: data })
    .then(response => {
      status.textContent = "✅ Submitted successfully!";
      form.reset();
      document.getElementById("jobSeekerFields").classList.add("hidden");
      document.getElementById("employerFields").classList.add("hidden");
    })
    .catch(error => {
      status.textContent = "❌ Submission failed.";
      console.error('Error!', error.message);
    });
});
