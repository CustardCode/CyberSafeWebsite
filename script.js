document.addEventListener("DOMContentLoaded", function() {
  // Array of cyber facts to display
  var facts = [
    "MFA blocks 99.9% of attacks.",
    "43% of SMBs are targeted by cybercrime.",
    "Regular audits reduce risk by 60%.",
    "95% of breaches are preventable.",
    "Cyber training is a game-changer for security."
  ];

  var factIndex = 0;
  var factElement = document.querySelector("#cyber-facts p");

  // Set up fading transition
  factElement.style.transition = "opacity 0.5s";

  function updateFact() {
    // Fade out
    factElement.style.opacity = "0";

    setTimeout(function() {
      factElement.textContent = facts[factIndex];
      factIndex = (factIndex + 1) % facts.length;
      // Fade in
      factElement.style.opacity = "1";
    }, 500);
  }

  // Start rotation every 4 seconds
  setInterval(updateFact, 4000);
});
