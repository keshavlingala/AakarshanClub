import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UploadPostComponent} from '../upload-post/upload-post.component';
import {MessagingService} from '../messaging.service';
import {FirestoreService} from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  // post: Post;
  // myPosts: Observable<Post[]>;
  // arts: Post[] = [];
  // uploading: boolean;
  // imageSelected: File;
  // loading: boolean;
  // $artists: Observable<User[]>;
  // artists: User[];
  // query: QueryFn = (ref) => {
  //   return ref.orderBy('timeStamp', 'desc').limit(9);
  // }

  constructor(
    private _auth: AuthService,
    private afs: AngularFirestore,
    private snack: MatSnackBar,
    private matD: MatDialog,
    private _msg: MessagingService,
    private _store: FirestoreService
  ) {
  }

  get auth(): AuthService {
    return this._auth;
  }

  get msg(): MessagingService {
    return this._msg;
  }

  get store(): FirestoreService {
    return this._store;
  }

  async ngOnInit() {
    this._store.initPosts('timeStamp');
    this._store.initArtists('postCount',);

    // console.log(this._store.posts.value);
    // const posts = JSON.parse(localStorage.getItem('posts')) as Post[];
    // this.showing = posts.length;
    // this.afs.collection<Post>('Posts', this.query).valueChanges().subscribe(posts => {
    //   this.arts = posts;
    //   this.loading = false;
    // });
    // this.myPosts.pipe(
    //   last(),
    //   map(docs => docs[0])
    // );
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


  // isValid() {
  //   return this.post.content !== '';
  // }


  // async onUpload() {
  //   this.uploading = true;
  //   try {
  //     if (this.imageSelected) {
  //       const task = await this.storage
  //         .upload('/Posts/' + this.auth.getOwner.displayName + this.imageSelected.name + (new Date().getTime()), this.imageSelected);
  //       this.post.imageURL = await task.ref.getDownloadURL();
  //     } else {
  //       delete this.post.imageURL;
  //     }
  //   } catch (e) {
  //     console.log('Uploading Failed');
  //     console.log(e);
  //   }
  //   try {
  //     this.afs.collection('Posts').add(this.post).then(value => {
  //       console.log(value);
  //       console.log('Post uploaded');
  //       this.uploading = false;
  //       this.resetForm();
  //       this.imageSelected = null;
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     console.log('Database Update Failed');
  //   }
  // }

  // resetForm() {
  //   this.post = {
  //     likes: 0,
  //     content: '',
  //     owner: this.auth.getOwner
  //   };
  // }

  // loadMore() {
  //   // this.myPosts = this.afs.collection<Post>('Posts', ref => ref);
  // }

  openDialogBox() {
    this.matD.open(UploadPostComponent);
  }


  homeScrolled(event: any) {
    // console.log(event);
    if (event === 'bottom') {
      this._store.moreP();
    }
  }

  artistScrolled(event: any) {
    if (event === 'bottom') {
      this._store.moreArtists();
    }
  }
}
