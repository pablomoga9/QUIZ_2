//Selectores del DOM
const quiz = document.getElementById("quiz");  //main
const answElems = document.querySelectorAll(".answer");  // selector de todas las respuestas
const quesElem = document.getElementById("question");  //selector de la pregunta
const answA = document.getElementById("label1");  // selector de todas las respuestas A
const answB = document.getElementById("label2");  // selector de todas las respuestas B
const answC = document.getElementById("label3");  // selector de todas las respuestas C
const answD = document.getElementById("label4");  // selector de todas las respuestas D
const submitButton = document.getElementById("submit");  // Enviando respuesta
const millionaire = document.getElementById("millionaire")
const wrong = document.getElementById("audio_wrong")
const correct = document.getElementById("audio_correct")
millionaire.volume = 0.6

//Array formado por objetos, cada objeto corresponde a cada pregunta, incluyendo: la pregunta, las respuestas y la respuesta correcta.
const quizData = [
    {
        question: "¿Cuantas o's tiene el nick de Nacho 3?",
        answer1: "5",
        answer2: "4",
        answer3: "8",
        answer4: "3,14",
        correct: "answer3",
    },
    {
        question: "¿Como se llama la afamada cafetería con tremendos pinchos de tortilla?",
        answer1: "Mallorquina",
        answer2: "Menorquina",
        answer3: "Marquina",
        answer4: "Mallarquina",
        correct: "answer3",
    },
    {
        question: "¿Cual es la profesión que se repite de entre los compis de clase?",
        answer1: "Fontanero",
        answer2: "Controlador Aéreo",
        answer3: "Fisio",
        answer4: "Pastor",
        correct: "answer3",
    },
    {
        question: "¿A cuantos decibelios da clase el profesor de Ciberseguridad?",
        answer1: "40dB: Biblioteca tranquila",
        answer2: "80dB: Tráfico urbano",
        answer3: "120dB: Concierto de rock",
        answer4: "220dB: Explosión atómica",
        correct: "answer4",
    },
    {
        question: "¿Cuantos Nachos hay en clase?",
        answer1: "2",
        answer2: "4",
        answer3: "3",
        answer4: "n -1",
        correct: "answer3",
    },
    {
        question: "¿Desde donde retransmiten nuestros compañeros que estan en remoto?",
        answer1: "Siberia",
        answer2: "Sevilla",
        answer3: "Cincinnati",
        answer4: "Sin City",
        correct: "answer2",
    },
    {
        question: "¿Como se llama la compañera crack que nos acompañó durante el Ramp Up?",
        answer1: "Isabel la Católica",
        answer2: "Bea",
        answer3: "Leia",
        answer4: "Leticia",
        correct: "answer2",
    },
    {
        question: "¿Qué nos daba The Bridge al finalizar el Ramp Up?",
        answer1: "Un NFT",
        answer2: "El Santo Grial",
        answer3: "Un AbonoTortilla",
        answer4: "Una mochila",
        correct: "answer4",
    },
    {
        question: "¿Cuanto valen las Coca-Colas en la máquina del comedor?",
        answer1: "500 pesos argentinos",
        answer2: "0,1 Bitcoins",
        answer3: "2 BridgeCoins",
        answer4: "70 cents",
        correct: "answer4",
    },
    { 
        question: "¿Te ha gustado el quiz?",
        answer1: "Sí...",
        answer2: "Síí!!",
        answer3: "Sííí!!!",
        answer4: "SÍÍÍÍ!!!!!!!",
        correct: "answer4",
    },
];


let currentQuestion = 0;    //pregunta actual
let score = 0;      // puntuación

loadQuiz();     //Cargando el quiz


function loadQuiz() {
    deselectAns();      //función para las respuestas no están seleccionadas
    const currentDataQuestion = quizData[currentQuestion];      // Llamando a la posición del array
    quesElem.innerText = currentDataQuestion.question;    // Texto en el DOM question = Pregunta actual
    answA.innerText = currentDataQuestion.answer1;        // Texto en el DOM answer 1 = Answer 1 actual
    answB.innerText = currentDataQuestion.answer2;        // Texto en el DOM answer 2 = Answer 2 actual
    answC.innerText = currentDataQuestion.answer3;        // Texto en el DOM answer 3 = Answer 3 actual
    answD.innerText = currentDataQuestion.answer4;        // Texto en el DOM answer 4 = Answer 4 actual
    const audio = new Audio('../assets/Millionaire.mp3');
    
};

function getSelected() {                          
    let answer;                                   
    answElems.forEach(answElem => {  
        if(answElem.checked) {
            answer = answElem.id;                   
        };
    });
    return answer;                                
};

function deselectAns() {            
    answElems.forEach(answElem => answElem.checked = false);    
};

submitButton.addEventListener('click', () => {       
    const answer = getSelected();                     
    if(answer) {
       if(answer === quizData[currentQuestion].correct) {     
           score++;                                   
       };
    currentQuestion++;
    if(currentQuestion < quizData.length) {               
           loadQuiz();
       } else {
            submitButton.remove()
            if (score < 5) {
                quiz.innerHTML = `                          
           <h2 id="result">Has respondido ${score}/${quizData.length} preguntas bien, te falta calle</h2>        
           <button id="reload" onclick="location.reload()">Volver a jugar</button>
           `; 
           millionaire.pause()
           wrong.play()
           wrong.volume = 0.5;

            } else if (score <= 6) {
                quiz.innerHTML = `                          
           <h2 id="result">Has respondido ${score}/${quizData.length} preguntas bien, not bad!!</h2>        
           <button id="reload" onclick="location.reload()">Volver a jugar</button>
           `;
            millionaire.pause()
            correct.play()
            correct.volume = 0.5;
        } else if (score <=8) {
            quiz.innerHTML = `                          
            <h2 id="result">Has respondido ${score}/${quizData.length} preguntas bien, vaya crack!!</h2>        
            <button id="reload" onclick="location.reload()">Volver a jugar</button>
            `;
            millionaire.pause()
            correct.play()
            correct.volume = 0.5;
           } else
            quiz.innerHTML = `                          
            <h2 id="result">Has respondido ${score}/${quizData.length} preguntas bien, The Bridge is yours!!!</h2>        
            <button id="reload" onclick="location.reload()">Volver a jugar</button>
            `              
            millionaire.pause()
            correct.play()
            correct.volume = 0.5;
}}})