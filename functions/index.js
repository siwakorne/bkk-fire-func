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
    pass: ''
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
    if (size === 5 && snapshot.val().state === 'wait') {
      let picture = ''
      snapshot.val().photos.forEach(function (element) {
        picture += '<img src="' + element.img + '" width="200px" height="auto">'
      })
      let nowDate = new Date()
      let date = nowDate.toDateString()
      let mailOptions = {
        from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
        to: snapshot.val().issueType.email, // list of receivers
        subject: `แจ้งเพื่อพิจารณาแก้ไขปัญหา${snapshot.val().topic}`, // Subject line
        text: 'Hello world ?', // plain text body
        html: `
<center><img src="https://firebasestorage.googleapis.com/v0/b/bkk-project-51671.appspot.com/o/photos%2FBKK_GREEN%2BOrange1_150ppi.png?alt=media&token=14b433a6-7f78-4948-bbfc-8b80d149bef9" width="240px"></center>
<br> <br> <br> <br>
<h4 align="center"><B>${date}</B></h4>
<br>
<p><B>เรื่อง</B> แจ้งเพื่อพิจารณาแก้ไขปัญหา ${snapshot.val().topic}</p>
<p><B>เรียน</B> ${snapshot.val().issueType.agency}</p>
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
        admin.database().ref('/issues/' + event.params.issueid).update({state: 'sended'})
        console.log('New unsubscription confirmation email sent to:', snapshot.val().issueType.email)
      })
    }
  })

  console.log(size)
  // send mail with defined transport object
})
