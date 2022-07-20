//Selectores del DOM
const quiz = document.getElementById("quiz");  //main
const answElems = document.querySelectorAll(".answer");  // selector de todas las respuestas
const quesElem = document.getElementById("question");  //selector de la pregunta
const answA = document.getElementById("label1");  // selector de todas las respuestas A
const answB = document.getElementById("label2");  // selector de todas las respuestas B
const answC = document.getElementById("label3");  // selector de todas las respuestas C
const answD = document.getElementById("label4");  // selector de todas las respuestas D
const submitButton = document.getElementById("submit");  // Enviando respuesta
const list1 = document.getElementById("list1");
const list2 = document.getElementById("list2");
const list3 = document.getElementById("list3");
const list4 = document.getElementById("list4");
const input1 = document.getElementById("answer1");
const input2 = document.getElementById("answer2");
const input3 = document.getElementById("answer3");
const input4 = document.getElementById("answer4"); //
let counterQuestion = 0;

//hacer función contador para cuando pulses boton cambie de numero y 
//enganche el siguiente numero del array

async function loadQuestions() {

    function countAnswer() {
        submitButton.addEventListener('click', () => {

            ++counterQuestion
            // console.log(counterQuestion);
        })
    }
    countAnswer()


    function randomizeAnswers() {
        let nums = [1, 2, 3, 4],
        rndNums = [],
            i = nums.length,
            j = 0;

        while (i--) {
            j = Math.floor(Math.random() * (i + 1));
            rndNums.push(nums[j]);
            nums.splice(j, 1);
        }
        return rndNums
    }
    let arrRandom = randomizeAnswers()

    

    const response = fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple&token=86960a028236048ec5c47129eaf8dd8944f16e1c2d73d98c588f5c1e662d8909')
        .then(response => response.json())
        .then(data => {                                              
            document.getElementById("question").innerHTML = data.results[`${counterQuestion}`].question
            document.getElementById(`label${arrRandom[0]}`).innerHTML = data.results[`${counterQuestion}`].incorrect_answers[0]
            document.getElementById(`label${arrRandom[1]}`).innerHTML = data.results[`${counterQuestion}`].incorrect_answers[1]
            document.getElementById(`label${arrRandom[2]}`).innerHTML = data.results[`${counterQuestion}`].incorrect_answers[2]
            document.getElementById(`label${arrRandom[3]}`).innerHTML = data.results[`${counterQuestion}`].correct_answer
        });
    function refreshPage() {
        submitButton.addEventListener('click', () => {
            location.reload()
        })

    } refreshPage()
}
loadQuestions()

// let currentQuestion = 0;    //pregunta actual
// let score = 0;      // puntuación

// loadQuiz();     //Cargando el quiz


// function loadQuiz() {
//     deselectAns();      //función para las respuestas no están seleccionadas
//     const currentDataQuestion = quizData[currentQuestion];      // Llamando a la posición del array
//     quesElem.innerText = currentDataQuestion.question;    // Texto en el DOM question = Pregunta actual
//     answA.innerText = currentDataQuestion.answer1;        // Texto en el DOM answer 1 = Answer 1 actual
//     answB.innerText = currentDataQuestion.answer2;        // Texto en el DOM answer 2 = Answer 2 actual
//     answC.innerText = currentDataQuestion.answer3;        // Texto en el DOM answer 3 = Answer 3 actual
//     answD.innerText = currentDataQuestion.answer4;        // Texto en el DOM answer 4 = Answer 4 actual
//     ;

// };

// function getSelected() {
//     let answer;
//     answElems.forEach(answElem => {
//         if (answElem.checked) {
//             answer = answElem.id;
//         };
//     });
//     return answer;
// };

// function deselectAns() {
//     answElems.forEach(answElem => answElem.checked = false);
// };

// submitButton.addEventListener('click', () => {
//     answer1.click();
// })

// submitButton.addEventListener('click', () => {

//     const answer = getSelected();
//     if (answer) {
//         if (answer === quizData[currentQuestion].correct) {
//             score++;
//         };
//         currentQuestion++;
//         if (currentQuestion < quizData.length) {
//             loadQuiz();
//         } else {
//             submitButton.remove()
//             if (score < 5) {
//                 quiz.innerHTML = `
//            <h2 id="result">Has respondido ${score}/${quizData.length} preguntas bien, te falta calle</h2>
//            <button id="reload" onclick="location.reload()">Volver a jugar</button>
//            `;
//                 millionaire.pause()
//                 wrong.play()
//                 wrong.volume = 0.5;

//             } else if (score <= 6) {
//                 quiz.innerHTML = `
//            <h2 id="result">Has respondido ${score}/${quizData.length} preguntas bien, not bad!!</h2>
//            <button id="reload" onclick="location.reload()">Volver a jugar</button>
//            `;
//                 millionaire.pause()
//                 correct.play()
//                 correct.volume = 0.5;
//             } else if (score <= 8) {
//                 quiz.innerHTML = `
//             <h2 id="result">Has respondido ${score}/${quizData.length} preguntas bien, vaya crack!!</h2>
//             <button id="reload" onclick="location.reload()">Volver a jugar</button>
//             `;
//                 millionaire.pause()
//                 correct.play()
//                 correct.volume = 0.5;
//             } else
//                 quiz.innerHTML = `
//             <h2 id="result">Has respondido ${score}/${quizData.length} preguntas bien, The Bridge is yours!!!</h2>
//             <button id="reload" onclick="location.reload()">Volver a jugar</button>
//             `
//             millionaire.pause()
//             correct.play()
//             correct.volume = 0.5;
//         }
//     }
// })


//EFECTOS VISUALES

