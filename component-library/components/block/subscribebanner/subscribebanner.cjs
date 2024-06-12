const subscribeBannerButton = document.getElementById('subscribebanner_subscribeButton');
const subscribeBanneremailInput = document.getElementById('subscribebanner_emailInput');

subscribeBannerButton.addEventListener('click', () => {
  const email = subscribeBanneremailInput.value;
  console.log("Email:", email); // Log the email value

  // Send the event to outrun.js
  outrun.stream("form_submitted", { email: email });
  console.log("Outrun event streamed"); // Log that the event was sent

  // Redirect to /thank-you
  setTimeout(() => { // Delay the redirect slightly
    window.location.href = '/thank-you';
    console.log("Redirecting to /thank-you"); // Log the redirect
  }, 1000); 
});