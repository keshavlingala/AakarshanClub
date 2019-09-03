import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Comment, Post} from '../post.model';
import {PostService} from '../post.service';
import {AuthService} from '../../auth/auth.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {LoginComponent} from '../../login/login.component';
import {PopLoginComponent} from '../../pop-login/pop-login.component';

@Component({
  selector: 'app-post-full',
  templateUrl: './post-full.component.html',
})
export class PostFullComponent implements OnInit {
  post: Post;
  id = '';
  comments: Comment[];

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private pservice: PostService,
    private auth: AuthService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.afs.collection('posts').doc<Post>(this.id).valueChanges().subscribe(post => {
      this.post = post;
      this.post.pid = this.id;
    });
    // console.log(this.post$);
    this.afs
      .collection<Comment>('Comments', ref => ref.where('pid', '==', this.id))
      .snapshotChanges().subscribe(docs => {
      this.comments = docs.map(doc => {
        return {
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    });
    // this.afs.collection<Comment>('Comments', ref => ref.where('pid', '==', id)).valueChanges();
  }


}
