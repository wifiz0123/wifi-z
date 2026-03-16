const STATUS_URL="http://10.10.10.1/status"
const LOGOUT_URL="http://10.10.10.1/logout"
const frame=document.getElementById("statusFrame")

let remainingSeconds=0
let hotspotConnected=false
let alert5=false
let alert1=false

frame.src=STATUS_URL

function speak(text){
  if(!("speechSynthesis" in window)) return
  let msg=new SpeechSynthesisUtterance(text)
  msg.lang="fr-FR"
  speechSynthesis.speak(msg)
}

function format(sec){
  let h=Math.floor(sec/3600)
  let m=Math.floor((sec%3600)/60)
  let s=sec%60
  return `${h}h ${m}m ${s}s`
}

function parseSeconds(str){
  let w=str.match(/(\d+)w/), d=str.match(/(\d+)d/), h=str.match(/(\d+)h/),
      m=str.match(/(\d+)m/), s=str.match(/(\d+)s/)
  return (w?parseInt(w[1])*604800:0) + (d?parseInt(d[1])*86400:0) +
         (h?parseInt(h[1])*3600:0) + (m?parseInt(m[1])*60:0) + (s?parseInt(s[1]):0)
}

async function getStatus(){
  try{
    let r = await fetch(STATUS_URL,{cache:"no-store"})
    let html = await r.text()
    let match = html.match(/[0-9]+[wdhms]+/i)
    if(match){
      remainingSeconds = parseSeconds(match[0])
      if(!hotspotConnected){
        hotspotConnected=true
        new Notification("wifi-z", { body:`Temps restant : ${format(remainingSeconds)}` })
      }
    }
  }catch(e){
    if(hotspotConnected){
      hotspotConnected=false
      frame.src=LOGOUT_URL
    }
  }
}

function countdown(){
  if(!hotspotConnected || remainingSeconds<=0) return
  remainingSeconds--
  let minutes=Math.floor(remainingSeconds/60)

  if(remainingSeconds%600===0){
    new Notification("wifi-z",{ body:`Temps restant : ${format(remainingSeconds)}` })
  }

  if(minutes<=5 && !alert5){
    alert5=true
    new Notification("wifi-z",{ body:"Moins de 5 minutes de connexion" })
    speak("Attention. Il vous reste moins de cinq minutes")
  }
  if(minutes<=1 && !alert1){
    alert1=true
    new Notification("wifi-z",{ body:"Moins d'une minute de connexion" })
    speak("Attention. Une minute restante")
  }
}

if("Notification" in window) Notification.requestPermission()

setInterval(getStatus,60000)
setInterval(countdown,1000)
getStatus()