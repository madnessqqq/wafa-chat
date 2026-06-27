import { auth } from "./firebase.js";


import {

onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";



const logout = document.getElementById("logout");



onAuthStateChanged(auth,(user)=>{


if(!user){

window.location.href="index.html";

}


});




logout.onclick=async()=>{


await signOut(auth);


window.location.href="index.html";


};
