const SUPABASE_URL = "https://gzmupqbqqrpwvpsaghvb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fIHugiH2KXRUhF1uOglFag_atxUybHO";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const STUDENT_USERNAME = 'student';
const STUDENT_PASSWORD = 'student123';

let currentRole = 'admin';

const year2 = [
  ['KMK2333','Expert System Analysis and Design'],
  ['KMK2553','Cognition Tools for Learning'],
  ['KMK2213','Object-Oriented Programming'],
  ['KMK2563','Computational Thinking'],
  ['KMK2363','Instructional Technology Design and Development'],
  ['KMK2533','Fundamentals of Data Mining'],
  ['KMK2383','Narrative and Discourse Analysis'],
  ['KMK2233','Artificial Neural Networks'],
  ['KMK2263','Database Management Systems'],
  ['KMK2473','Computer Graphics']
];

const year3 = [
  ['KMK3393','Web Programming'],
  ['KMK3053','Computational Linguistics'],
  ['KMK3483','Computer Vision'],
  ['KMK3163','Project Management'],
  ['KMK3093','Computational Intelligence'],
  ['KMK3513','Applied Neuroscience for Special Needs'],
  ['KMK3113','Virtual Reality'],
  ['KMK3523','Learning Problems in Inclusive Society'],
  ['KMK3433','Mobile Computing'],
  ['KMK3013','Knowledge-Based Systems']
];

const interests = [
  "I am interested in artificial intelligence, machine learning, and intelligent systems.",
  "I am interested in data analysis, data mining, and database management.",
  "I am interested in web development, mobile applications, and system design.",
  "I am interested in virtual reality, computer graphics, and computer vision technologies.",
  "I am interested in language technology, discourse analysis, and communication-related computing.",
  "I am interested in educational technology, cognitive tools, neuroscience, and inclusive learning support."
];

const subjectMap = {
  KMK2233: ['AI / ML Engineer', 'Artificial Intelligence Applications'],
  KMK2533: ['Data Analyst', 'Data Mining & Analytics'],
  KMK3393: ['Web Developer', 'Web-Based Intelligent Systems'],
  KMK2363: ['Learning Technology Specialist', 'Educational Technology Systems'],
  KMK3113: ['XR / VR Developer', 'Virtual Reality Applications'],
  KMK2263: ['Database Developer', 'Database & Information Systems'],
  KMK3483: ['Computer Vision Engineer', 'Computer Vision Applications'],
  KMK3053: ['NLP / Language Technology Researcher', 'Natural Language Processing'],
  KMK3013: ['AI / Knowledge Engineer', 'Knowledge-Based Systems'],
  KMK3513: ['Inclusive Learning Technology Specialist', 'Inclusive Education Technology'],
  KMK2383: ['Text Analytics Specialist', 'Natural Language Processing'],
  KMK2553: ['Learning Analytics Specialist', 'Educational Technology Systems'],
  KMK2473: ['Graphics Developer', 'Computer Graphics'],
  KMK3163: ['Project Coordinator', 'Project Management'],
  KMK3433: ['Mobile App Developer', 'Mobile Intelligent Applications'],
  KMK3093: ['Computational Intelligence Analyst', 'Artificial Intelligence Applications'],
  KMK2333: ['Knowledge System Developer', 'Knowledge-Based Systems'],
  KMK2213: ['Software Developer', 'Software Engineering Applications'],
  KMK2563: ['Problem Solving Analyst', 'Computational Problem Solving'],
  KMK3523: ['Inclusive Learning Support Specialist', 'Inclusive Education Technology']
};

function setRole(role) {
  currentRole = role;
  document.getElementById('roleAdminBtn').className = 'role-btn' + (role === 'admin' ? ' active-admin' : '');
  document.getElementById('roleStudentBtn').className = 'role-btn' + (role === 'student' ? ' active-student' : '');
}

async function loadData() {
  const { data, error } = await supabaseClient
    .from("career_fyp_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch Error:", error);
    return [];
  }
  return data;
}

