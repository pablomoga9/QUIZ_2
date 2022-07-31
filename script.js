// FIRABASE

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
  
  let provider = new firebase.auth.GoogleAuthProvider();//Posibilidad de logear con google


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
    

   
    
        async function login (){
            
            try{
                const response = await firebase.auth().signInWithPopup(provider);
                console.log(response);
          
                let newUser = {
                    email: response.user.email,
                    name: response.user.displayName,
                  }
                 
                db.collection("usuarios")
                  .where("email", "==", response.user.email)
                  .get()
                  .then((querySnapshot) => {
                    console.log(querySnapshot);
                    if(querySnapshot.size == 0){
                      db.collection("usuarios")
                      .add(newUser)
                      .then((docRef) => {
                        nickName = (response.user.email).split('@')[0];
                        
                        console.log("Document written with ID: ", docRef.id)
                        quizCart.classList.remove("cartHide");
                        quizCart.classList.add("Box");
                        form2.classList.remove("form2show");
                        form2.classList.remove("form2hide");
                        submitButton.classList.remove("btnHide");
                        submitButton.classList.add("btnShow");
                      })
                      
                      .catch((error) => console.error("Error adding document: ", error));
                    } else{
                        nickName = (response.user.email).split('@')[0];
                        swal({
                            title: `Bienvenido '${nickName}'`,
                            icon: "success",
                            text: `Has iniciado sesión con ${response.user.email}`,
                            buttons: false,
                            timer: 3000
                          })
                        quizCart.classList.remove("cartHide");
                        quizCart.classList.add("Box");
                        form2.classList.remove("form2show");
                        form2.classList.remove("form2hide");
                        submitButton.classList.remove("btnHide");
                        submitButton.classList.add("btnShow");
                    }
                  });
                  let datesArr = [];//Array para meter todas las fechas de las partidas de un jugador concreto y poder mostrarlas después en el gráfico
            let scoresArr = [];////Array para meter todas las puntuaciones de las partidas de un jugador concreto y poder mostrarlas después en el gráfico
            
            const readDate = () => {//Buscamos el jugador que tenga el nickname con el cual hemos iniciado sesión
                db.collection("puntuaciones")
              .where("playerName", "==",nickName )//Comprobamos dentro de la colección "puntuaciones" dónde coincide la propiedad "playerName" con el nick que traemos del usuario logeado
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((docu) => {
                    
                    // datesArr.push(docu.date);//Por cada documento con el nick indicado, pusheamos al array la fecha correspondiente a ese documento
                 
                    datesArr.push(docu.data().date);
                })
              });
          };
          readDate();
            const readScore = ()=>{//Hacemos lo mismo pero ahora para obtener un array de todas las puntuaciones que tenga un jugador con el "nick" que le damos
                db.collection("puntuaciones")
                .where("playerName", "==", nickName)
                .get()
                .then((querySnapshot)=>{
                    querySnapshot.forEach((docu)=>{
                        
                       scoresArr.push(docu.data().puntuacion);
                    })
                });
            };
            readScore();
            console.log(datesArr);
            console.log(scoresArr);
            let fechas = datesArr.slice(1, 6)
    
            var responsiveOptions = 
                [['screen and (min-width: 641px) and (max-width: 1024px)',{}]]

            var datachart = {
                labels: fechas,
                series: [scoresArr
                ]
            };
            var optionschart = {
                
                width: 500,
                height: 300,
                high: 10,
                low:0,
                
                axisY: {
                   onlyInteger: true
                   },
                axisX: {
                    high: 10,    
                    labelInterpolationFnc: function (value, index) {        
                        return index % 5 == 0 ? value: null;
                },
                
              },
                };
    
            
            new Chartist.Line('#chart1', datachart, optionschart,responsiveOptions);
            // var canv = document.getElementById("myChart").getContext("2d");
                return response.user;
          
            }catch(error){  
                console.log(error);
            }

            
          }
         
         
          const signOutGoogle = async () => {
            try {
                let user = await firebase.auth().currentUser;
                if(user!=null){
                   await swal({
                        title: "Logout",
                        icon: "warning",
                        text: "Abandonando sesión",
                        closeOnClickOutside: false,
                        timer: 3000,
                        buttons: false
                      });
                    await firebase.auth().signOut();
                    console.log("Sale del sistema: "+user.email);
                    localStorage.clear();
                    location.reload();
                   
                }
                else{
                    location.reload();
                }
                
                
            } catch (error) {
                console.log("hubo un error: "+error);
            }
          }
          document.getElementById("logout").addEventListener("click", signOutGoogle);
          
          
          
         
    






    //Sign Up
  const signUpUser = (email, password) => {
    

      firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        form1.classList.remove('form1show')
        form1.classList.add('form1hide')
        form2.classList.remove('form2hide')
        form2.classList.add('form2show')
        let user = userCredential.user;
        console.log(`se ha registrado ${user.email} ID:${user.uid}`)
       
        // ...
        // Guarda El usuario en Firestore
        createUser({
          id:user.uid,
          email:user.email
        });

        swal({
            title: `Registrado '${user.email.split('@')[0]}'`,
            icon: "success",
            text: "Podrás acceder a rankings y gráficas de tus puntuaciones",
            button: "Ok",
          });
  
      })
      .catch((error) => {
        swal({
            title: `Usuario ya existente`,
            icon: "error",
            text: "Ya existe un usuario con este correo",
            button: "Ok",
          });
      });
  };




   //Sign in
   let datesArr = [];//Array para meter todas las fechas de las partidas de un jugador concreto y poder mostrarlas después en el gráfico
    let scoresArr = [];////Array para meter todas las puntuaciones de las partidas de un jugador concreto y poder mostrarlas después en el gráfico
   
   console.log(scoresArr[0]);
   const signInUser = (email,password,nick) =>{
   
    console.log(scoresArr[0]);
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Signed in
        const user = firebase.auth().currentUser;
       
        
       
            quizCart.classList.remove("cartHide");
            quizCart.classList.add("Box");
            form2.classList.remove("form2show");
            form2.classList.remove("form2hide");
            submitButton.classList.remove("btnHide");
            submitButton.classList.add("btnShow");
        
        
        
       
        
        swal({
            title: `Bienvenido '${user.email.split('@')[0]}'`,
            icon: "success",
            text: `Has iniciado sesión con ${user.email}`,
            buttons: false,
            timer: 3000,
          });
        // alert(`se ha logado ${user.email} ID:${user.uid}`)
        console.log(user);
       
        const readDate = () => {//Buscamos el jugador que tenga el nickname con el cual hemos iniciado sesión
            db.collection("puntuaciones")
          .where("playerName", "==",nick )//Comprobamos dentro de la colección "puntuaciones" dónde coincide la propiedad "playerName" con el nick que traemos del usuario logeado
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((docu) => {
                console.log(typeof docu.data().date);
                console.log(docu.data().date);
                datesArr.push((docu.data().date).toString());//Por cada documento con el nick indicado, pusheamos al array la fecha correspondiente a ese documento
              
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
                   scoresArr.push(parseInt(docu.data().puntuacion));
                   
                })
            });
        };
        readScore()
        console.log(datesArr);
        console.log(scoresArr[0]);
        console.log(datesArr[0]);
        
        console.log(datesArr);
        console.log(scoresArr);
        let fechas = datesArr.slice(1, 6)


        var responsiveOptions = [
            ['screen and (min-width: 641px) and (max-width: 1024px)', {
              showPoint: false,
              lineSmooth: false
            }],
            ['screen and (max-width: 640px)', {
            //   showLine: false,
              axisX: {
                labelInterpolationFnc: function(value) {
                  return 'W' + value;
                }
              }
            }]
          ];

        var datachart = {
            labels: fechas,
            series: [scoresArr
            ]
        };
        var optionschart = {
            
            //  width: 200,
            //  height: 100,
            high: 10,
            low:0,
            
            axisY: {
               onlyInteger: true
               },
            axisX: {
                high: 10,    
                labelInterpolationFnc: function (value, index) {        
                    return index % 5 == 0 ? value: null;
            },
            
          },
            };

        
        new Chartist.Line('#chart1', datachart, optionschart,responsiveOptions);
        // var canv = document.getElementById("myChart").getContext("2d");
            
      
        }).catch((error) => {
        swal({
            title: `Usuario no encontrado`,
            icon: "error",
            text: "Compruebe que ha introducido correctamente el correo y la contraseña",
            buttons: false,
            timer: 3000,
          });
      })}


      

    //Test de subida de puntuaciones con nombre a Firestore


    //METER EN LA PANTALLA FINAL DEL SCORE



