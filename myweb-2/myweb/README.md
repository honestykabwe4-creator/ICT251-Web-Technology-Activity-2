# My Student Portfolio (ICT251 Activity 3)

Interactive personal website for Mulungushi University ICT251 Web Technologies. Built with plain HTML5, CSS and JavaScript (no build step).

**Live site:** https://YOUR-SITE.onrender.com

## Structure
index.html · css/styles.css · js/script.js · images/ · videos/ (audio and video)

## JavaScript features (all in js/script.js)
1. **Contact form validation and preview (compulsory)** – rejects empty or spaces-only name/message and badly formatted email, shows errors beside the fields, then shows a local preview. Uses `preventDefault()` and `textContent`. No message is sent.
2. **Theme switch** – light/dark button in the navigation; choice is remembered.
3. **Gallery viewer** – Previous/Next buttons change the photo and caption; buttons disable at the first and last photo.
4. **Project search and filter** – filter by HTML/CSS/JavaScript, search by keyword, Reset button and a "no match" message.

Bonus: mobile hamburger menu and expandable project details.

## How to test
- Submit the form empty, with spaces only, and with `abc@` as email (all rejected); then with valid data (preview appears).
- Toggle the theme; press Next until the last photo; filter projects and search for `zzz`; press Reset.
- Resize to about 375 px and check there is no sideways scrolling; play and pause the video and audio.

## Sources
Photos and recordings were made by me. Fonts: Google Fonts (Inter, Sora). Learning link: MDN Web Docs.
