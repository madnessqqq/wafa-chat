const messages=document.getElementById("messages");

function send(){

let input=document.getElementById("text");

if(input.value=="") return;

let div=document.createElement("div");

div.innerHTML="<b>Вы:</b> "+input.value;

messages.appendChild(div);

input.value="";

messages.scrollTop=messages.scrollHeight;

}
