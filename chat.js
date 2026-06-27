import { auth, db } from "./firebase.js";


import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


import {

collection,
addDoc,
onSnapshot,
query,
orderBy,
doc,
setDoc,
getDocs,
serverTimestamp

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";



let user = null;

let currentChat = "global";



const input = document.getElementById("messageInput");
const send = document.getElementById("send");

const messages = document.getElementById("messages");

const logout = document.getElementById("logout");

const contacts = document.getElementById("contacts");

const addContact = document.getElementById("addContact");

const contactEmail = document.getElementById("contactEmail");





// вход


onAuthStateChanged(auth,(u)=>{


if(!u){

window.location.href="index.html";

return;

}


user=u;

loadContacts();

openChat("global");


});






// открыть чат


function openChat(id){


currentChat=id;


messages.innerHTML="";



const q=query(

collection(
db,
"chats",
currentChat,
"messages"
),

orderBy("time")

);



onSnapshot(q,(snap)=>{


messages.innerHTML="";



snap.forEach((m)=>{


let data=m.data();



messages.innerHTML+=`

<p>

<b>${data.user}</b>:

${data.text}

</p>

`;



});


});


}







// отправка


send.onclick=async()=>{


if(!input.value.trim()) return;



await addDoc(

collection(
db,
"chats",
currentChat,
"messages"
),


{


text:input.value,

user:user.email,

time:serverTimestamp()


}


);



input.value="";


};







// общий чат кнопка


document.querySelector(".chat-item").onclick=()=>{


openChat("global");


};








// добавить контакт


addContact.onclick=async()=>{


let email=contactEmail.value.trim();



if(!email)return;



await setDoc(

doc(

db,

"users",

user.uid,

"contacts",

email

),


{

email:email

}


);



contactEmail.value="";


loadContacts();


};








// загрузка контактов


async function loadContacts(){


contacts.innerHTML="";



const snap=await getDocs(

collection(

db,

"users",

user.uid,

"contacts"

)

);



snap.forEach((item)=>{


let email=item.data().email;



contacts.innerHTML+=`


<button class="chat-item contact">

👤 ${email}

</button>


`;



});



document.querySelectorAll(".contact")

.forEach(btn=>{


btn.onclick=()=>{


openChat(btn.innerText.replace("👤 ",""));


};



});



}






// выход


logout.onclick=async()=>{


await signOut(auth);


window.location.href="index.html";


};
