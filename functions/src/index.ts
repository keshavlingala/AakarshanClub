import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const FieldValue = require('firebase-admin').firestore.FieldValue;
import {Comment, Owner, Post} from '../../src/app/home/post.model';
import {User} from '../../src/app/interfaces/user.model';

export interface Token {
  owner: Owner,
  token: string
}

admin.initializeApp();
const store = admin.firestore();
const msg = admin.messaging();
export const newPost = functions.firestore
  .document('Posts/{postid}').onCreate(async snapshot => {
    const post = snapshot.data() as Post;
    console.log('Started', post);
    const tokens = await store.collection('Tokens').get();
    console.log('Fetched Tokens', tokens.docs);
    const allTokens = tokens.docs.map(doc => {
      return (doc.data() as Token).token;
    });
    await store.collection('Users').doc(post.owner.uid).update({
      postCount: FieldValue.increment(1)
    });
    console.log('Tokens Changed', allTokens);
    console.log('Worked');
    return msg.sendToDevice(allTokens, {
      notification: {
        title: post.content,
        body: 'New Post Uploaded by ' + post.owner.displayName,
        color: 'blue',
        clickAction: 'https://aakarshan.web.app/post/' + post.pid,
      }
    }, {
      priority: 'high'
    });
  });
export const newComment =
  functions.firestore.document('Comments/{cid}').onCreate(async snapshot => {
    const data = snapshot.data() as Comment;
    return store.collection('Posts').doc(data.pid)
      .update({
        commentsCount: FieldValue.increment(1)
      });
  });
export const deleteComment =
  functions.firestore.document('Comments/{cid}').onDelete(snapshot => {
    const data = snapshot.data() as Comment;
    return store.collection('Posts').doc(data.pid).set({
      commentsCount: FieldValue.increment(-1)
    });
  });
export const userDelete = functions.firestore.document('Users/{uid}')
  .onDelete(snapshot => {
    const data = snapshot.data() as User;
    return store.collection('DeletedUsers').doc(<string> data.uid).set(data);
  });
export const postDelete = functions.firestore.document('Posts/{pid}')
  .onDelete(snapshot => {
    const post = snapshot.data() as Post;
    return store.collection('Users').doc(post.owner.uid).update({
      postCount: FieldValue.increment((-1))
    });
  });
export const thanks = functions.firestore
  .document(`Tokens/{tid}`).onCreate(snapshot => {
    const token = snapshot.data() as Token;
    console.log('New Subscriber', token);
    return msg.sendToDevice(token.token, {
      notification: {
        title: 'Subscription Success',
        body: 'Thanks for subscribing to Aakarshan, hope you will see great Arts ',
        clickAction: 'https://aakarshan.web.app'
      }
    }, {
      priority: 'high'
    });
  });
