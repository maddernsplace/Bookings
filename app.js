const STORAGE_KEY = 'business_jobs_v1';
const form = document.getElementById('jobForm');
const jobsList = document.getElementById('jobsList');
const jobsTitle = document.getElementById('jobsTitle');
const clearFilterBtn = document.getElementById('clearFilter');
const monthLabel = document.getElementById('monthLabel');
const calendarEl = document.getElementById('calendar');
const template = document.getElementById('jobItemTemplate');

let jobs = loadJobs();
let selectedDate = null;
let currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const job = {
    id: crypto.randomUUID(),
    title: data.get('title').trim(),
    date: data.get('date'),
    time: data.get('time'),
    address: data.get('address').trim(),
    notes: data.get('notes').trim()
  };

  jobs.push(job);
  jobs.sort(sortJobs);
  persist();
  form.reset();
  render();
});

document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  renderCalendar();
});

clearFilterBtn.addEventListener('click', () => {
  selectedDate = null;
  render();
});

function render() {
  renderCalendar();
  renderJobs();
}

function renderCalendar() {
  calendarEl.innerHTML = '';
  monthLabel.textContent = currentMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const firstOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startDay = firstOfMonth.getDay();
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - startDay);

  for (let i = 0; i < 42; i++) {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + i);
    const iso = toISODate(day);

    const dayJobs = jobs.filter((j) => j.date === iso);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'day-cell';

    if (day.getMonth() !== currentMonth.getMonth()) cell.classList.add('outside');
    if (selectedDate === iso) cell.classList.add('active');

    cell.innerHTML = `<div class="day-number">${day.getDate()}</div>
      ${dayJobs.length ? `<div class="day-count">${dayJobs.length} job${dayJobs.length > 1 ? 's' : ''}</div>` : ''}`;

    cell.addEventListener('click', () => {
      selectedDate = iso;
      render();
    });

    calendarEl.appendChild(cell);
  }
}

function renderJobs() {
  jobsList.innerHTML = '';
  const filtered = selectedDate ? jobs.filter((j) => j.date === selectedDate) : jobs;
  jobsTitle.textContent = selectedDate ? `Jobs for ${selectedDate}` : 'All Jobs';

  if (!filtered.length) {
    const empty = document.createElement('li');
    empty.className = 'muted';
    empty.textContent = 'No jobs yet.';
    jobsList.appendChild(empty);
    return;
  }

  filtered.forEach((job) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.job-title').textContent = job.title;
    node.querySelector('.job-when').textContent = `${job.date} at ${job.time}`;
    node.querySelector('.job-address').textContent = job.address;
    node.querySelector('.job-notes').textContent = job.notes || '';

    node.querySelector('.nav-btn').addEventListener('click', () => {
      const destination = encodeURIComponent(job.address);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
    });

    node.querySelector('.delete-btn').addEventListener('click', () => {
      jobs = jobs.filter((j) => j.id !== job.id);
      persist();
      render();
    });

    jobsList.appendChild(node);
  });
}

function loadJobs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

function toISODate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function sortJobs(a, b) {
  return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}

render();
