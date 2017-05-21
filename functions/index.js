var functions = require('firebase-functions')
const nodemailer = require('nodemailer')
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
'use strict'

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
var transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'bangkok.issue@gmail.com',
    pass: '123456bkk'
  }
})

exports.countlikechange = functions.database.ref('/issues/{issueid}/votes').onWrite(event => {
  let votes = event.data.val()
  let size = 0
  for (let key in votes) {
    if (votes.hasOwnProperty(key)) size++
  }
  admin.database().ref('/issues/' + event.params.issueid).once('value').then(function (snapshot) {
    console.log(snapshot.val())
    if (size === 1) {
      let picture = ''
      snapshot.val().photos.forEach(function(element) {
        picture += '<img src="'+ element.img + '" width="200px" height="auto">'
      })
      let mailOptions = {
        from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
        to: 'wachiramet.pai@gmail.com', // list of receivers
        subject: `แจ้งเพื่อพิจารณาแก้ไขปัญหา${snapshot.val().topic}`, // Subject line
        text: 'Hello world ?', // plain text body
        html: ` <br> <br> <br> <br>
<h4 align="center"><B>30 กุมภาพันธ์ 2660</B></h4>
<br>
<p><B>เรื่อง</B> แจ้งเพื่อพิจารณาแก้ไขปัญหา ${snapshot.val().topic}</p>
<p><B>เรียน</B> กรมโยธาธิการและผังเมือง</p>
<p><B>สิ่งที่แนบมาด้วย</B> รูปถ่ายสถานที่ที่เกิดปัญหา</p>
<br>
<p><dd>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ตามที่บริษัท Bangkok issue จำกัด ได้รับมอบหมายให้จัดทำแอปพลิเคชัน Bangkok issue ขึ้นเพื่อรับเรื่องร้องทุกข์เกี่ยวกับปัญหาที่พบเจอใน กทม.
<p><dd>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ในการนี้แอปพลิเคชัน Bangkok issue ได้รับแจ้งปัญหาเรื่อง <u>${snapshot.val().topic} </u>สถานที่เกิดเหตุคือบริเวณ <u>${snapshot.val().location}</u> (<a href="https://www.google.com/maps/place/${snapshot.val().locationGps.lat}N+${snapshot.val().locationGps.lng}E/@${snapshot.val().locationGps.lat},${snapshot.val().locationGps.lng},14z">GPS</a>) โดยปัญหานี้ส่งผลให้ <u>${snapshot.val().description}</u> เพื่อความเป็นอยู่ที่ดีขึ้นของประชาชนจึงเรียนมาเพื่อพิจารณาแก้ไขปัญหาดังกล่าว</p>

 <br>
<p align="right">ขอแสดงความนับถือ</p>
<p align="right">บริษัท Bangkok issue จำกัด</p>
<br>
${picture}` // html body
      }
      return transporter.sendMail(mailOptions).then(() => {
        console.log('New unsubscription confirmation email sent to:', '"wachiramet.pai@gmail.com"')
      })
    }
  })

  console.log(size)

  // send mail with defined transport object
})
