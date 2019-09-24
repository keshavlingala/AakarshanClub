import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Owner, Post} from '../../src/app/home/post.model';
import MessagingDevicesResponse = admin.messaging.MessagingDevicesResponse;

export interface Token {
  owner: Owner,
  token: string
}

export const newPost = functions.firestore
  .document('Posts/{postid}').onCreate(async snapshot => {
    const msg = admin.messaging();
    const post = <Post> snapshot.data();
    const store = admin.firestore();
    const tokens = await store.collection('fcmTokens').get();
    const promises: Promise<MessagingDevicesResponse>[] = [];
    tokens.docs.forEach(doc => {
      const d = msg.sendToDevice((doc.data() as Token).token, {
        notification: {
          title: post.content,
          body: 'New Post Uploaded by ' + post.owner.displayName,
          color: 'blue',
          clickAction: 'https://google.com',
        }
      }, {
        priority: 'high'
      });
      promises.push(d);
    });
    return Promise.all(promises);
  });