//Ranking de usuarios====> meter en ul valor de nombre y puntuacion de repaso de documento de colección de puntuaciones


  
    

   
      
        
    











































//PANTALLA INICIALIZ





//LOGICA QUIZ


//Selectores del DOM
const quiz = document.getElementById("quiz");  //main
const answElems = document.querySelectorAll(".answer");
const answList = document.querySelectorAll(".list");  // selector de todas las respuestas
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
const form1 = document.getElementById("form1");
const form2 = document.getElementById("form2")
const smallClick = document.getElementById("smallclick");
const smallClick2 = document.getElementById("smallclick2");
const h3form2 = document.getElementById("h3form2");
// const h3form1 = document.getElementById("h3form1")
const quizCont = document.getElementById("quizCont")
const quizCart = document.getElementById("quiz");
const btnForm1 = document.getElementById("submitform1")
const btnForm2 = document.getElementById("submitform2")
const rankingBtn = document.getElementById("rankingBtn");
const ranking = document.getElementById("ranking")
const startText = document.getElementById("Comenzar")
const googleBtn = document.getElementById("google");
const logoutBtn = document.getElementById("logout")
const closeRanking = document.getElementById("closeRanking");
const closeRankBtn = document.getElementById("closeRankBtn")

ranking.style.display = "none";
// closeRanking.style.display = "none";
// closeRankBtn.style.display = "none";

