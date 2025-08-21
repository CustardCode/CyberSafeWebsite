document.addEventListener("DOMContentLoaded", function() {
  // Array of cyber facts to display
  var facts = [
    "Did you know? Regular password changes improve security.",
    "Cybersecurity tip: Always verify email links before clicking.",
    "Remember: Two-factor authentication adds an extra layer of protection.",
    "Fact: Backing up your data regularly helps prevent data loss.",
    "Tip: Keep your software updated to mitigate vulnerabilities."
  ];

  var factIndex = 0;
  var factElement = document.querySelector("#cyber-facts p");

  // Ensure the element supports fading by setting the transition
  factElement.style.transition = "opacity 0.5s";

  function updateFact() {
    // Fade out current fact
    factElement.style.opacity = "0";

    // After the fade-out transition, update the text then fade in.
    setTimeout(function() {
      factElement.textContent = facts[factIndex];
      factIndex = (factIndex + 1) % facts.length;
      factElement.style.opacity = "1";
    }, 500);
  }

  // Start the rotation every 4 seconds
  setInterval(updateFact, 4000);

  // Toggle light/dark mode on click of #mode-toggle
  var modeToggle = document.getElementById("mode-toggle");
  modeToggle.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
  });
});
