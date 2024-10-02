let currentQuestionIndex = 0;
let currentCategory = 'html'; // Can be changed to other categories like css, javascript, etc.
let questions = [];

// Fetch questions from the server
fetch('/questions')
    .then(response => response.json())
    .then(data => {
        questions = data[currentCategory];
        loadQuestion();
    });

function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionLabels = [
        document.getElementById('label1'),
        document.getElementById('label2'),
        document.getElementById('label3'),
        document.getElementById('label4')
    ];

    const options = [
        document.getElementById('option1'),
        document.getElementById('option2'),
        document.getElementById('option3'),
        document.getElementById('option4')
    ];

    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionLabels.forEach((label, index) => {
        label.textContent = question.options[index];
        options[index].checked = false; // Reset radio button selection
    });

    // Show radio buttons
    options.forEach(option => {
        option.style.display = 'inline-block';
    });

    // Clear any previous messages
    document.getElementById('message').textContent = '';
}

document.getElementById('quiz-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const selectedOption = document.querySelector('input[name="option"]:checked');

    if (!selectedOption) {
        alert('Please select an answer');
        return;
    }

    const userAnswer = parseInt(selectedOption.value);
    const correctAnswer = questions[currentQuestionIndex].correct;

    if (userAnswer === correctAnswer) {
        document.getElementById('message').textContent = 'Correct! answer ';
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setTimeout(loadQuestion, 2000); // Delay loading next question
        } else {
            document.getElementById('message').textContent = 'Quiz completed!';
        }
    } else {
        document.getElementById('message').textContent = 'Incorrect, try again!';
    }
});
