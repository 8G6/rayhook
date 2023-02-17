let ip=null
function hide(){
    document.getElementById('spinner').style.display='none'
}
getIP=(json)=>{ip=json.ip}
let options='';

JSA ={}

function map(){

    var element = document.getElementById('map');
    element.style = 'height:300px;';
    var map = L.map(element);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var target = L.latLng(JSA["latitude"], JSA['longitude']);

    map.setView(target, 14);

    L.marker(target).addTo(map);
}

async function getLocation (ip) {
    let url = `https://ipapi.co/${ip}/json/`;
  
    await fetch(url).then((response) =>
      response.json().then((json) => {
        JSA = json
      })
    );
  };
  
async function con(){
    let p=window.navigator.getBattery().then(async(bat)=>{
        let battery;
        if(bat.charging){
            battery={charging:'charging',level:`${bat.level*100}%`}
        }
        else{
            battery={charging:"not charging",level:`${bat.level*100}%`}
        }
        
        let client={browser:navigator.appVersion,vender:navigator.vendor}
        let con={speed:navigator.connection.effectiveType,rtt:navigator.connection.rtt,downlink:navigator.connection.downlink}
        let device={cpu:navigator.hardwareConcurrency,ram:window.navigator.deviceMemory ?  window.navigator.deviceMemory : 'Browser is too Secure ' ,os:navigator.platform}
        const data = {battery,client,con,device,ip};
        let browser = data.client.browser  
        await getLocation(ip)
        let user = '_____________Hello User with IP Adress '+ip+" From "+JSA.city+'_________________\n\n'
        let batt = `The battery is at ${data.battery.level} and battery is ${data.battery.charging}\n`
        let conn = `The user took ${(data.con.rtt*25)/1000} seconds to send and recieve on avrage\nThe user Internet speed is extimated to be ${data.con.speed} and downlink is ${data.con.downlink}\n`
        let dev = `The user is using ${data.device.os} with ${data.device.ram} GB RAM and ${data.device.cpu} logical processers`
        let brow =`\nThe user is browsing in ${browser} with ${data.client.vender} as vendor`
        data.ip = JSA
        map()
        let final=user+batt+conn+dev+brow
        document.getElementById('data').innerHTML=final.replaceAll('\n','<br>')
        options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
       
    };
    await fetch('/data',options)
    })
}
document.addEventListener('onload',()=>{
    alert('page loaded')
})