import { auth } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";



const email = document.getElementById("email");
const password = document.getElementById("password");


const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

const logoutBtn = document.getElementById("logout");
const openChat = document.getElementById("openChat");


openChat.onclick=()=>{

window.location.href="chat.html";

};
const userPanel = document.getElementById("userPanel");

const authBox = document.querySelector(".auth");





// Регистрация

registerBtn.onclick = async ()=>{

try{


await createUserWithEmailAndPassword(
auth,
email.value,
password.value
);


alert("Аккаунт создан 🎉");


}

catch(error){

alert(error.message);

}


};





// Вход

loginBtn.onclick = async ()=>{


try{


await signInWithEmailAndPassword(
auth,
email.value,
password.value
);


alert("Вы вошли ✅");


}


catch(error){

alert(error.message);

}


};






// Проверка пользователя

onAuthStateChanged(auth,(user)=>{


if(user){


authBox.classList.add("hidden");

userPanel.classList.remove("hidden");


}

else{


authBox.classList.remove("hidden");

userPanel.classList.add("hidden");


}


});





// Выход

logoutBtn.onclick = async ()=>{


await signOut(auth);


alert("Вы вышли");


};
