const KEY = 'taskmanager.v1', THEME = 'taskmanager.theme';
const COLS = [['todo', 'To Do'], ['progress', 'In Progress'], ['done', 'Done']];
const CATS = ['Work', 'Project', 'Assignment', 'Research', 'Other'];
const PRIS = ['Low', 'Normal', 'High'];
const $ = s => document.querySelector(s);

const seed = () => [
  { id: 1, title: 'Server analytics summary', cat: 'Work', pri: 'Normal', status: 'todo', due: '2026-10-30', files: 1, people: 0 },
  { id: 2, title: 'Build a caching proxy', cat: 'Project', pri: 'Normal', status: 'todo', due: '2026-12-29', files: 0, people: 0 },
  { id: 3, title: 'Data Structures: Queues and Stacks', cat: 'Assignment', pri: 'Normal', status: 'todo', due: '2026-11-03', files: 1, people: 0 },
  { id: 4, title: 'Review Data Structure Ch II', cat: 'Research', pri: 'Low', status: 'progress', due: '2026-10-05', files: 0, people: 1 },
  { id: 5, title: 'Spanish III Homework', cat: 'Assignment', pri: 'Normal', status: 'progress', due: '2026-10-21', files: 0, people: 0 },
  { id: 6, title: 'Building a Compiler in Golang', cat: 'Project', pri: 'Normal', status: 'progress', due: '2027-02-16', files: 1, people: 0, fav: true },
  { id: 7, title: 'Review Digital System Design Ch I', cat: 'Other', pri: 'High', status: 'done', due: '2026-10-06', files: 1, people: 2 },
  { id: 8, title: 'CRUD Notes Endpoints', cat: 'Project', pri: 'High', status: 'done', due: '2026-11-06', files: 3, people: 3, fav: true }
];

function load() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(v)) return v; } catch (e) {}
  return seed();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) {} }

let tasks = load();
let filters = { q: '', cat: '', pri: '', fav: false, arch: false };
let menuId = null, editId = null, dragId = null;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = d => d ? new Date(d + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : '';
const isLate = t => t.due && t.status !== 'done' && new Date(t.due + 'T23:59') < new Date();

function visible(t) {
  const f = filters;
  if (!f.arch && t.archived) return false;
  if (f.q && !t.title.toLowerCase().includes(f.q.toLowerCase())) return false;
  if (f.cat && t.cat !== f.cat) return false;
  if (f.pri && t.pri !== f.pri) return false;
  if (f.fav && !t.fav) return false;
  return true;
}

function cardHTML(t) {
  const people = Array.from({ length: t.people || 0 }, () => '<i>☻</i>').join('');
  return `<article class="card ${t.status === 'done' ? 'done' : ''} ${t.archived ? 'archived' : ''}" draggable="true" data-id="${t.id}">
    <div class="top">
      <span class="chip ${esc(t.cat)}">${esc(t.cat)}</span>
      <span class="pri ${esc(t.pri)}">${esc(t.pri)}</span>
      ${t.fav ? '<span class="star" title="Favorite">★</span><button class="more" aria-label="Task actions">···</button>' : '<button class="more" style="margin-left:auto" aria-label="Task actions">···</button>'}
    </div>
    <h3 class="title">${esc(t.title)}${t.archived ? ' (archived)' : ''}</h3>
    <div class="meta">
      ${t.due ? `<span class="${isLate(t) ? 'late' : ''}">🕓 ${fmt(t.due)}</span>` : ''}
      ${t.files ? `<span>📎 ${t.files}</span>` : ''}
      <span class="people">${people}</span>
    </div>
  </article>`;
}

function render() {
  $('#board').innerHTML = COLS.map(([id, label]) => {
    const all = tasks.filter(t => t.status === id && visible(t));
    return `<section class="col" data-col="${id}">
      <h2>${label} (${all.length})</h2>
      <div class="cards">${all.map(cardHTML).join('') || '<p class="empty">No tasks here.</p>'}</div>
      <button class="add" data-add="${id}">+ &nbsp;Add a task</button>
    </section>`;
  }).join('');
}

/* ---- board interactions ---- */
$('#board').addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) return openDialog(null, add.dataset.add);
  const more = e.target.closest('.more');
  if (more) {
    e.stopPropagation();
    menuId = +more.closest('.card').dataset.id;
    openMenu(more);
  }
});

function openMenu(btn) {
  const t = tasks.find(t => t.id === menuId), m = $('#menu');
  m.querySelector('[data-a=done]').textContent = t.status === 'done' ? '↺ Mark as To Do' : '✓ Mark as Done';
  m.querySelector('[data-a=fav]').textContent = t.fav ? '★ Remove from favorites' : '☆ Add to favorites';
  m.querySelector('[data-a=arch]').textContent = t.archived ? '▤ Unarchive' : '▤ Archive';
  m.hidden = false;
  const r = btn.getBoundingClientRect();
  m.style.top = Math.min(r.bottom + 6, innerHeight - m.offsetHeight - 8) + 'px';
  m.style.left = Math.max(8, Math.min(r.right - m.offsetWidth, innerWidth - m.offsetWidth - 8)) + 'px';
}
const closeMenu = () => { $('#menu').hidden = true; };
document.addEventListener('click', e => {
  if (!e.target.closest('#menu')) closeMenu();
  if (!e.target.closest('.pop-wrap')) $('#filterPanel').hidden = true;
});
addEventListener('scroll', closeMenu, true);

