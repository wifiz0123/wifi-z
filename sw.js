self.addEventListener("install",event=>{
self.skipWaiting()
})

self.addEventListener("activate",event=>{
self.clients.claim()
})

self.addEventListener("message",event=>{

if(event.data && event.data.type==="notify"){

self.registration.showNotification("wifi-z",{

body:event.data.message,
icon:"img/icon192.png",
badge:"img/icon72.png",
vibrate:[200,100,200],
tag:"wifi-z",
renotify:true

})

}

})

self.addEventListener("notificationclick",event=>{

event.notification.close()

event.waitUntil(
clients.openWindow("index.html")
)

})