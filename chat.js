import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


import {

collection,
addDoc,
serverTimestamp,
onSnapshot,
query,
orderBy,
doc,
setDoc,
getDoc,
collection,
getDocs

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";



const input = document.getElementById("messageInput");
const send = document.getElementById("send");
const messages = document.getElementById("messages");

const logout = document.getElementById("logout");



let user = null;



onAuthStateChanged(auth,(u)=>{


if(!u){

window.location.href="index.html";

}
else{

user=u;

}


});




// отправка сообщения

send.onclick = async()=>{


if(input.value.trim()=="") return;


await addDoc(collection(db,"messages"),{


text: input.value,

user: user.email,

time: serverTimestamp()


});


input.value="";


};





// загрузка сообщений

const q = query(

collection(db,"messages"),

orderBy("time")

);



onSnapshot(q,(snapshot)=>{


messages.innerHTML="";


snapshot.forEach((doc)=>{


let data = doc.data();


messages.innerHTML += `

<p>

<b>${data.user}</b>:

${data.text}

</p>


`;


});


});





logout.onclick=async()=>{


await signOut(auth);

window.location.href="index.html";


};