// ==========================================
// KOD YANG DIUBAH: Memperbaiki isu JSONB parsing
// ==========================================
async function saveData(entry) {
  // Tukar Array dan Object menjadi Teks String JSON yang sah sebelum dihantar ke kolum jsonb
  const formattedEntry = {
    ...entry,
    selected_subjects: JSON.stringify(entry.selected_subjects),
    interests: JSON.stringify(entry.interests)
  };

  const { data, error } = await supabaseClient
    .from("career_fyp_records")
    .insert([formattedEntry]);

  if (error) {
    console.error("Supabase Error Details:", error.message, error.details, error.hint);
    alert(`Failed to save data.\nError Message: ${error.message}\nHint: ${error.hint}`);
    return false;
  }
  return true;
}

async function deleteRecord(id) {
  if (!confirm("Are you sure you want to delete this record?")) return;
  const { error } = await supabaseClient
    .from("career_fyp_records")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Delete failed: " + error.message);
  } else {
    alert("Record deleted successfully.");
    viewSaved();
    updateSavedCount();
  }
}

async function deleteAllRecords() {
  if (!confirm("CRITICAL WARNING: Are you sure you want to delete ALL records from the database? This cannot be undone.")) return;
  const { error } = await supabaseClient
    .from("career_fyp_records")
    .delete()
    .neq("id", 0); // Memadam semua id yang bukan 0

  if (error) {
    alert("Clear database failed: " + error.message);
  } else {
    alert("All records deleted successfully.");
    viewSaved();
    updateSavedCount();
  }
}

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  const msg = document.getElementById('loginMsg');

  if (currentRole === 'admin' && u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
    initApp('admin');
  } else if (currentRole === 'student' && u === STUDENT_USERNAME && p === STUDENT_PASSWORD) {
    initApp('student');
  } else {
    msg.innerText = 'Invalid username or password for selected role.';
    msg.style.color = 'var(--danger)';
  }
}

function initApp(role) {
  sessionStorage.setItem('careerFypLoggedIn', 'true');
  sessionStorage.setItem('careerFypRole', role);

  document.getElementById('loginPage').classList.add('hide');
  document.getElementById('appPage').classList.remove('hide');

  const badge = document.getElementById('roleBadge');
  badge.innerText = role.toUpperCase();
  badge.className = 'badge ' + (role === 'admin' ? 'active-admin' : 'active-student');

  if (role === 'student') {
    document.getElementById('savedBtn').classList.add('hide');
  } else {
    document.getElementById('savedBtn').classList.remove('hide');
  }

  buildForm();
  updateSavedCount();
}

function logout() {
  sessionStorage.clear();
  document.getElementById('appPage').classList.add('hide');
  document.getElementById('savedPage').classList.add('hide');
  document.getElementById('loginPage').classList.remove('hide');
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginMsg').innerText = '';
}

function buildForm() {
  const y2Box = document.getElementById('year2Box');
  y2Box.innerHTML = year2.map((s, idx) => `
    <label class="subject-item">
      <input type="checkbox" data-subject="${s[0]}" id="y2_${idx}" />
      <span><strong>${s[0]}</strong> - ${s[1]}</span>
    </label>
  `).join('');

  const y3Box = document.getElementById('year3Box');
  y3Box.innerHTML = year3.map((s, idx) => `
    <label class="subject-item">
      <input type="checkbox" data-subject="${s[0]}" id="y3_${idx}" />
      <span><strong>${s[0]}</strong> - ${s[1]}</span>
    </label>
  `).join('');

  const iBox = document.getElementById('interestBox');
  iBox.innerHTML = interests.map((text, idx) => `
    <div class="scale-card">
      <div class="scale-title"><strong>Statement ${idx + 1}:</strong> ${text}</div>
      <div class="scale-row">
        <span class="left">Don't like</span>
        ${[1, 2, 3, 4, 5].map(num => `
          <label class="num">
            <input type="radio" name="interest_${idx}" value="${num}" ${num === 3 ? 'checked' : ''} />
            <div>${num}</div>
          </label>
        `).join('')}
        <span class="right">Love it</span>
      </div>
    </div>
  `).join('');
}

