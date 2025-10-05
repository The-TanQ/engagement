# Theme Engagement Tracker

A comprehensive study tracking user preferences between dark mode and light mode reading experiences.

## Live Demo

Visit: [https://yourusername.github.io/engagement/landing.html](https://yourusername.github.io/engagement/landing.html)

## Features

- **Landing Page**: Users select preferred theme before reading
- **16-Question Survey**: Comprehensive data collection on:
  - Theme preferences and usage patterns
  - Reading habits and engagement
  - Readability and comfort assessment
  - Mood and psychological impact
- **Real-time Analytics**: All interactions tracked via Google Analytics 4
- **Progress Tracking**: Visual scroll progress bar
- **Responsive Design**: Works on all devices

## Analytics Events Tracked

- `landing_theme_selection` - Initial theme choice
- `theme_preference` - Applied theme with source
- `theme_toggle` - Theme switching behavior
- `quiz_answer` - Individual survey responses
- `article_read_complete` - Reading completion
- `feedback_submitted` - Additional feedback
- `page_view` - Page visits

## Setup

1. Replace `G-G29633FSQS` with your Google Analytics 4 measurement ID
2. Deploy to GitHub Pages
3. Set landing.html as your entry point

## Files

- `landing.html` - Theme selection page
- `index.html` - Main article and survey
- `script.js` - Analytics and interaction logic
- `styles.css` - Theme styling