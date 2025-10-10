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
const quizQuestions = [
  // Theme Preference / Usage
  { id: "q1", text: "Which mode do you prefer personally?", options: ["Dark", "Light"] },
  { id: "q2", text: "Do you use dark mode mostly at night or day?", options: ["Night", "Day", "Both"] },
  { id: "q3", text: "Which mode feels easier on your eyes?", options: ["Dark", "Light", "No difference"] },
  { id: "q4", text: "How often do you switch between modes?", options: ["Never", "Rarely", "Sometimes", "Frequently"] },
  { id: "q5", text: "Do you have a default mode across apps?", options: ["Yes", "No"] },
  
  // Reading Habits / Engagement
  { id: "q6", text: "How long did you spend reading this article?", options: ["<1 min", "1-3 min", "3-5 min", "5+ min"] },
  { id: "q7", text: "Did you read the article fully or skim?", options: ["Fully", "Skimmed"] },
  { id: "q8", text: "How often do you read articles in dark mode?", options: ["Never", "Rarely", "Sometimes", "Often"] },
  { id: "q9", text: "How often do you read articles in light mode?", options: ["Never", "Rarely", "Sometimes", "Often"] },
  
  // Readability & Comfort
  { id: "q10", text: "How comfortable was reading in your chosen mode?", options: ["Very comfortable", "Somewhat comfortable", "Not comfortable"] },
  { id: "q11", text: "Did you experience eye strain while reading?", options: ["Yes", "No"] },
  { id: "q12", text: "Was the font size and contrast appropriate?", options: ["Yes", "No"] },
  { id: "q13", text: "Did images display clearly in your chosen mode?", options: ["Yes", "No"] },
  
  // Mood & Psychological Impact
  { id: "q14", text: "Did the mode affect your focus while reading?", options: ["Yes", "No"] },
  { id: "q15", text: "Did the mode influence your mood or enjoyment?", options: ["Positive", "Neutral", "Negative"] },
  { id: "q16", text: "Which mode makes you feel more productive?", options: ["Dark", "Light", "Both"] }
];

let currentQuestion = 0;
let quizAnswers = {};

function displayQuestion() {
  const container = document.getElementById("quiz-container");
  const q = quizQuestions[currentQuestion];
  
  let html = `<p><strong>Question ${currentQuestion + 1} of ${quizQuestions.length}: ${q.text}</strong></p>`;
  q.options.forEach(opt => {
    html += `<button onclick="answerQuestion('${q.id}', '${opt}')" style="margin: 0.25rem; padding: 0.5rem 1rem;">${opt}</button> `;
  });
  
  container.innerHTML = html;
}

function answerQuestion(questionId, answer) {
  quizAnswers[questionId] = answer;
  localStorage.setItem('quizAnswers', JSON.stringify(quizAnswers));
  
  gtag('event', 'quiz_answer', {
    event_category: 'engagement',
    question: questionId,
    answer: answer
  });
  console.log(`GA Event: quiz_answer - ${questionId}: ${answer}`);
  
  currentQuestion++;
  if (currentQuestion < quizQuestions.length) {
    displayQuestion();
  } else {
    document.getElementById("quiz-container").innerHTML = "<p>✅ Quiz completed! Thank you for your responses.</p>";
    document.getElementById("quiz-feedback").textContent = "All questions answered!";
    console.log('Quiz answers stored:', quizAnswers);
  }
}

// SCROLL TRACKING
let articleReadTracked = false;
let scrollDepthTracked = {};
let articleStartTime = null;
window.addEventListener("scroll", function() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollTop = window.scrollY;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.getElementById("scroll-progress-bar").style.width = scrollPercent + "%";
  
  // Track scroll depth milestones
  const thresholds = [25, 50, 75, 100];
  thresholds.forEach(depth => {
    if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
      scrollDepthTracked[depth] = true;
      gtag('event', 'scroll_depth', {
        event_category: 'engagement',
        depth: depth
      });
      console.log(`GA Event: scroll_depth - ${depth}%`);
    }
  });
  if (!articleStartTime && scrollTop > 100) {
    articleStartTime = Date.now();
  }
  const article = document.getElementById("demo-article");
  if (!article) return;
  
  const rect = article.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  if (!articleReadTracked && rect.bottom <= windowHeight + 50) {
    articleReadTracked = true;
    gtag('event', 'article_read_complete', {
      event_category: 'engagement'
    });
    console.log('GA Event: article_read_complete');

    // Record read duration
    if (articleStartTime) {
      const readDuration = Math.round((Date.now() - articleStartTime) / 1000);
      gtag('event', 'article_read_duration', {
        event_category: 'engagement',
        theme: document.body.getAttribute('data-theme'),
        duration_seconds: readDuration
      });
      console.log('GA Event: article_read_duration', { readDuration });
    }
  }
});

// INIT

let sessionStartTime;

window.addEventListener('load', () => {
  sessionStartTime = Date.now();
});

window.addEventListener('beforeunload', () => {
  const sessionEndTime = Date.now();
  const sessionDuration = Math.round((sessionEndTime - sessionStartTime) / 1000);
  const theme = document.body.getAttribute('data-theme') || 'unknown';
  gtag('event', 'session_duration', {
    event_category: 'engagement',
    theme: theme,
    duration_seconds: sessionDuration
  });
  console.log('GA Event: session_duration', { theme, sessionDuration });
});


document.addEventListener('DOMContentLoaded', () => {
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href
  });
  
  const urlParams = new URLSearchParams(window.location.search);
  const urlTheme = urlParams.get('theme');
  
  const theme = urlTheme || getInitialTheme();
  applyTheme(theme);
  
  gtag('event', 'theme_preference', {
    event_category: 'engagement',
    theme: theme,
    source: urlTheme ? 'landing_selection' : 'auto_detect'
  });
  
  displayQuestion();
  
  document.getElementById("feedback-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const form = e.target;
    const q1 = form.q1.value || "No answer";
    const q2 = form.q2.value || "No answer";
    const q3 = form.q3.value.trim() || "No comment";
    
    gtag('event', 'feedback_submitted', {
      event_category: 'engagement',
      q1: q1,
      q2: q2,
      q3: q3
    });
    console.log('GA Event: feedback_submitted', { q1, q2, q3 });
    
    document.getElementById("feedback-message").textContent = "Thank you for your feedback!";
    form.reset();
  });
});