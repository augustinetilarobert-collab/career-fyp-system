const SUPABASE_URL = "https://vyqyzzgnrnkmtkrkvxoc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5cXl6emducm5rbXRrcmt2eG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjQ4NTYsImV4cCI6MjA5NDkwMDg1Nn0._bFtigF_orcL66WZCdlKzeRdAcV9V4zd8JBNaXXfWXs";

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
  KMK2233:['AI / ML Engineer','Artificial Intelligence Applications'],
  KMK2533:['Data Analyst','Data Mining & Analytics'],
  KMK3393:['Web Developer','Web-Based Intelligent Systems'],
  KMK2363:['Learning Technology Specialist','Educational Technology Systems'],
  KMK3113:['XR / VR Developer','Virtual Reality Applications'],
  KMK2263:['Database Developer','Database & Information Systems'],
  KMK3483:['Computer Vision Engineer','Computer Vision Applications'],
  KMK3053:['NLP / Language Technology Researcher','Natural Language Processing'],
  KMK3013:['AI / Knowledge Engineer','Knowledge-Based Systems'],
  KMK3513:['Inclusive Learning Technology Specialist','Inclusive Education Technology'],
  KMK2383:['Text Analytics Specialist','Natural Language Processing'],
  KMK2553:['Learning Analytics Specialist','Educational Technology Systems'],
  KMK2473:['Graphics Developer','Computer Graphics'],
  KMK3163:['Project Coordinator','Project Management'],
  KMK3433:['Mobile App Developer','Mobile Intelligent Applications'],
  KMK3093:['Computational Intelligence Analyst','Artificial Intelligence Applications'],
  KMK2333:['Knowledge System Developer','Knowledge-Based Systems'],
  KMK2213:['Software Developer','Software Engineering Applications'],
  KMK2563:['Problem Solving Analyst','Computational Problem Solving'],
  KMK3523:['Inclusive Learning Support Specialist','Inclusive Education Technology']
};

function setRole(role){
  currentRole = role;
  document.getElementById('roleAdminBtn').className = 'role-btn' + (role === 'admin' ? ' active-admin' : '');
  document.getElementById('roleStudentBtn').className = 'role-btn' + (role === 'student' ? ' active-student' : '');
}

async function loadData(){
  const { data, error } = await supabaseClient
    .from("career_fyp_records")
    .select("*")
    .order("created_at", { ascending: false });

  if(error){
    console.error("Fetch error:", error);
    return [];
  }
  return data;
}

/* KOD YANG DIUBAH: Penambahan pengesanan ralat Supabase yang terperinci */
async function saveData(entry){
  const { data, error } = await supabaseClient
    .from("career_fyp_records")
    .insert([entry]);

  if(error){
    console.error("Supabase Error Details:", error.message, error.details, error.hint);
    alert(`Failed to save data.\nError Message: ${error.message}\nHint: ${error.hint || 'Check RLS or Table schema'}`);
    return false;
  }
  return true;
}

function getValues(){
  const selected = [...document.querySelectorAll('[data-subject]:checked')].map(x => x.dataset.subject);
  const scores = {};

  interests.forEach((text, index) => {
    const checked = document.querySelector(`input[name="interest_${index}"]:checked`);
    scores['interest_' + index] = checked ? Number(checked.value) : 0;
  });

  return { selected, scores };
}

function renderPills(selected){
  document.getElementById('selectedPills').innerHTML =
    selected.map(s => `<span class="pill">${s}</span>`).join('') || '<div class="small">None selected</div>';
}

