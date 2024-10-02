let currentCategory = 'html'; // Default category

// Function to load questions for the selected category
async function loadQuestions(category) {
    try {
        const response = await fetch(`/questions?category=${category}`);
        if (!response.ok) throw new Error('Failed to load questions');
        const questions = await response.json();
        displayQuestions(questions);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display questions with multiple-choice options
function displayQuestions(questions) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Clear previous questions

    questions.forEach((question, index) => {
        // Create question element
        const questionElement = document.createElement('div');
        questionElement.classList.add('question-block');

        // Display question text
        const questionText = document.createElement('p');
        questionText.innerText = `${index + 1}. ${question.question}`;
        questionElement.appendChild(questionText);

        // Create radio buttons for each answer option
        question.options.forEach((option, optionIndex) => {
            const optionLabel = document.createElement('label');
            const optionInput = document.createElement('input');

            optionInput.type = 'radio';
            optionInput.name = `question_${index}`;  // Ensures only one option can be selected per question
            optionInput.value = optionIndex;  // Set option index to match it with the correct answer

            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(document.createTextNode(option));

            // Add the label with radio button to the question element
            questionElement.appendChild(optionLabel);
            questionElement.appendChild(document.createElement('br')); // Line break for better readability
        });

        quizContainer.appendChild(questionElement);
    });

    // Add a submit button to finalize answers
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit Answers';
    submitButton.addEventListener('click', checkAnswers);
    quizContainer.appendChild(submitButton);
}

// Function to check if the selected answers are correct
function checkAnswers() {
    const questionBlocks = document.querySelectorAll('.question-block');
    questionBlocks.forEach((block, index) => {
        const selectedOption = block.querySelector(`input[name="question_${index}"]:checked`);
        if (selectedOption) {
            console.log(`Question ${index + 1}: Selected Option: ${selectedOption.value}`);
            // You can compare `selectedOption.value` with the correct answer index from the JSON here
        } else {
            console.log(`Question ${index + 1}: No option selected`);
        }
    });
}

// Event handler for category selection
function selectCategory(category) {
    currentCategory = category;
    loadQuestions(currentCategory);
}

// Load default category on page load
loadQuestions(currentCategory);