$('#menu').addEventListener('click', e => {
  const a = e.target.closest('button')?.dataset.a;
  const t = tasks.find(t => t.id === menuId);
  if (!a || !t) return;
  if (a === 'edit') openDialog(t);
  if (a === 'done') t.status = t.status === 'done' ? 'todo' : 'done';
  if (a === 'fav') t.fav = !t.fav;
  if (a === 'arch') t.archived = !t.archived;
  if (a === 'del' && confirm(`Delete "${t.title}"?`)) tasks = tasks.filter(x => x !== t);
  closeMenu(); save(); render();
});

/* ---- drag & drop ---- */
const board = $('#board');
board.addEventListener('dragstart', e => {
  const c = e.target.closest('.card'); if (!c) return;
  dragId = +c.dataset.id; c.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragId);
});
board.addEventListener('dragend', () => { dragId = null; render(); });
board.addEventListener('dragover', e => {
  const col = e.target.closest('.col'); if (!col || dragId == null) return;
  e.preventDefault();
  document.querySelectorAll('.col.over').forEach(c => c !== col && c.classList.remove('over'));
  col.classList.add('over');
});
board.addEventListener('drop', e => {
  const col = e.target.closest('.col'); if (!col || dragId == null) return;
  e.preventDefault();
  const t = tasks.find(t => t.id === dragId); if (!t) return;
  t.status = col.dataset.col;
  const over = e.target.closest('.card');
  tasks = tasks.filter(x => x !== t);
  const idx = over ? tasks.findIndex(x => x.id === +over.dataset.id) : -1;
  idx >= 0 ? tasks.splice(idx, 0, t) : tasks.push(t);
  dragId = null; save(); render();
});

/* ---- add / edit dialog ---- */
const dlg = $('#dlg'), form = $('#form');
const opts = (arr, withAll) => (withAll ? '<option value="">All</option>' : '') + arr.map(v => `<option>${v}</option>`).join('');
form.cat.innerHTML = opts(CATS); form.pri.innerHTML = opts(PRIS);
form.status.innerHTML = COLS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
$('#fCat').innerHTML = opts(CATS, true); $('#fPri').innerHTML = opts(PRIS, true);

function openDialog(t, status = 'todo') {
  editId = t ? t.id : null;
  $('#dlgTitle').textContent = t ? 'Edit task' : 'New task';
  form.title.value = t?.title || '';
  form.cat.value = t?.cat || 'Work';
  form.pri.value = t?.pri || 'Normal';
  form.status.value = t?.status || status;
  form.due.value = t?.due || '';
  form.files.value = t?.files || 0;
  form.people.value = t?.people || 0;
  dlg.showModal(); form.title.focus();
}
$('#addBtn').addEventListener('click', () => openDialog());
$('#cancel').addEventListener('click', () => dlg.close());
form.addEventListener('submit', () => {
  const data = {
    title: form.title.value.trim(), cat: form.cat.value, pri: form.pri.value, status: form.status.value,
    due: form.due.value, files: +form.files.value || 0, people: Math.min(3, +form.people.value || 0)
  };
  if (!data.title) return;
  const t = tasks.find(t => t.id === editId);
  if (t) Object.assign(t, data);
  else tasks.push({ id: Date.now(), ...data });
  save(); render();
});

/* ---- search, filter, theme ---- */
$('#q').addEventListener('input', e => { filters.q = e.target.value; render(); });
addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#q').focus(); }
  if (e.key === 'Escape') { closeMenu(); $('#filterPanel').hidden = true; }
});
$('#filterBtn').addEventListener('click', () => { const p = $('#filterPanel'); p.hidden = !p.hidden; });
const syncFilters = () => {
  filters.cat = $('#fCat').value; filters.pri = $('#fPri').value;
  filters.fav = $('#fFav').checked; filters.arch = $('#fArch').checked;
  $('#filterBtn').textContent = '⚙ Filter' + (filters.cat || filters.pri || filters.fav || filters.arch ? ' •' : '');
  render();
};
['#fCat', '#fPri', '#fFav', '#fArch'].forEach(s => $(s).addEventListener('change', syncFilters));
$('#fReset').addEventListener('click', () => {
  $('#fCat').value = ''; $('#fPri').value = ''; $('#fFav').checked = false; $('#fArch').checked = false; syncFilters();
});

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#theme').textContent = t === 'dark' ? '☀' : '☾';
  try { localStorage.setItem(THEME, t); } catch (e) {}
}
let saved = null; try { saved = localStorage.getItem(THEME); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
$('#theme').addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

render();