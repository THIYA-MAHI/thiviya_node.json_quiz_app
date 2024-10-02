let currentCategory = 'html'; // Default category
let currentQuestionIndex = 0;
let questions = [];
let quizContainer = document.getElementById('quiz-container');

// Function to show loading animation
function showLoadingMessage() {
    quizContainer.innerHTML = `<p>Loading questions...</p>`;
}

// Function to hide loading animation
function hideLoadingMessage() {
    quizContainer.innerHTML = '';
}

// Function to load questions for the selected category
async function loadQuestions(category) {
    showLoadingMessage();
    try {
        const response = await fetch(`/questions?category=${category}`);
        if (!response.ok) throw new Error('Failed to load questions');
        questions = await response.json();
        currentQuestionIndex = 0; // Reset to the first question
        hideLoadingMessage();
        displayQuestion();
    } catch (error) {
        console.error('Error:', error);
        quizContainer.innerHTML = '<p>Error loading questions.</p>';
    }
}

// Function to display a single question with multiple-choice options
function displayQuestion() {
    quizContainer.innerHTML = ''; // Clear previous content

    if (currentQuestionIndex >= questions.length) {
        quizContainer.innerHTML = '<p>All questions completed!</p>';
        return;
    }

    const question = questions[currentQuestionIndex];

    // Create question element
    const questionElement = document.createElement('div');
    questionElement.classList.add('question-block');

    // Display question text
    const questionText = document.createElement('p');
    questionText.innerText = `${currentQuestionIndex + 1}. ${question.question}`;
    questionElement.appendChild(questionText);

    // Create radio buttons for each answer option
    question.options.forEach((option, optionIndex) => {
        const optionLabel = document.createElement('label');
        const optionInput = document.createElement('input');

        optionInput.type = 'radio';
        optionInput.name = `question_${currentQuestionIndex}`; // Ensures only one option can be selected
        optionInput.value = optionIndex; // Set option index to match it with the correct answer

        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(document.createTextNode(option));

        // Add the label with radio button to the question element
        questionElement.appendChild(optionLabel);
        questionElement.appendChild(document.createElement('br')); // Line break for better readability
    });

    // Add the question block to the quiz container
    quizContainer.appendChild(questionElement);

    // Add a submit button
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit Answer';
    submitButton.addEventListener('click', checkAnswer);
    quizContainer.appendChild(submitButton);
}

// Function to check if the selected answer is correct
function checkAnswer() {
    const selectedOption = document.querySelector(`input[name="question_${currentQuestionIndex}"]:checked`);

    if (!selectedOption) {
        alert('Please select an answer.');
        return;
    }

    const selectedAnswerIndex = parseInt(selectedOption.value);
    const correctAnswerIndex = questions[currentQuestionIndex].correct;

    if (selectedAnswerIndex === correctAnswerIndex) {
        // Correct answer
        showCorrectAnswerMessage();
    } else {
        alert('Incorrect answer. Try again.');
    }
}

// Function to show "Correct Answer" message and proceed to the next question after 3 seconds
function showCorrectAnswerMessage() {
    quizContainer.innerHTML = '<p>Correct Answer!</p>';

    // After 3 seconds, proceed to the next question
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 2000);
}

// Event handler for category selection
function selectCategory(category) {
    currentCategory = category;
    loadQuestions(currentCategory);
}

// Load default category on page load
loadQuestions(currentCategory);