document.getElementById("form1").addEventListener("submit",function(event){
    event.preventDefault();
    

   

    let email = event.target.elements.email.value;
    let pass = event.target.elements.pass.value;
    let pass2 = event.target.elements.pass2.value;
   
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(pass,pass2))
    {
   
        pass===pass2?signUpUser(email,pass):swal({ title: "Error en el campo de contraseña",
        icon: "error",
        text: "Se debe introducir la misma contraseña en ambos campos",
        button: "Ok",});
    
        
    }
    else{
        swal({
            title: "Error en el campo de contraseña o email",
            icon: "error",
            text: "El email debe tener '@' y '.com'. La contraseña debe contener al menos 8 caracteres, 1 letra mayúscula, 1 letra minúscula y 1 número",
            button: "Ok",
          });
    }


    
  })

  document.getElementById("form2").addEventListener("submit",function(event){
    event.preventDefault();
    let email = event.target.elements.email2.value;
    
    let pass = event.target.elements.pass3.value;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
        signInUser(email,pass,email.split('@')[0]);
    }
    else{
        swal({
            title: "Error en el campo de email",
            icon: "error",
            text: "El email debe tener '@' y '.com'",
            button: "Ok",
          });
    }
   
})

let counterQuestion = 0;

let score = 0;      // puntuación

function addScore(){
    console.log("1");
    const user = firebase.auth().currentUser;
    let fechaActual = new Date(Date.now()).toDateString();
    createScore({
        playerName: user.email.split('@')[0],
        puntuacion: score,
        date: fechaActual
    })
}

let arrAnswers = [];
let arrRandom;

let correctList;


btnForm1.addEventListener('submit', (event) => {
        event.preventDefault();
        // form1.classList.remove('form1show')
        // form1.classList.add('form1hide')
        // form2.classList.remove('form2hide')
        // form2.classList.add('form2show')
        })
btnForm2.addEventListener('submit', (event) => {
            event.preventDefault();
            // quizCart.classList.remove("cartHide");
            // quizCart.classList.add("Box");
            // submitButton.classList.remove("btnHide");
            // submitButton.classList.add("btnShow");
            })


async function loadQuestions() {

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
arrRandom = randomizeAnswers()  
deselectAns();

const response = await fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple')
        .then(response => response.json())
        .then(data => {       
          document.getElementById("question").innerHTML = data.results[`${counterQuestion}`].question
            arrAnswers =[
            document.getElementById(`label${arrRandom[0]}`).innerHTML = data.results[counterQuestion].incorrect_answers[0],
            document.getElementById(`label${arrRandom[1]}`).innerHTML = data.results[counterQuestion].incorrect_answers[1],
            document.getElementById(`label${arrRandom[2]}`).innerHTML = data.results[counterQuestion].incorrect_answers[2],
            document.getElementById(`label${arrRandom[3]}`).innerHTML = data.results[counterQuestion].correct_answer]
                                                   
            return arrAnswers
        })

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

} 
loadQuestions()


function executeChangeForm() {
   
        function changeForm() {
    smallClick.addEventListener('click', (event) => {
        event.preventDefault();
        
        form1.classList.remove('form1show')
        form1.classList.add('form1hide')
        form2.classList.remove('form2hide')
        form2.classList.add('form2show')
        h3form2.classList.add('h3form2hide')
    })
}changeForm()

function changeForm2() {
    smallClick2.addEventListener('click', (event) => {
        event.preventDefault();
        form1.classList.remove('form1hide')
        form1.classList.add('form1show')
        form2.classList.remove('form2show')
        form2.classList.add('form2hide')
    })
}changeForm2()

}executeChangeForm()





