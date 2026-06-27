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

let unsubscribe = null;




const input = document.getElementById("messageInput");

const send = document.getElementById("send");

const messages = document.getElementById("messages");

const logout = document.getElementById("logout");

const contacts = document.getElementById("contacts");

const addContact = document.getElementById("addContact");

const contactEmail = document.getElementById("contactEmail");






function getChatId(email1,email2){

return [email1,email2]
.sort()
.join("_");

}







onAuthStateChanged(auth,(u)=>{


if(!u){

window.location.href="index.html";

return;

}


user=u;


loadContacts();

openChat("global");


});









function openChat(id){


currentChat=id;


messages.innerHTML="";



if(unsubscribe){

unsubscribe();

}



const q=query(

collection(

db,

"chats",

currentChat,

"messages"

),

orderBy("time")

);



unsubscribe = onSnapshot(q,(snap)=>{


messages.innerHTML="";



snap.forEach((m)=>{


let data=m.data();



let deleteBtn = "";



// тільки свої повідомлення

if(data.user === user.email){


deleteBtn = `


<button class="delete-message"

data-id="${m.id}">

❌

</button>


`;

}



messages.innerHTML += `


<div class="message">


<p>

<b>${data.user}</b>:

${data.text}

</p>


${deleteBtn}


</div>


`;



});





document.querySelectorAll(".delete-message")

.forEach(btn=>{


btn.onclick=async()=>{


let id = btn.dataset.id;



await deleteDoc(

doc(

db,

"chats",

currentChat,

"messages",

id

)

);


};


});



});


}









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









async function loadContacts(){



contacts.innerHTML = "";



contacts.insertAdjacentHTML(

"beforeend",

`

<button class="chat-item" id="globalChat">

🌍 Общий чат

</button>

`

);





document.getElementById("globalChat").onclick=()=>{


openChat("global");


};







const snap = await getDocs(

collection(

db,

"users",

user.uid,

"contacts"

)

);





snap.forEach((item)=>{


let email=item.data().email;



contacts.insertAdjacentHTML(

"beforeend",

`

<div class="contact-row">


<button class="chat-item contact">

👤 ${email}

</button>



<button class="delete-contact"

data-email="${email}">

❌

</button>


</div>

`

);


});








document.querySelectorAll(".contact")

.forEach(btn=>{


btn.onclick=()=>{


let email = btn.innerText.replace("👤 ","");



openChat(

getChatId(

user.email,

email

)

);


};


});









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









logout.onclick=async()=>{


await signOut(auth);


window.location.href="index.html";


};
