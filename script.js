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
    // Fade out the current fact
    factElement.style.opacity = "0";

    setTimeout(function() {
      factElement.textContent = facts[factIndex];
      factIndex = (factIndex + 1) % facts.length;
      // Fade in the new fact
      factElement.style.opacity = "1";
    }, 500); // Delay matches the fade-out transition
  }

  // Rotate the fact every 4 seconds
  setInterval(updateFact, 4000);
});