function scoreRecommend(selected, scores){
  const career = {};
  const fyp = {};

  Object.values(subjectMap).forEach(([careerName, fypName]) => {
    career[careerName] = 0;
    fyp[fypName] = 0;
  });

  selected.forEach(code => {
    if(subjectMap[code]){
      career[subjectMap[code][0]] += 3;
      fyp[subjectMap[code][1]] += 3;
    }
  });

  if(scores.interest_0 >= 4){
    career['AI / ML Engineer'] += 4;
    career['AI / Knowledge Engineer'] += 3;
    career['Computational Intelligence Analyst'] += 3;
    fyp['Artificial Intelligence Applications'] += 4;
    fyp['Knowledge-Based Systems'] += 3;
  }
  if(scores.interest_1 >= 4){
    career['Data Analyst'] += 4;
    career['Database Developer'] += 3;
    fyp['Data Mining & Analytics'] += 4;
    fyp['Database & Information Systems'] += 3;
  }
  if(scores.interest_2 >= 4){
    career['Web Developer'] += 4;
    career['Mobile App Developer'] += 3;
    fyp['Web-Based Intelligent Systems'] += 4;
    fyp['Mobile Intelligent Applications'] += 3;
  }
  if(scores.interest_3 >= 4){
    career['XR / VR Developer'] += 4;
    career['Computer Vision Engineer'] += 3;
    career['Graphics Developer'] += 3;
    fyp['Virtual Reality Applications'] += 4;
    fyp['Computer Vision Applications'] += 3;
    fyp['Computer Graphics'] += 3;
  }
  if(scores.interest_4 >= 4){
    career['NLP / Language Technology Researcher'] += 4;
    career['Text Analytics Specialist'] += 3;
    fyp['Natural Language Processing'] += 4;
  }
  if(scores.interest_5 >= 4){
    career['Learning Technology Specialist'] += 4;
    career['Inclusive Learning Technology Specialist'] += 3;
    fyp['Educational Technology Systems'] += 4;
    fyp['Inclusive Education Technology'] += 4;
  }

  const topCareer = Object.entries(career).sort((a,b) => b[1] - a[1])[0];
  const topFyp = Object.entries(fyp).sort((a,b) => b[1] - a[1])[0];

  const confidence = Math.min(95, Math.max(40, topCareer[1] * 8 + topFyp[1] * 6));

  return {
    career: topCareer[0],
    fyp: topFyp[0],
    confidence
  };
}

async function renderSavedCount(){
  const data = await loadData();
  document.getElementById('savedCount').textContent = data.length + ' records';
}

async function generateAndSave(){
  const matric_number = document.getElementById('matricNumber').value.trim();
  const year_of_study = document.getElementById('yearOfStudy').value;
  const { selected, scores } = getValues();

  if(!matric_number){
    alert('Please enter matric number.');
    return;
  }

  const unanswered = Object.values(scores).filter(v => v === 0).length;
  if(unanswered > 0){
    alert('Please answer all interest questions.');
    return;
  }

  const rec = scoreRecommend(selected, scores);

  const entry = {
    role: currentRole,
    matric_number,
    year_of_study,
    selected_subjects: selected,
    interests: scores,
    career: rec.career,
    fyp: rec.fyp,
    confidence: rec.confidence
  };

  const saved = await saveData(entry);
  if(!saved) return;

  document.getElementById('resultText').innerHTML = `
    <p><strong>Career:</strong> ${rec.career}</p>
    <p><strong>FYP:</strong> ${rec.fyp}</p>
    <p><strong>Confidence:</strong> ${rec.confidence}%</p>
    <p><strong>Saved successfully to Supabase database.</strong></p>
  `;

  renderPills(selected);
  await renderSavedCount();
}

function fillSample(){
  document.getElementById('matricNumber').value = '78901';
  document.getElementById('yearOfStudy').value = 'Year 3';
  document.querySelectorAll('[data-subject]').forEach(el => el.checked = false);

  ['KMK2233','KMK2533','KMK2263','KMK3393'].forEach(code => {
    const el = document.querySelector(`[data-subject="${code}"]`);
    if(el) el.checked = true;
  });

  [5,4,4,3,3,2].forEach((v,i) => {
    const radio = document.querySelector(`input[name="interest_${i}"][value="${v}"]`);
    if(radio) radio.checked = true;
  });

  renderPills(getValues().selected);
}

function resetForm(){
  document.getElementById('mainForm').reset();
  document.getElementById('resultText').textContent = 'Submit the form to generate recommendation.';
  document.getElementById('selectedPills').innerHTML = '';
}