function fillSample() {
  document.getElementById('matricNumber').value = '10' + Math.floor(100 + Math.random() * 900);
  document.getElementById('yearOfStudy').value = Math.random() > 0.5 ? 'Year 2' : 'Year 3';

  year2.forEach((_, idx) => {
    document.getElementById(`y2_${idx}`).checked = Math.random() > 0.4;
  });
  year3.forEach((_, idx) => {
    document.getElementById(`y3_${idx}`).checked = Math.random() > 0.6;
  });

  interests.forEach((_, idx) => {
    const rands = [1, 2, 3, 4, 5];
    const picked = rands[Math.floor(Math.random() * rands.length)];
    const radios = document.getElementsByName(`interest_${idx}`);
    radios.forEach(r => {
      if (parseInt(r.value) === picked) r.checked = true;
    });
  });
}

function resetForm() {
  document.getElementById('mainForm').reset();
  buildForm();
}

function getValues() {
  const selected = [...document.querySelectorAll('input[data-subject]:checked')].map(x => x.dataset.subject);
  const scores = {};
  interests.forEach((text, index) => {
    const checked = document.querySelector(`input[name="interest_${index}"]:checked`);
    scores['interest_' + index] = checked ? Number(checked.value) : 3;
  });
  return { selected, scores };
}

function renderPills(selected) {
  const box = document.getElementById('selectedPills');
  box.innerHTML = selected.map(s => `<span class="pill-badge">${s}</span>`).join('') || 'None selected';
}

function scoreRecommend(selected, scores) {
  const career = {};
  const fyp = {};

  Object.values(subjectMap).forEach(([careerName, fypName]) => {
    career[careerName] = 0;
    fyp[fypName] = 0;
  });

  selected.forEach(code => {
    if (subjectMap[code]) {
      career[subjectMap[code][0]] += 3;
      fyp[subjectMap[code][1]] += 3;
    }
  });

  if (scores.interest_0 >= 4) { career['AI / ML Engineer'] += 4; career['AI / Knowledge Engineer'] += 3; career['Computational Intelligence Analyst'] += 4; fyp['Artificial Intelligence Applications'] += 4; fyp['Knowledge-Based Systems'] += 3; }
  if (scores.interest_1 >= 4) { career['Data Analyst'] += 4; career['Database Developer'] += 3; fyp['Data Mining & Analytics'] += 4; fyp['Database & Information Systems'] += 3; }
  if (scores.interest_2 >= 4) { career['Web Developer'] += 4; career['Mobile App Developer'] += 3; fyp['Web-Based Intelligent Systems'] += 4; fyp['Mobile Intelligent Applications'] += 3; }
  if (scores.interest_3 >= 4) { career['XR / VR Developer'] += 4; career['Computer Vision Engineer'] += 3; career['Graphics Developer'] += 3; fyp['Virtual Reality Applications'] += 4; fyp['Computer Vision Applications'] += 3; fyp['Computer Graphics'] += 3; }
  if (scores.interest_4 >= 4) { career['NLP / Language Technology Researcher'] += 4; career['Text Analytics Specialist'] += 3; fyp['Natural Language Processing'] += 4; }
  if (scores.interest_5 >= 4) { career['Learning Technology Specialist'] += 4; career['Inclusive Learning Technology Specialist'] += 3; career['Inclusive Learning Support Specialist'] += 3; fyp['Educational Technology Systems'] += 4; fyp['Inclusive Education Technology'] += 3; }

  let topCareer = 'General Software Engineer';
  let maxC = -1;
  Object.keys(career).forEach(k => {
    if (career[k] > maxC) { maxC = career[k]; topCareer = k; }
  });

  let topFyp = 'General Intelligent System Development';
  let maxF = -1;
  Object.keys(fyp).forEach(k => {
    if (fyp[k] > maxF) { maxF = fyp[k]; topFyp = k; }
  });

  let baseConf = 40 + (maxC * 2) + (maxF * 2);
  if (baseConf > 98) baseConf = 98;
  if (baseConf < 45) baseConf = 45;

  return { career: topCareer, fyp: topFyp, confidence: baseConf };
}

