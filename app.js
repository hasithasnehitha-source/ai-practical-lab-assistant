// js/app.js

// State
let currentLabId = null;
let currentExperiment = null;

// UI Helpers
const $ = (id) => document.getElementById(id);
const showSection = (id) => {
    document.querySelectorAll('main > section').forEach(s => {
        s.classList.add('hidden-section');
        s.classList.remove('active-section');
    });
    const target = $(id);
    if (target) {
        target.classList.remove('hidden-section');
        target.classList.add('active-section');
    }

    // Update nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    // Simple heuristic for nav highlight
    if (id === 'home') document.querySelector('[data-target="home"]').classList.add('active');
    else if (id === 'labs' || id === 'experiments-list' || id === 'experiment-details') document.querySelector('[data-target="labs"]').classList.add('active');
    else if (id === 'ai-assistant') document.querySelector('[data-target="ai-assistant"]').classList.add('active');
    else if (id === 'viva') document.querySelector('[data-target="viva"]').classList.add('active');
};

// Navigation
function navigateTo(sectionId) {
    // If going to labs, load them
    if (sectionId === 'labs') {
        loadLabs();
    }
    showSection(sectionId);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Nav Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            navigateTo(target);
        });
    });

    // Initial Load
    // Initial Load
    navigateTo('login');
});

// --- Labs Logic ---
async function loadLabs() {
    const container = $('lab-categories-container');
    container.innerHTML = '<div class="loading-spinner">Loading Labs...</div>';

    const labs = await window.DataProvider.getLabs();

    container.innerHTML = '';
    labs.forEach(lab => {
        const card = document.createElement('div');
        card.className = 'card clickable-card';
        card.onclick = () => selectLab(lab);
        card.innerHTML = `
            <h3><i class="fa-solid ${lab.icon || 'fa-folder'}"></i> ${lab.title}</h3>
            <p>${lab.description}</p>
        `;
        container.appendChild(card);
    });
}

function selectLab(lab) {
    currentLabId = lab.id;
    $('selected-lab-title').textContent = lab.title + " Experiments";
    loadExperiments(lab.id);
    showSection('experiments-list');
}

async function loadExperiments(labId) {
    const container = $('experiments-container');
    container.innerHTML = '<div class="loading-spinner">Loading Experiments...</div>';

    const experiments = await window.DataProvider.getExperiments(labId);

    container.innerHTML = '';
    if (experiments.length === 0) {
        container.innerHTML = '<p>No experiments found.</p>';
        return;
    }

    experiments.forEach(exp => {
        const card = document.createElement('div');
        card.className = 'card clickable-card';
        card.onclick = () => selectExperiment(exp);
        card.innerHTML = `
            <h3>${exp.title}</h3>
            <p style="color:var(--text-muted); font-size:0.9rem;">${exp.aim.substring(0, 60)}...</p>
        `;
        container.appendChild(card);
    });
}

function selectExperiment(exp) {
    currentExperiment = exp;

    // Populate details
    $('exp-title').textContent = exp.title;
    $('exp-aim').textContent = exp.aim;
    $('exp-procedure').innerHTML = exp.procedure.replace(/\n/g, '<br>');
    $('exp-input').textContent = exp.input;
    $('exp-output').textContent = exp.output;
    $('exp-hints').innerHTML = ''; // Clear previous hints if any

    showSection('experiment-details');
}

function showHint() {
    if (!currentExperiment) return;
    const hintsDiv = $('exp-hints');
    hintsDiv.innerHTML = `<div class="alert" style="background:rgba(255,255,0,0.1); padding:10px; border-left:3px solid yellow; margin-top:10px;">
        <strong>Hint:</strong> ${currentExperiment.hints || 'Review the algorithm steps carefully.'}
    </div>`;
}

