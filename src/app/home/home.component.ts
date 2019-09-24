import {AfterContentInit, Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {AngularFirestore, AngularFirestoreCollection, CollectionReference, DocumentChangeAction} from '@angular/fire/firestore';
import {Post} from './post.model';
import {ToastrService} from 'ngx-toastr';
import {AngularFireStorage} from '@angular/fire/storage';
import {Comment} from './post.model';
import {merge, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {MatDialog, MatFormField} from '@angular/material';
import {UploadPostComponent} from '../upload-post/upload-post.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  post: Post;
  myPosts: Observable<Post[]>;
  arts: Post[] = [];
  uploading: boolean;
  imageSelected: File;
  loading: boolean;
  showing = 1;

  constructor(
    private _auth: AuthService,
    private afs: AngularFirestore,
    private toast: ToastrService,
    private storage: AngularFireStorage,
    private matD: MatDialog
  ) {
  }

  get auth(): AuthService {
    return this._auth;
  }

  async ngOnInit() {
    this.loading = true;
    this.post = {
      content: '',
      imageURL: '',
      likes: 0,
      owner: this.auth.getOwner,
    };
    // const posts = JSON.parse(localStorage.getItem('posts')) as Post[];
    // this.showing = posts.length;
    const loadApi: Observable<Post[]> = this.afs
      .collection<Post>('Posts')
      .valueChanges();

// TODO : Limit posts and lazy load images
//    Also Change Add commentsCount inn AAll posts documents
//    for existing docs and new posts

    loadApi.subscribe(posts => {
      this.arts = posts.reverse();
      this.loading = false;
      console.log(this.arts);
    });

    // if (posts && posts.length > 0) {
    //   this.myPosts = of(posts);
    //   this.arts = posts;
    //   this.loading = false;
    //   console.log('Retrieved From Storage');
    //   // console.log(JSON.parse(posts));
    //   this.myPosts = merge(
    //     of(posts), loadApi
    //   );
    // } else {
    //   console.log('Loading Api');
    //   this.myPosts = loadApi;
    // }
    // this.myPosts = loadApi;
    // this.myPosts.subscribe(store => {
    //   this.arts.concat(store);
    //   localStorage.setItem('posts', JSON.stringify(store));
    //   // console.log(store);
    //   this.loading = false;
    // });
    // this.myPosts.subscribe(posts => {
    //   posts.forEach(post => {
    //     this.afs.collection<Comment>('Comments', ref => ref
    //       .where('pid', '==', post.pid)).snapshotChanges().subscribe(coll => {
    //       post.commentsCount = coll.length;
    //     });
    //   });
    // });
    // const postsRef: AngularFirestoreCollection<Post> = this.afs.collection('posts');
    // this.afs.collection<Post>('posts', ref => ref.limit(3)).snapshotChanges().subscribe(docs => {
    //   // Loading Posts
    //   this.allPosts = docs.map(doc => {
    //     return {
    //       pid: doc.payload.doc.id,
    //       ...doc.payload.doc.data()
    //     };
    //   });
    //
    //   // Counting Comments
    //   this.allPosts.forEach(post => {
    //     this.afs.collection<Comment>('Comments', ref => ref
    //       .where('pid', '==', post.pid)).snapshotChanges().subscribe(coll => {
    //       post.commentsCount = coll.length;
    //     });
    //   });
    // });
  }


  isValid() {
    return this.post.content !== '';
  }

  fileSelected(file: File) {
    console.log(file);
    if (file) {
      if (file.type.includes('image')) {
        if (file.size <= 5000000) {
          this.imageSelected = file;
          this.toast.success(file.name + ' of Size ' + file.size / 1000000 + 'MB will be uploaded');
          this.post.imageURL = '';
          return;
        }
        this.toast.error('File should be Less than 5 MB');
      } else {
        this.toast.error('File should be an image Type');
      }
    }
  }

  async onUpload() {
    this.uploading = true;
    try {
      if (this.imageSelected) {
        const task = await this.storage
          .upload('/Posts/' + this.auth.getOwner.displayName + this.imageSelected.name + (new Date().getTime()), this.imageSelected);
        this.post.imageURL = await task.ref.getDownloadURL();
      } else {
        delete this.post.imageURL;
      }
    } catch (e) {
      console.log('Uploading Failed');
      console.log(e);
    }
    try {
      this.afs.collection('Posts').add(this.post).then(value => {
        console.log(value);
        console.log('Post uploaded');
        this.uploading = false;
        this.resetForm();
        this.imageSelected = null;
      });
    } catch (e) {
      console.log(e);
      console.log('Database Update Failed');
    }
  }

  resetForm() {
    this.post = {
      likes: 0,
      content: '',
      owner: this.auth.getOwner
    };
  }

  loadMore() {
    console.log('Arts', this.arts);
    console.log('my Posts', this.myPosts);
  }

  openDialogBox() {
    this.matD.open(UploadPostComponent);
  }

}
