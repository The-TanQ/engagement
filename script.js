
function getInitialTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function logEvent(name, data = {}) {
  gtag('event', name, data);
  console.log("GA Event:", name, data);
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  logEvent('theme_toggle', { theme: newTheme });
}

// QUIZ
function submitQuiz(choice) {
  alert("You chose: " + choice);
  logEvent('quiz_answer', { answer: choice });
}

// FEEDBACK
function sendFeedback(e) {
  e.preventDefault();
  const feedback = document.getElementById("feedbackText").value;
  if (feedback.trim() !== "") {
    alert("Thanks for your feedback!");
    logEvent('feedback_submitted', { text: feedback });
    document.getElementById("feedbackText").value = "";
  }
}

// SCROLL TRACKING
const article = document.getElementById("article");
article.addEventListener("scroll", () => {
  if (article.scrollTop + article.clientHeight >= article.scrollHeight) {
    logEvent('article_read_complete', { section: "demo_article" });
  }
});

// INIT
document.addEventListener('DOMContentLoaded', () => {
  const theme = getInitialTheme();
  applyTheme(theme);
  logEvent('theme_preference', { theme: theme });
});