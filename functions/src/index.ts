import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
const crypto = require('crypto');
const cors = require('cors')({origin: true});
const nodemailer = require('nodemailer');
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'scienceman800@gmail.com',
        pass: '1234567890awe'
    }
  });

//Sends authentication cookie
export const authenticateUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        //var accepted = false;
        var db = admin.database();
        var userRef = db.ref("/username");
        var passwordRef = db.ref("/password");

        var password = request.query.password;
        //Hash password
        var hashPass : string = crypto.createHash('sha256').update(password).digest('hex');

        userRef.once('value').then(function(userSnapshot : any) {
            passwordRef.once('value').then(function(passSnapshot : any) {
                response.setHeader('Cache-Control', 'private');

                response.cookie('__session',
                  "(request.query.username == userSnapshot.val() && hashPass == passSnapshot.val()) TESTING COOKIE",
                  {maxAge: 60 * 60 * 24 * 1000, httpOnly: false, secure: false, path: '/', domain: '.cloudfunctions.net'} //Flags false for development only
                );
                //response.setHeader('Set-Cookie', ['__session=true']);

                return response.send((request.query.username == userSnapshot.val() && hashPass == passSnapshot.val()));
            });
        });
    });
    //return response.send(request.query.username +  " " + request.query.password + " " + userRef.once('value') + " " + passwordRef.once('value'));
});

//Scan entries once per day for reminder emails
export const sendReminderEmails = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        let db = admin.database();
        let entriesRef = db.ref("/entries");

        let currentDate = new Date();
        let emailHead : string = "<h1>Memories de Jour: " + currentDate.toLocaleDateString() + "</h1><br>";

        let reminders: string[] = []; 
        entriesRef.once('value').then(function(entriesSnapshot : any) {
            //return response.send(entriesSnapshot.val());
            for(let key in entriesSnapshot.val()) {
                let entry : any = entriesSnapshot.val()[key];
                let entryDate = new Date(entry.date);
                if(entryDate.getDate() == currentDate.getDate() 
                  && entryDate.getMonth() == entryDate.getMonth()
                  && entryDate.getFullYear() < currentDate.getFullYear()) { //Allow all through for debug
                    let yearDiff : Number = currentDate.getFullYear() - entryDate.getFullYear();
                    if(yearDiff != 1) reminders.push("<p><b>" + entry.name + "</b> - " + yearDiff + " years ago</p>");
                    else reminders.push("<p><b>" + entry.name + "</b> - " + yearDiff + " year ago</p>");
                }

            }

            let emailBody : string = "<h2>Memories</h2><ul>";
            if(reminders.length > 0) {
                reminders.forEach((reminder) => {
                    emailBody += "<li>" + reminder + "</li>"
                });
                emailBody += "</ul>";
            } else {
                return response.send('No reminders for today');
            }
    
            const dest = "alex.labbane@tamu.edu"; //Will need to be refactored for general purpose use
            const mailOptions = {
                from: 'Alex Alab <scienceman800@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
                to: dest,
                subject: "Memories de Jour: " + currentDate.toLocaleDateString(), // email subject
                html: emailHead + emailBody // email content in HTML
            };
    
            // returning result
            return transporter.sendMail(mailOptions, (erro : any, info : any) => {
                if(erro){
                    return response.send(emailBody + " " + erro.toString());
                }
                return response.send('Sent');
            });
        });
    });
});