import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {Comment, Post} from '../post.model';
import {PostService} from '../post.service';
import {AuthService} from '../../auth/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    private _pservice: PostService,
    private _auth: AuthService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {
  }

  get auth(): AuthService {
    return this._auth;
  }

  get pservice(): PostService {
    return this._pservice;
  }

  async ngOnInit() {
    console.log('Hello');
    this.id = this.route.snapshot.params.id;
    this.afs.collection('Posts').doc<Post>(this.id).valueChanges().subscribe(post => {
      this.post = post;
      this.post.pid = this.id;
    });
    // this.afs.collection<Comment>('Comments', ref => ref.where('pid', '==', id)).valueChanges();
    // console.log(this.post$);
    this.afs
      .collection<Comment>('Comments', ref => ref.where('pid', '==', this.id))
      .get()
      .subscribe(comments => {
        this.comments = comments.docs.map(doc => doc.data());
      });
    //   .snapshotChanges().subscribe(docs => {
    //   this.comments = docs.map(doc => {
    //     console.log(doc);
    //     return {
    //       id: doc.payload.doc.id,
    //       ...doc.payload.doc.data()
    //     };
    //   });
    // });
  }


}