async function generateAndSave() {
  const m = document.getElementById('matricNumber').value.trim();
  if (!m) {
    alert('Please enter your matric number.');
    return;
  }

  const { selected, scores } = getValues();
  renderPills(selected);

  const rec = scoreRecommend(selected, scores);

  const entry = {
    role: sessionStorage.getItem('careerFypRole') || 'student',
    matric_number: m,
    year_of_study: document.getElementById('yearOfStudy').value,
    selected_subjects: selected,
    interests: scores,
    career: rec.career,
    fyp: rec.fyp,
    confidence: rec.confidence
  };

  const ok = await saveData(entry);

  const resText = document.getElementById('resultText');
  if (ok) {
    resText.innerHTML = `
      <div style="color:green; font-weight:bold; margin-bottom:8px;">✓ Saved successfully to Supabase database.</div>
      <table style="width:100%; border-collapse:collapse; background:#f9f9f9; padding:10px; border-radius:8px;">
        <tr><td style="padding:4px 0;"><strong>Recommended Career:</strong></td><td style="color:var(--primary); font-weight:bold;">${rec.career}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Recommended FYP Topic:</strong></td><td style="color:#0f6c78; font-weight:bold;">${rec.fyp}</td></tr>
        <tr><td style="padding:4px 0;"><strong>Confidence Match Rate:</strong></td><td><span class="badge" style="background:var(--primary-soft); color:var(--primary); font-weight:bold;">${rec.confidence}%</span></td></tr>
      </table>
    `;
    updateSavedCount();
  } else {
    resText.innerHTML = `<span style="color:var(--danger)">Failed to save recommendation. See alert error details.</span>`;
  }
}

async function updateSavedCount() {
  const data = await loadData();
  const el = document.getElementById('savedCount');
  if (el) el.innerText = `${data.length} records`;
}

async function viewSaved() {
  const data = await loadData();
  const rows = data.map(r => {
    let t = '';
    try { t = new Date(r.created_at).toLocaleString(); } catch (e) { t = r.created_at; }
    
    // KOD YANG DIUBAH: Mengendalikan pembacaan semula data jenis String JSON atau Array asal
    let displaySubjects = '';
    if (r.selected_subjects) {
      if (typeof r.selected_subjects === 'string') {
        try {
          const parsed = JSON.parse(r.selected_subjects);
          displaySubjects = Array.isArray(parsed) ? parsed.join(', ') : r.selected_subjects;
        } catch(e) {
          displaySubjects = r.selected_subjects;
        }
      } else if (Array.isArray(r.selected_subjects)) {
        displaySubjects = r.selected_subjects.join(', ');
      }
    }

    return `
      <tr>
        <td>${t}</td>
        <td><span class="badge ${r.role === 'admin' ? 'active-admin' : 'active-student'}">${r.role}</span></td>
        <td><strong>${r.matric_number || '-'}</strong></td>
        <td>${r.year_of_study || '-'}</td>
        <td class="small-text">${displaySubjects || 'None'}</td>
        <td><strong>${r.career}</strong></td>
        <td>${r.fyp}</td>
        <td><span class="pill-badge" style="background:var(--primary-soft); color:var(--primary);">${r.confidence}%</span></td>
        <td>
          <button class="delete-btn" onclick="deleteRecord(${r.id})">Delete</button>
        </td>
      </tr>
    `;
  }).join('');

  const box = document.getElementById('savedPage');
  box.innerHTML = `
    <div class="top">
      <h2>Saved Database Records (Supabase)</h2>
      <div class="action-row">
        <button class="btn-danger" onclick="deleteAllRecords()">Delete All Records</button>
        <button class="btn2" onclick="hideSaved()">Close Window</button>
      </div>
    </div>
    <div class="tablewrap">
      <table>
        <thead>
          <tr>
            <th>Time Triggered</th>
            <th>Logged Role</th>
            <th>Matric No</th>
            <th>Year</th>
            <th>Subjects Taken</th>
            <th>Generated Career Idea</th>
            <th>Recommended FYP Project</th>
            <th>Match</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length > 0 ? rows : '<tr><td colspan="9" style="text-align:center; padding:20px; color:#666;">No records found in database.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
  box.classList.remove('hide');
}

function hideSaved() {
  document.getElementById('savedPage').classList.add('hide');
}

window.onload = function() {
  const loggedIn = sessionStorage.getItem('careerFypLoggedIn');
  const role = sessionStorage.getItem('careerFypRole');

  if (loggedIn === 'true' && role) {
    initApp(role);
  } else {
    logout();
  }
};