function buildForm(){
  document.getElementById('year2Box').innerHTML = year2.map(([c,n]) =>
    `<label class="subj">
      <input type="checkbox" data-subject="${c}">
      <strong>${c}</strong>
      <small>${n}</small>
    </label>`
  ).join('');

  document.getElementById('year3Box').innerHTML = year3.map(([c,n]) =>
    `<label class="subj">
      <input type="checkbox" data-subject="${c}">
      <strong>${c}</strong>
      <small>${n}</small>
    </label>`
  ).join('');

  document.getElementById('interestBox').innerHTML = interests.map((text, index) => `
    <div class="scale-card">
      <div class="scale-title">${text}</div>
      <div class="scale-row">
        <div class="left">Don't like</div>
        <div class="num">1</div>
        <div class="num">2</div>
        <div class="num">3</div>
        <div class="num">4</div>
        <div class="num">5</div>
        <div class="right">Love it</div>
        <div></div>
        <label><input type="radio" name="interest_${index}" value="1"></label>
        <label><input type="radio" name="interest_${index}" value="2"></label>
        <label><input type="radio" name="interest_${index}" value="3"></label>
        <label><input type="radio" name="interest_${index}" value="4"></label>
        <label><input type="radio" name="interest_${index}" value="5"></label>
        <div></div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('[data-subject]').forEach(box => {
    box.addEventListener('change', () => {
      renderPills(getValues().selected);
    });
  });
}

function showApp(){
  document.getElementById('loginPage').classList.add('hide');
  document.getElementById('appPage').classList.remove('hide');

  const roleBadge = document.getElementById('roleBadge');
  const savedBtn = document.getElementById('savedBtn');

  if(currentRole === 'admin'){
    roleBadge.className = 'badge badge-admin';
    roleBadge.textContent = 'Admin';
    savedBtn.style.display = 'inline-block';
  } else {
    roleBadge.className = 'badge badge-student';
    roleBadge.textContent = 'Student';
    savedBtn.style.display = 'none';
  }
}

function showLogin(){
  document.getElementById('appPage').classList.add('hide');
  document.getElementById('loginPage').classList.remove('hide');
}

function doLogin(){
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();

  const adminValid = currentRole === 'admin' && u === ADMIN_USERNAME && p === ADMIN_PASSWORD;
  const studentValid = currentRole === 'student' && u === STUDENT_USERNAME && p === STUDENT_PASSWORD;

  if(adminValid || studentValid){
    sessionStorage.setItem('careerFypLoggedIn', '1');
    sessionStorage.setItem('careerFypRole', currentRole);

    buildForm();
    showApp();
    renderSavedCount();
    document.getElementById('loginMsg').textContent = '';
  } else {
    document.getElementById('loginMsg').textContent = 'Invalid username or password.';
  }
}

function logout(){
  sessionStorage.removeItem('careerFypLoggedIn');
  sessionStorage.removeItem('careerFypRole');
  showLogin();
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
}

async function deleteRecord(id){
  const confirmDelete = confirm('Delete this record?');
  if(!confirmDelete) return;

  const { error } = await supabaseClient
    .from("career_fyp_records")
    .delete()
    .eq("id", id);

  if(error){
    console.error(error);
    alert("Failed to delete.");
    return;
  }
  await renderSavedCount();
  await viewSaved();
}

/* KOD YANG DIUBAH: Pembaikan syarat penapisan untuk keserasian jadual SQL */
async function deleteAllRecords(){
  const confirmDelete = confirm('Delete all records?');
  if(!confirmDelete) return;

  const { error } = await supabaseClient
    .from("career_fyp_records")
    .delete()
    .neq("matric_number", ""); 

  if(error){
    console.error(error);
    alert("Failed to delete all.");
    return;
  }
  await renderSavedCount();
  await viewSaved();
}

async function viewSaved(){
  const data = await loadData();
  const rows = data.map((r) => `
    <tr>
      <td>${r.created_at || ''}</td>
      <td>${r.role}</td>
      <td>${r.matric_number}</td>
      <td>${r.year_of_study}</td>
      <td>${Array.isArray(r.selected_subjects) ? r.selected_subjects.join(', ') : r.selected_subjects}</td>
      <td>${r.career}</td>
      <td>${r.fyp}</td>
      <td>${r.confidence}%</td>
      <td>
        <button class="delete-btn" onclick="deleteRecord(${r.id})">Delete</button>
      </td>
    </tr>
  `).join('');

  const box = document.getElementById('savedPage');
  box.innerHTML = `
    <div class="top">
      <h2>Saved Data</h2>
      <div class="action-row">
        <button class="btn-danger" onclick="deleteAllRecords()">Delete All</button>
        <button class="btn2" onclick="hideSaved()">Close</button>
      </div>
    </div>
    <div class="tablewrap">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Role</th>
            <th>Matric</th>
            <th>Year</th>
            <th>Subjects</th>
            <th>Career</th>
            <th>FYP</th>
            <th>Confidence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
  box.classList.remove('hide');
}

function hideSaved(){
  document.getElementById('savedPage').classList.add('hide');
}

window.onload = function(){
  const loggedIn = sessionStorage.getItem('careerFypLoggedIn');
  const role = sessionStorage.getItem('careerFypRole');

  if(loggedIn === '1' && role){
    currentRole = role;
    buildForm();
    showApp();
    renderSavedCount();
  } else {
    showLogin();
  }
};
