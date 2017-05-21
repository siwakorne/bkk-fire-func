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
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
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
      let mailOptions = {
        from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
        to: '7sin@outlook.co.th', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>Hello world ?</b>' + snapshot.val() // html body
      }
      return transporter.sendMail(mailOptions).then(() => {
        console.log('New unsubscription confirmation email sent to:', '"7sin@outlook.co.th"')
      })
    }
  })

  console.log(size)

  // send mail with defined transport object
})
