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
deleteDoc,
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






// одинаковый ID чата для двух пользователей

function getChatId(email1,email2){

return [email1,email2]
.sort()
.join("_");

}








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



messages.innerHTML += `

<p>

<b>${data.user}</b>:

${data.text}

</p>

`;


});


});


}









// отправка сообщения


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











// добавить контакт


addContact.onclick=async()=>{


let email = contactEmail.value.trim();



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



contacts.innerHTML = `


<button class="chat-item" id="globalChat">

🌍 Общий чат

</button>


`;




// открыть общий чат


document.getElementById("globalChat").onclick=()=>{


openChat("global");


};






const snap = await getDocs(

collection(

db,

"user",

user.uid,

"contacts"

)

);






snap.forEach((item)=>{


let email=item.data().email;



contacts.innerHTML += `


<div class="contact-row">


<button class="chat-item contact">

👤 ${email}

</button>


<button class="delete-contact"

data-email="${email}">

❌

</button>


</div>


`;



});








// открыть контакт


document.querySelectorAll(".contact")

.forEach(btn=>{


btn.onclick=()=>{


let email = btn.innerText.replace("👤 ","");



let chatId = getChatId(

user.email,

email

);



openChat(chatId);


};


});









// удалить контакт


document.querySelectorAll(".delete-contact")

.forEach(btn=>{


btn.onclick=async()=>{


let email = btn.dataset.email;



await deleteDoc(

doc(

db,

"users",

user.uid,

"contacts",

email

)

);



loadContacts();


};


});



}









// выход


logout.onclick=async()=>{


await signOut(auth);


window.location.href="index.html";


};