// --- AI Assistant Logic (Mock) ---
function analyzeCode() {
    const code = $('code-input').value;
    const lang = $('language-select').value;
    const resultBox = $('analysis-result');
    const content = $('ai-feedback-content');

    if (!code.trim()) {
        alert("Please enter some code first!");
        return;
    }

    resultBox.classList.remove('hidden');
    content.innerHTML = '<div class="loading-spinner">Analyzing logic...</div>';

    // Mock AI Delay
    setTimeout(() => {
        // Simple heuristic mock response
        let feedback = "";
        let isError = false;

        if (code.includes('error') || code.includes('fail')) {
            feedback = `
                <p style="color:#ef4444;"><strong><i class="fa-solid fa-circle-xmark"></i> Potential Error Detected` + `</strong></p>
                <p>It seems like you pasted an error message or incomplete code.</p>
                <ul style="margin-top:10px; margin-left:20px;">
                    <li>Check syntax for missing semicolons (;)</li>
                    <li>Ensure all variables are declared before use.</li>
                </ul>
            `;
            isError = true;
        } else if (code.length < 20) {
            feedback = `<p>The code is too short to analyze effectively. Please provide the full function or logic block.</p>`;
        } else {
            feedback = `
                <p style="color:#10b981;"><strong><i class="fa-solid fa-check-circle"></i> Code Looks Good!</strong></p>
                <p>Structure seems correct for <strong>${lang.toUpperCase()}</strong>.</p>
                <div style="background:#1e293b; padding:10px; border-radius:8px; margin-top:10px;">
                    <strong>Suggestions:</strong>
                    <ul style="margin-left:20px; margin-top:5px; color:#cbd5e1;">
                        <li>Consider adding comments for better readability.</li>
                        <li>Check edge cases (e.g. empty inputs).</li>
                        <li>Time Complexity looks optimal (O(n)).</li>
                    </ul>
                </div>
            `;
        }

        content.innerHTML = feedback;
    }, 1500);
}

// --- Viva Generator Logic (Mock) ---
function generateVivaQuestions() {
    const topic = $('viva-topic').value;
    const container = $('viva-questions-container');

    if (!topic.trim()) {
        alert("Please enter a topic!");
        return;
    }

    container.classList.remove('hidden');
    container.innerHTML = '<div class="loading-spinner">Generating Questions...</div>';

    setTimeout(() => {
        // Questions with Answers
        const questions = [
            {
                q: `What is the time complexity of <strong>${topic}</strong>?`,
                a: `The time complexity depends on the specific operation. For example, access might be O(1) or O(n) depending on the structure.`
            },
            {
                q: `Explain the difference between <strong>${topic}</strong> and its alternatives.`,
                a: `<strong>${topic}</strong> is often preferred when specific trade-offs (like memory vs speed) align with the use case.`
            },
            {
                q: `What are the real-world applications of <strong>${topic}</strong>?`,
                a: `Used in databases, networking protocols, and system resource management.`
            },
            {
                q: `How would you optimize <strong>${topic}</strong> for large datasets?`,
                a: `Using indexing, caching, or distributed processing can significantly improve performance.`
            },
            {
                q: `Can you write the pseudocode for <strong>${topic}</strong>?`,
                a: `Please refer to standard algorithms. The core steps usually involve initialization, iteration/recursion, and termination checks.`
            }
        ];

        let html = '';
        questions.forEach((item, index) => {
            html += `
                <div class="card" style="border-left: 4px solid var(--secondary);">
                    <h4>Question ${index + 1}</h4>
                    <p>${item.q}</p>
                    <button class="btn btn-sm btn-secondary" onclick="toggleAnswer('ans-${index}')" style="margin-top:10px;">
                        <i class="fa-solid fa-eye"></i> Show Answer
                    </button>
                    <div id="ans-${index}" class="viva-answer-box hidden">
                        <strong>Answer:</strong>
                        <p>${item.a}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }, 1500);
}

function toggleAnswer(id) {
    const el = document.getElementById(id);
    if (el) {
        if (el.classList.contains('hidden')) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    }
}

// --- Login Logic ---
function handleLogin(e) {
    e.preventDefault();
    const email = $('email').value;
    const password = $('password').value;

    if (email && password) {
        // Mock success
        showSection('home');
        // Update some UI info if needed
    } else {
        alert('Please fill in all fields');
    }
}