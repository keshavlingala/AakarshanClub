import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {Post} from '../Types/post';
import {DbService} from '../db.service';
import {AuthService} from '../auth.service';
import {ActivatedRoute} from '@angular/router';
import {UserData} from '../Types/UserData';
import {firestore} from 'firebase/app';
import {Comnt} from '../Types/comnt';
import {AngularFireStorage} from '@angular/fire/storage';
import {ToastrService} from 'ngx-toastr';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  posts: Post[] = [];
  profile: UserData;

  constructor(
    private _user: UserService,
    private db: DbService,
    private auth: AuthService,
    private routes: ActivatedRoute,
    private snack: MatSnackBar,
    private storage: AngularFireStorage,
    private toast: ToastrService,
  ) {
  }

  private _commentLabel = false;

  get commentLabel(): boolean {
    return this._commentLabel;
  }

  get user(): UserService {
    return this._user;
  }

  async deletePost(stat: Post) {
    if (this.auth.checkUser()) {
      if (confirm('Delete Post?...')) {
        await this.storage.storage.refFromURL(stat.imageURL).delete();
        this.db.deletePost(stat);
        this.toast.warning('Post Deleted');
      }
    }
  }

  commentLabelToggle() {
    this._commentLabel = !this._commentLabel;
  }

  deleteComment(stat: Post, c: Comnt) {
    if (this.auth.checkUser()) {
      if (confirm('Delete Comment?...')) {
        this.db.deleteComment(stat, c.id);
        this.toast.warning('Comment Deleted');
      }
    }
  }

  comment(stat: Post, element: HTMLInputElement) {
    const comnt: Comnt = {
      comment: element.value,
      owner: this.user.owner
    };
    element.value = '';
    this.db.comment(stat).add(comnt);
  }

  thumbUp(stat: Post) {
    console.log(this.user.uid);
    this.db.like(stat).update({
      likes: firestore.FieldValue.increment(1)
    });
  }

  async ngOnInit() {
    this.profile = {
      branch: '', email: '',
      firstName: '',
      lastName: '',
      phone: '',
      profilePicURL: 'https://firebasestorage.googleapis.com/v0/b/aakarshankmit.appspot.com/' +
        'o/profiles%2Fman-user-svgrepo-com.svg?alt=media&token=36e560d1-6b4f-4b21-b7ad-1ec6cdcbb83a',
      rollNo: '',
      section: '',
      uid: '',
      year: 0
    };
    const params = this.routes.snapshot.params;
    const uid = params.uid;
    if (!uid) { // same profile
      this.profile = this.user.userData;
      this.db.posts(ref => ref.where('owner.uid', '==', this.user.getUID()))
        .snapshotChanges()
        .subscribe(collection => {
          this.posts = collection.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            } as Post;
          });
        });
    } else { // other profile
      this.db.getUser(params.uid).onSnapshot(udata => {
        if (udata.exists) {
          this.profile = {
            uid: params.uid,
            ...udata.data()
          } as UserData;
          this.db.posts(ref => ref.where('owner.uid', '==', this.profile.uid))
            .snapshotChanges()
            .subscribe(collection => {
              this.posts = collection.map(doc => {
                return {
                  id: doc.payload.doc.id,
                  ...doc.payload.doc.data()
                } as Post;
              });
            });
        } else {
          this.profile = {
            branch: '', email: '',
            firstName: 'User Not',
            lastName: 'Found',
            phone: 'Null',
            profilePicURL: 'https://firebasestorage.googleapis.com/v0/b/aakarshankmit.appspot.com/' +
              'o/profiles%2Fman-user-svgrepo-com.svg?alt=media&token=36e560d1-6b4f-4b21-b7ad-1ec6cdcbb83a',
            rollNo: 'Null',
            section: 'Null',
            uid: '',
            year: 0
          };
        }
      });
    }
  }

  sharestat(stat: Post) {
    const url = 'Check Post By ' + stat.owner.name + ' ' + window.location.href;
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (url));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.snack.open('Copied to Clipboard', 'Dismiss', {
      duration: 2000
    });
  }

}
