import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
const crypto = require('crypto');
const cors = require('cors')({origin: true});
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

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