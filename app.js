let remainingSeconds=0

async function initNotifications(){

if(!("Notification" in window)) return

const permission=await Notification.requestPermission()

if(permission!=="granted") return

}

function sendNotification(message){

if(!navigator.serviceWorker) return

navigator.serviceWorker.ready.then(reg=>{

if(reg.active){

reg.active.postMessage({
type:"notify",
message:message
})

}

})

}

function formatTime(sec){

let m=Math.floor(sec/60)
let s=sec%60

return m+":"+(s<10?"0":"")+s

}

function voice(text){

let msg=new SpeechSynthesisUtterance(text)
msg.lang="fr-FR"
speechSynthesis.speak(msg)

}

function startTimer(){

setInterval(()=>{

if(remainingSeconds<=0) return

remainingSeconds--

let min=Math.floor(remainingSeconds/60)

if(min%10===0 && remainingSeconds%60===0){

sendNotification("Temps restant : "+formatTime(remainingSeconds))

}

if(remainingSeconds===300){

sendNotification("Temps restant : moins de 5 minutes")

voice("Attention il vous reste moins de cinq minutes de connexion")

}

if(remainingSeconds===60){

sendNotification("Temps restant : moins d'une minute")

voice("Attention vous avez moins d'une minute de connexion")

}

},1000)

}

function openPortal(){

let frame=document.getElementById("statusFrame")

if(frame){
frame.src="http://10.10.10.1/status"
}

}

window.addEventListener("load",async()=>{

await initNotifications()

openPortal()

remainingSeconds=3600

startTimer()

})