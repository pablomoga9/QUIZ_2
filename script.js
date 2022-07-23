
//FIRABASE

const firebaseConfig = {
    apiKey: "AIzaSyCsj-mu-bLS8NIECiFe2hopq4ZnItCl10Y",
    authDomain: "quiz-45209.firebaseapp.com",
    projectId: "quiz-45209",
    storageBucket: "quiz-45209.appspot.com",
    messagingSenderId: "12766186834",
    appId: "1:12766186834:web:0fd3f639bb88bb9abebe8b"
  };

  firebase.initializeApp(firebaseConfig);


  const db = firebase.firestore();//Referencia a la base datos

//   let provider = new firebase.auth.GoogleAuthProvider();//Posibilidad de logear con google


  const createUser = (user) => {
    db.collection("usuarios")
      .add(user)
      .then((docRef) => console.log("Usuario añadido con ID: ", docRef.id))
      .catch((error) => console.error("Error adding document: ", error));
  };

  const createScore = (user) => {
    db.collection("puntuaciones")
      .add(user)
      .then((docRef) => console.log("Puntuación añadida con ID: ", docRef.id))
      .catch((error) => console.error("Error adding document: ", error));
  };


    //SIGN UP Y SIGN IN


    let nickName = "";


    //Sign Up
  const signUpUser = (email, password) => {
    
      firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        let user = userCredential.user;
        console.log(`se ha registrado ${user.email} ID:${user.uid}`)
        alert(`se ha registrado ${user.email} ID:${user.uid}`)
        // ...
        // Guarda El usuario en Firestore
        createUser({
          id:user.uid,
          email:user.email
        });
  
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log("Error en el sistema"+error.message);
      });
  };

   //Sign in

   const signInUser = (email,password,nick) =>{
    let datesArr = [];//Array para meter todas las fechas de las partidas de un jugador concreto y poder mostrarlas después en el gráfico
    let scoresArr = [];////Array para meter todas las puntuaciones de las partidas de un jugador concreto y poder mostrarlas después en el gráfico
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        localStorage.setItem("usuario", JSON.stringify(nick));
        let user = userCredential.user;
        console.log(`se ha logado ${user.email} ID:${user.uid}`)
        alert(`se ha logado ${user.email} ID:${user.uid}`)
        console.log(user);
       
        const readDate = () => {//Buscamos el jugador que tenga el nickname con el cual hemos iniciado sesión
            db.collection("puntuaciones")
          .where("playerName", "==",nick )//Comprobamos dentro de la colección "puntuaciones" dónde coincide la propiedad "playerName" con el nick que traemos del usuario logeado
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((docu) => {
                
                // datesArr.push(docu.date);//Por cada documento con el nick indicado, pusheamos al array la fecha correspondiente a ese documento
                console.log(docu.data().date);
                datesArr.push(docu.data().date);
            })
          });
      };
      readDate();
        const readScore = ()=>{//Hacemos lo mismo pero ahora para obtener un array de todas las puntuaciones que tenga un jugador con el "nick" que le damos
            db.collection("puntuaciones")
            .where("playerName", "==", nick)
            .get()
            .then((querySnapshot)=>{
                querySnapshot.forEach((docu)=>{
                    console.log(docu.data().puntuacion);
                   scoresArr.push(docu.data().puntuacion);
                })
            });
        };
        readScore();
        console.log(datesArr);
        console.log(scoresArr);
        // console.log(scoresArr);
        // console.log(datesArr);
        var canv = document.getElementById("myChart").getContext("2d");
        var weatherChart = new Chart(canv,{//Creamos un chart con el array de las fechas que hemos sacado y las puntuaciones de 
            type:"bar",
            data:{
                // labels:[datesArr[0],datesArr[1],datesArr[2]],
                labels:["Fecha1","Fecha2","Fecha3","Fecha4"] ,
                datasets:[{
                    label: "Puntuación",
                    // data:[scoresArr[0],scoresArr[1],scoresArr[2]]
                   data: [1,2,4,5]
                }]
            }
        })



      })}


    //   document.getElementById("form1").addEventListener("submit",function(event){
    //     event.preventDefault();
        
    //     let email = event.target.elements.email.value;
    //     let pass = event.target.elements.pass.value;
    //     let pass2 = event.target.elements.pass2.value;
      
    //     pass===pass2?signUpUser(email,pass):alert("error password");
    //   })

    //   document.getElementById("form2").addEventListener("submit",function(event){
    //     event.preventDefault();
    //     let email = event.target.elements.email2.value;
        
    //     let pass = event.target.elements.pass3.value;
    //     signInUser(email,pass,email.split('@')[0])
    // })

    //Test de subida de puntuaciones con nombre a Firestore


    //METER EN LA PANTALLA FINAL DEL SCORE
