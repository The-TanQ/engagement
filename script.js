
function getInitialTheme() {
  const stored = localStorage.getItem('theme');
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  gtag('event', 'theme_toggle', {
    event_category: 'engagement',
    theme: newTheme
  });
  console.log('GA Event: theme_toggle', { theme: newTheme });
}

// QUIZ
function submitQuiz(choice) {
  alert("You chose: " + choice);
  gtag('event', 'quiz_answer', {
    event_category: 'engagement',
    answer: choice
  });
  console.log('GA Event: quiz_answer', { answer: choice });
}

// FEEDBACK
function sendFeedback(e) {
  e.preventDefault();
  const feedback = document.getElementById("feedbackText").value;
  if (feedback.trim() !== "") {
    alert("Thanks for your feedback!");
    gtag('event', 'feedback_submitted', {
      event_category: 'engagement',
      feedback_length: feedback.length
    });
    console.log("GA Event: feedback_submitted", { feedback_length: feedback.length });
    document.getElementById("feedbackText").value = "";
  }
}

// SCROLL TRACKING
let scrollCompleted = false;
document.addEventListener('DOMContentLoaded', () => {
  const article = document.getElementById("article");
  article.addEventListener("scroll", () => {
    if (!scrollCompleted && article.scrollTop + article.clientHeight >= article.scrollHeight - 10) {
      scrollCompleted = true;
      gtag('event', 'article_read_complete', {
        event_category: 'engagement',
        section: 'demo_article'
      });
      console.log('GA Event: article_read_complete', { section: 'demo_article' });
    }
  });

  // INIT THEME
  const theme = getInitialTheme();
  applyTheme(theme);
  gtag('event', 'theme_preference', {
    event_category: 'engagement',
    theme: theme
  });
  console.log('GA Event: theme_preference', { theme: theme });
});