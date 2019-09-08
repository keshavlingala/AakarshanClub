import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {PostService} from '../post.service';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {AuthService} from '../../auth/auth.service';
import {Post, Comment} from '../post.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  loading = true;
  post: Post;
  comments: Comment[];

  constructor(
    public dialogRef: MatDialogRef<PostDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
    private _pService: PostService,
    private actRout: ActivatedRoute,
    private auth: AuthService,
    private afs: AngularFirestore,
  ) {
    if (this.data) {
      this.post = this.data;
    } else {
      console.log(actRout.snapshot.params);
    }
  }


  get pService(): PostService {
    return this._pService;
  }

  ngOnInit() {
    this.loading = true;
    console.log('Post Called from ', this.post.pid);
    this.afs
      .collection<Comment>('Comments', ref => ref.where('pid', '==', this.post.pid))
      .snapshotChanges().subscribe(snap => {
      this.comments = snap.map(c => {
        return {
          id: c.payload.doc.id,
          ...c.payload.doc.data()
        };
      });
      this.loading = false;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