function addScore(){
    let fechaActual = new Date(Date.now()).toDateString();
    createScore({
        playerName: localStorage.getItem("usuario"),
        puntuacion: score,
        date: fechaActual
    })
}


























































//LOGICA QUIZ


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
const input4 = document.getElementById("answer4");

 //
let counterQuestion = 0;

//hacer función contador para cuando pulses boton cambie de numero y 
//enganche el siguiente numero del array

let score = 0;      // puntuación

    

async function loadQuestions() {
console.log("Esto es el score "+score);
    deselectAns();

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

    console.log(arrRandom[3]);


    const response = fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple')
        .then(response => response.json())
        .then(data => {       
                                                  
            document.getElementById("question").innerHTML = data.results[`${counterQuestion}`].question
            document.getElementById(`label${arrRandom[0]}`).innerHTML = data.results[`${counterQuestion}`].incorrect_answers[0]
            document.getElementById(`label${arrRandom[1]}`).innerHTML = data.results[`${counterQuestion}`].incorrect_answers[1]
            document.getElementById(`label${arrRandom[2]}`).innerHTML = data.results[`${counterQuestion}`].incorrect_answers[2]
            document.getElementById(`label${arrRandom[3]}`).innerHTML = data.results[`${counterQuestion}`].correct_answer

        });

    function clickAllList() {
        list1.addEventListener('click', () => {
            input1.click()
        })
        list2.addEventListener('click', () => {
            input2.click()
        })
        list3.addEventListener('click', () => {
            input3.click()
        })
        list4.addEventListener('click', () => {
            input4.click()
        })
    }clickAllList()

    const correctAns = document.getElementById(`list${arrRandom[3]}`)

    function addPoint (){
        correctAns.addEventListener('click', ()=>{
        console.log("hola");
    
    correctAns.removeEventListener('click', () => {})
})
} addPoint()

    } 

  loadQuestions()




function deselectAns() {            
    answElems.forEach(answElem => answElem.checked = false);    
};

function countAnswer() {

        submitButton.addEventListener('click', () => {
        ++counterQuestion                              
        answElems.forEach(answElem => {  
        if(answElem.checked) {
        loadQuestions()                   
        }
        });

    })
}countAnswer() 

function colourAnswer() {
    list1.addEventListener('click', () =>{
        list1.classList.add('selectedAnswer')
        list2.classList.remove('selectedAnswer')
        list3.classList.remove('selectedAnswer')
        list4.classList.remove('selectedAnswer')
    })
    list2.addEventListener('click', () =>{
        list1.classList.remove('selectedAnswer')
        list2.classList.add('selectedAnswer')
        list3.classList.remove('selectedAnswer')
        list4.classList.remove('selectedAnswer')
    })
    list3.addEventListener('click', () =>{
        list1.classList.remove('selectedAnswer')
        list2.classList.remove('selectedAnswer')
        list3.classList.add('selectedAnswer')
        list4.classList.remove('selectedAnswer')
    })
    list4.addEventListener('click', () =>{
        list1.classList.remove('selectedAnswer')
        list2.classList.remove('selectedAnswer')
        list4.classList.add('selectedAnswer')
        list3.classList.remove('selectedAnswer')
    })
    submitButton.addEventListener('click', () =>{
        list1.classList.remove('selectedAnswer')
        list2.classList.remove('selectedAnswer')
        list3.classList.remove('selectedAnswer')
        list4.classList.remove('selectedAnswer')
    })
        }
    colourAnswer()

 

    
// let currentQuestion = 0;    //pregunta actual


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

