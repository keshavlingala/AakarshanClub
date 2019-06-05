import * as functions from 'firebase-functions';
import * as cors from 'cors';

const corsHandler = cors({origin: true});
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    const res = {
      msg: 'Hello from Firebase!'
    };
    response.send(res);
  });
});
export const likes = functions.firestore
  .document('Posts/{postId}/Likes/{uid}').onCreate((snap, context) => {
    console.log('New Like');
    const like = snap.data();
    console.log(snap.ref.path);
    console.log('Document Reference: ', snap.ref);
    console.log('SnapShot Value: ', like);
  });
