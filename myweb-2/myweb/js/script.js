'use strict';
/* ICT251 Activity 3 - interactive features
   1. Contact form validation and preview (compulsory)
   2. Theme switch   3. Gallery viewer (Previous/Next)   4. Project search and filter
   Bonus: mobile navigation menu, expandable project details */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Safe wrappers: saving preferences is optional, so failures are ignored */
function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function save(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ } }

/* ---------- Feature 2: theme switch ---------- */
const themeBtn = $('#theme');
// Applies "light" or "dark" to the page and updates the button state
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.setAttribute('aria-pressed', theme === 'dark');
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
setTheme(load('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
  save('theme', next);
});

/* ---------- Bonus: mobile navigation ---------- */
const burger = $('#burger'), menu = $('#menu');
// Opens or closes the menu and keeps aria-expanded in sync
function toggleMenu(open) {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  burger.textContent = open ? '✕' : '☰';
}
burger.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
$$('#menu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

/* ---------- Feature 3: gallery viewer ---------- */
const photos = $$('#viewer figure');
let current = 0;
const bar = document.createElement('div');
bar.className = 'viewer-bar';
bar.innerHTML = '<button type="button" id="prev">Previous</button><span id="count" role="status"></span><button type="button" id="next">Next</button>';
$('#viewer').appendChild(bar);
const prevBtn = $('#prev'), nextBtn = $('#next'), countEl = $('#count');

// Shows photo number i (with its caption) and disables buttons at the first/last photo
function showPhoto(i) {
  current = Math.min(Math.max(i, 0), photos.length - 1);
  photos.forEach((fig, n) => { fig.hidden = n !== current; });
  countEl.textContent = 'Photo ' + (current + 1) + ' of ' + photos.length;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === photos.length - 1;
}
prevBtn.addEventListener('click', () => showPhoto(current - 1));
nextBtn.addEventListener('click', () => showPhoto(current + 1));
showPhoto(0);

/* ---------- Feature 4: project search and filter ---------- */
const cards = $$('#projectList .card');
const chips = $$('.chip[data-tag]');
const searchBox = $('#projSearch'), projMsg = $('#projMsg');
let activeTag = 'all';

// Shows only cards that match the selected skill AND the search text
function filterProjects() {
  const q = searchBox.value.trim().toLowerCase();
  let shown = 0;
  cards.forEach(card => {
    const tagOk = activeTag === 'all' || card.dataset.tag === activeTag;
    const textOk = card.textContent.toLowerCase().includes(q);
    card.hidden = !(tagOk && textOk);
    if (!card.hidden) shown++;
  });
  projMsg.textContent = shown === 0
    ? 'No projects match your search. Try a different word or press Reset.'
    : 'Showing ' + shown + ' of ' + cards.length + ' projects.';
}
chips.forEach(chip => chip.addEventListener('click', () => {
  activeTag = chip.dataset.tag;
  chips.forEach(c => {
    c.classList.toggle('on', c === chip);
    c.setAttribute('aria-pressed', c === chip);
  });
  filterProjects();
}));
searchBox.addEventListener('input', filterProjects);
// Clears the search box and returns to "All"
$('#reset').addEventListener('click', () => {
  searchBox.value = '';
  chips[0].click();
});
filterProjects();

/* ---------- Bonus: expandable project details ---------- */
cards.forEach(card => {
  const btn = $('button', card), details = $('#' + btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !open);
    btn.textContent = open ? 'Show details' : 'Hide details';
    details.hidden = open;
  });
});

/* ---------- Feature 1 (compulsory): contact form validation and preview ---------- */
const form = $('#contactForm'), preview = $('#preview');
const fields = {
  name: { el: $('#name'), err: $('#nameErr') },
  email: { el: $('#email'), err: $('#emailErr') },
  message: { el: $('#message'), err: $('#msgErr') }
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns an error message for a field, or '' when the value is valid
function check(key, value) {
  const v = value.trim();
  if (key === 'name') return v === '' ? 'Please enter your name (spaces alone are not accepted).' : '';
  if (key === 'email') {
    if (v === '') return 'Please enter your email address.';
    return emailPattern.test(v) ? '' : 'Enter an email like name@example.com.';
  }
  return v === '' ? 'Please write a message (spaces alone are not accepted).' : '';
}
// Shows or clears the error text beside a field
function showError(key, text) {
  fields[key].err.textContent = text;
  fields[key].el.classList.toggle('bad', text !== '');
  fields[key].el.setAttribute('aria-invalid', text !== '');
}
Object.keys(fields).forEach(key =>
  fields[key].el.addEventListener('input', () => { if (fields[key].err.textContent) showError(key, check(key, fields[key].el.value)); })
);

// Builds the local preview using textContent so user text is never treated as HTML
function showPreview(data) {
  preview.textContent = '';
  const title = document.createElement('h3');
  title.textContent = 'Your entries were validated in your browser';
  const note = document.createElement('p');
  note.textContent = 'Browser demonstration only. No message was sent or saved.';
  const list = document.createElement('dl');
  [['Name', data.name], ['Email', data.email], ['Topic', data.topic], ['Message', data.message]].forEach(([label, value]) => {
    const dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = label; dd.textContent = value;
    list.append(dt, dd);
  });
  preview.append(title, note, list);
  preview.hidden = false;
  preview.focus();
}

form.addEventListener('submit', event => {
  event.preventDefault(); // keep submission local, no page reload
  let firstBad = null;
  Object.keys(fields).forEach(key => {
    const text = check(key, fields[key].el.value);
    showError(key, text);
    if (text && !firstBad) firstBad = fields[key].el;
  });
  if (firstBad) { preview.hidden = true; firstBad.focus(); return; }
  showPreview({
    name: fields.name.el.value.trim(),
    email: fields.email.el.value.trim(),
    topic: $('#topic').value,
    message: fields.message.el.value.trim()
  });
  form.reset();
});

/* Only one recording plays at a time (no autoplay anywhere) */
$('#vid').addEventListener('play', () => $('#aud').pause());
$('#aud').addEventListener('play', () => $('#vid').pause());
