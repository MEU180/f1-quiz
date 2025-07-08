const burger = document.getElementById('burger');
const navbar = document.querySelector('nav ul');
burger.addEventListener('click', () => {
  navbar.classList.toggle('active');
});


const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
  scrollTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
});
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');
if (!localStorage.getItem('cookieAccepted')) {
  cookieBanner.style.display = 'block';
}
acceptCookies.addEventListener('click', () => {
  localStorage.setItem('cookieAccepted', 'true');
  cookieBanner.style.display = 'none';
});


const togglePassword = document.getElementById('togglePassword');
if (togglePassword) {
  togglePassword.addEventListener('change', function () {
    const passwordInput = document.getElementById('password');
    passwordInput.type = this.checked ? 'text' : 'password';
  });
}


const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const password = contactForm.password.value.trim();
  const message = contactForm.message.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2) {
    formMessage.textContent = 'Name must be at least 2 characters.';
    formMessage.style.color = 'red';
    return;
  }
  if (!emailRegex.test(email)) {
    formMessage.textContent = 'Please enter a valid email address.';
    formMessage.style.color = 'red';
    return;
  }
  if (password.length < 6) {
    formMessage.textContent = 'Password must be at least 6 characters.';
    formMessage.style.color = 'red';
    return;
  }
  if (message.length < 5) {
    formMessage.textContent = 'Message must be at least 5 characters.';
    formMessage.style.color = 'red';
    return;
  }

  formMessage.textContent = 'Message sent successfully!';
  formMessage.style.color = 'limegreen';
  contactForm.reset();
});


let currentQuestion = 0;
let score = 0;
let questions = [];

const quizContainer = document.getElementById("quiz-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const resultContainer = document.getElementById("quiz-result");

fetch("data/questions.json")
  .then((res) => res.json())
  .then((data) => {
    questions = data;
    loadQuestion();
  })
  .catch(() => {
    quizContainer.innerHTML = "<p>❌ Failed to load quiz questions.</p>";
  });

function loadQuestion() {
  const question = questions[currentQuestion];
  questionElement.textContent = `${currentQuestion + 1}. ${question.question}`;
  answersElement.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.classList.add("answer-btn");
    btn.addEventListener("click", () => checkAnswer(index));
    answersElement.appendChild(btn);
  });
}

function checkAnswer(selectedIndex) {
  const correctIndex = questions[currentQuestion].correct;
  const allBtns = document.querySelectorAll(".answer-btn");

  allBtns.forEach((btn, index) => {
    btn.disabled = true;
    if (index === correctIndex) {
      btn.classList.add("correct");
    } else if (index === selectedIndex) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedIndex === correctIndex) score++;
  nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
    nextBtn.style.display = "none";
  } else {
    showResult();
  }
});

function showResult() {
  quizContainer.innerHTML = `
    <h2>Your Score: ${score}/${questions.length}</h2>
    <p>${getMessage(score, questions.length)}</p>
    <button onclick="restartQuiz()" class="btn">Restart Quiz</button>
  `;
}

function getMessage(score, total) {
  const ratio = score / total;
  if (ratio === 1) return "🏆 Perfect! You're an F1 legend!";
  if (ratio >= 0.7) return "🚀 Great job! You're an F1 expert.";
  if (ratio >= 0.5) return "👍 Not bad! A bit more practice and you'll get there.";
  return "Keep practicing! F1 has a lot to learn.";
}

function restartQuiz() {
  location.reload();
}