correctList = document.getElementById(`list${arrRandom[3]}`)

function addPoint() {
    submitButton.addEventListener('click', (event) => {
    event.preventDefault()
    let selecAns = document.getElementsByClassName("selectedAnswer")   
    let numberCorrect = selecAns[0].id[4]; 
        if (numberCorrect == arrRandom[3]) {
            score++
        }
    }) 
}addPoint()

const delay = 500; // anti-rebound for 500ms
let lastExecution = 0;

function doWait(){
    if ((lastExecution + delay) < Date.now()){
       addScore();
       lastExecution = Date.now() 
    }
}


function deselectAns() {            
    answElems.forEach(answElem => answElem.checked = false);    
};

function getSelected() {
    let answer;
    answElems.forEach(answElem => {
        if (answElem.checked) {
            answer = answElem.id;
        };
    });
    return answer
};
getSelected()

function countAnswer() {

        submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        
        const answer = getSelected();
        // console.log(answer);
        // console.log(correctAns);
    
    if (answer) {
        ++counterQuestion                              
        answElems.forEach(answElem => {  
        if(answElem.checked) {
            
        loadQuestions()                   
        }else if(counterQuestion > 9){
            document.getElementById("quiz").innerHTML=`<h2>Tu puntuación es de ${score} puntos, aquí tienes tu evolución! &#128071</h2>
            <button id="reload" onclick="location.reload()" style="margin-top:280px" >Volver a jugar</button>`
            submitButton.remove()
            doWait();
            
        }});
    }})
}countAnswer() 

function displayChart() {
  const chart = document.getElementById("chart3");  
  submitButton.addEventListener('click', (event) => {
    event.preventDefault()
    if (counterQuestion > 9) {
     chart.classList.remove('chart')
    chart.classList.add('chartdisplay')   
    }})}displayChart()

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


//------------------------------------------------------------------------------------------------

//RANKING 

    let orderArray = [];
    const orderScores = ()=>{
        db.collection("puntuaciones")
        .get()
        .then((querySnapshot)=>{
            querySnapshot.forEach((docu)=>{
             orderArray.push(docu.data());//Hacer push de cada uno de los objetos de la colección de "puntuaciones" dentro del array
            })
            orderArray.sort((p1,p2)=>p2.puntuacion - p1.puntuacion);//Ordenar el array de objetos obtenidos de la colección de "puntuaciones" en base a la propiedad de "puntuación" en orden descendente
            let rankingList = document.getElementById("ranking");
            startText.style.display = "none";
            ranking.style.display = "block";
            rankingBtn.style.display = "none";
            form1.classList.remove('form1show')
            form1.classList.add('form1hide')
            form2.classList.remove('form2show')
            form2.classList.add('form2hide')
            h3form2.classList.add('h3form2hide')
            // h3form1.style.display = "none";
            googleBtn.style.display = "none";
            logoutBtn.innerHTML = "X"
            logoutBtn.style.background = "linear-gradient(to right top, #c67d7d, #da6a68, #eb554f, #f73a32, #ff0606)";
            logoutBtn.style.borderRadius = "400px"
            swal({
                title: "Tabla de Ranking",
                text: "Aquí encontrarás las 5 puntuaciones más altas hasta la fecha",
                button: "Ok",
                footer: "Presiona la 'X' para volver al inicio de sesión"
              });

       for(i = 0; i < 5; i++){
        let liRanking = document.createElement("li");
        liRanking.setAttribute("id", "liRank");
        liRanking.innerHTML = `
        <b>Name:</b> ${orderArray[i].playerName}
        <b>Score:</b> ${orderArray[i].puntuacion}
        <b>Date:</b> ${orderArray[i].date}`
           rankingList.appendChild(liRanking);
       }
            })
         } 


    //      function closeRankingFunc(){
    //         let rankingList = document.getElementById("ranking");
    //         rankingList.innerHTML = "";
    //      }


         //--------------------------------------------------------------

          // CANCEL RANKING BUTTON
    //  form1.classList.remove('form1show')
    //  form1.classList.add('form1hide')
    //  form2.classList.remove('form2hide')
    //  form2.classList.add('form2show')
    //  h3form2.classList.add('h3form2hide')

    
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