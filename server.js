const express = require('express')
const {writeFile}      = require('fs')
const util = require('util')
const write =util.promisify(writeFile)
i=0
const app = express()
time=new Date().getTime()
let port = 4000
app.use(express.json({limit:'1mb'}))
app.use(express.static('public'))
k=new Date()
app.listen(port,()=>console.log(`App listning on port ${port} ${k}`))

app.post('/data',async (req,res)=>{
   
    let data = req.body
    console.log(`IP:${data.ip} opened the link\n\nSaving to database\n\n`)
    let browser = data.client.browser
    console.log(`
    ${time}\n_____________${data.ip}_________________\n\n
    The battery is at ${data.battery.level} and battery is ${data.battery.charging}\n
    The user took ${(data.con.rtt*25)/1000} seconds to send and recieve on avrage\nThe user Internet speed is extimated to be ${data.con.speed} and downlink is ${data.con.downlink}\n
    The user is using ${data.device.os} with ${data.device.ram} GB RAM and ${data.device.cpu} logical processers
    The user is browsing in ${browser} with ${data.client.vender} as vendor
    `)
    await write(`./database/${data.ip.ip}.json`,JSON.stringify(data))
    console.log('\n\nFile Written')
    if(!data){
        res.status('404').json({msg:'no data'})
    }
})