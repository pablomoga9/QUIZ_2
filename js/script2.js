
export const firebaseConfig2 = {
  apiKey: "AIzaSyCsj-mu-bLS8NIECiFe2hopq4ZnItCl10Y",
  authDomain: "quiz-45209.firebaseapp.com",
  projectId: "quiz-45209",
  storageBucket: "quiz-45209.appspot.com",
  messagingSenderId: "12766186834",
  appId: "1:12766186834:web:0fd3f639bb88bb9abebe8b"
};


import * as sc1 from "./script";
    

firebase.initializeApp(sc1.firebaseConfig);
const db = firebase.firestore();
  




    document.getElementById("click").style.display = "none"//Siempre que no estemos logeados, el botón de comenzar partida estará oculto
    document.getElementById("cli").style.display = "none";//Igual para el botón de log out

      document.getElementById("form1").addEventListener("submit",function(event){
        event.preventDefault();
        
        let email = event.target.elements.email.value;
        let pass = event.target.elements.pass.value;
        let pass2 = event.target.elements.pass2.value;
      
        pass===pass2?signUpUser(email,pass):alert("error password");
      })

      document.getElementById("form2").addEventListener("submit",function(event){
        event.preventDefault();
        let email = event.target.elements.email2.value;
        
        let pass = event.target.elements.pass3.value;
        signInUser(email,pass,email.split('@')[0])//Para poner un identificador al correo que inicia sesión y reconocerlo en la colección de "Puntuaciones", extraemos únicamente la parte previa al "@". De esta manera, al no poder repetirse los correos, tampoco se podrán repetir los nombres.
    })

console.log("ok")

  const createUser = (user) => {
    db.collection("usuarios")
      .add(user)
      .then((docRef) => console.log("Usuario añadido con ID: ", docRef.id))
      .catch((error) => console.error("Error adding document: ", error));
  };




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
       
        document.getElementById("click").style.display = "block";//Al habernos logeado, aparece el botón de comenzar la partida
        document.getElementById("cli").style.display = "block"
        document.getElementById("form11").style.display = "none";//Cuando hemos iniciado sesión desaparecerán los dos forumlarios (log in y sign up) y aparecerá botón de log out
        document.getElementById("form12").style.display = "none";

        if(datesArr.length == 0){//Si el array de las fechas está vacío y por tanto no tiene ningún registro de partida, se creará un texto.
            let text = document.createElement("p");
            document.querySelector(".text_container").appendChild(text);
            text.innerHTML = "El jugador aún no tiene datos para mostrar en una gráfica.    "
        }
        else{
            var canv = document.getElementById("myChart").getContext("2d");
            var weatherChart = new Chart(canv,{//Creamos un chart con el array de las fechas que hemos sacado y las puntuaciones de 
                type:"bar",
                data:{
                    // labels:[datesArr[0],datesArr[1],datesArr[2]],
                    labels:["Fecha 1", "Fecha 2", "Fecha 3"] ,
                    datasets:[{
                        label: "Puntuación",
                        // data:[scoresArr[0],scoresArr[1],scoresArr[2]]
                       data: [scoresArr[0],scoresArr[1],scoresArr[2]]
                    }]
                }
            })
        }



      })}


      const signOut = () => {
        let user = firebase.auth().currentUser;
        localStorage.setItem("usuario", "");
        document.getElementById("form11").style.display = "block";//Volvemos a hacer visibles formularios
        document.getElementById("form12").style.display = "block";
        document.getElementById("click").style.display = "none";
        document.getElementById("cli").style.display = "none";
        let text =  document.getElementsByTagName("p");
        text.innerHTML = "";
        firebase.auth().signOut().then(() => {
            console.log("Sale del sistema: "+ user.email)
          }).catch((error) => {
            console.log("hubo un error: "+ error);
          });
    }


    
