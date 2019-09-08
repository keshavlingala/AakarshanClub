import {Injectable} from '@angular/core';
import {Comment, Post} from './post.model';
import {MatBottomSheet, MatDialog, MatSnackBar} from '@angular/material';
import {AuthService} from '../auth/auth.service';
import {PostDetailComponent} from './post-detail/post-detail.component';
import {AngularFirestore} from '@angular/fire/firestore';
import {PopLoginComponent} from '../pop-login/pop-login.component';
import {merge, Observable, zip} from 'rxjs';
import {firestore} from 'firebase/app';
import {AngularFireStorage} from '@angular/fire/storage';
import {ShareComponent} from '../share/share.component';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private snack: MatSnackBar,
    private auth: AuthService,
    private dialog: MatDialog,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private share: MatBottomSheet
  ) {
  }

  isPostOwner(post: Post) {
    // console.log(post);
    return post.owner.uid === this.auth.getUid;
    // return true;
  }

  deletePost(post: Post) {
    if (confirm('Are you Sure?, You Want to Delete this Post')) {
      this.storage.storage.refFromURL(post.imageURL).delete().then(value => console.log('Image Deleted'));
      this.afs.collection<Comment>('Comments', ref => ref.where('pid', '==', post.pid)).get().subscribe(docs => {
        docs.forEach(doc => {
          doc.ref.delete().then(() => console.log('Comment Deleted'));
        });
      });
      this.afs.collection('Posts').doc(post.pid).delete().then(() => {
        console.log('Post Deleted');
        this.snack.open('Post Deleted', '', {
          duration: 2000
        });
      });
    }

  }

  thumbUp(post: Post) {

    this.afs.collection('Posts').doc(post.pid).update({
      likes: firestore.FieldValue.increment(1)
    });
    this.snack.open('Post Liked', '', {
      duration: 1000,
    });
  }

  sharePost(post: Post) {
    this.share.open(ShareComponent, {
      data: post
    });
  }


  deleteComment(p: Post, c: Comment) {
    this.afs.collection('Comments').doc(c.id).delete().then(() => {
      this.snack.open('Comment Deleted', '', {
        duration: 2000
      });
    });
  }

  postComment(commentelement: HTMLInputElement, post: Post) {
    if (commentelement.value === '') {
      this.snack.open('Please Type Something', 'Dismiss', {
        duration: 3000
      });
      return;
    }
    const user = this.auth.getUser();
    // console.log(user);
    if (user !== null) {
      const owner = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      };
      this.afs.collection<Comment>('Comments').add({
        comment: commentelement.value,
        owner,
        pid: post.pid
      }).then(() => {
        console.log('comment successful');
        commentelement.value = '';
      });
    } else {
      this.dialog.open(PopLoginComponent);
      console.log('Login to Comment');
      this.snack.open('Please login to Comment', 'Dismiss', {
        duration: 3000
      });
    }
  }


}
