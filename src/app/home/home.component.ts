import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Post} from '../Types/post';
import {UserService} from '../user.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {AuthService} from '../auth.service';
import {DbService} from '../db.service';
import {Comnt} from '../Types/comnt';
import {HttpClient} from '@angular/common/http';
import {firestore} from 'firebase/app';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imageSelected: File;
  post: Post;
  uploading = false;
  uploadStatus = '';
  allStatus: Post[] = [];

  constructor(
    private  toast: ToastrService,
    private  user: UserService,
    private  storage: AngularFireStorage,
    private  snack: MatSnackBar,
    private  http: HttpClient,
    private  auth: AuthService,
    private  db: DbService,
  ) {
  }

  private _commentLabel = false;

  get commentLabel(): boolean {
    return this._commentLabel;
  }

  ngOnInit() {
    this.user.Init(this.auth.getUID());
    this.post = {
      content: '',
      likes: 0,
      owner: null
    };
    this.db.getPosts().subscribe(posts => {
      this.allStatus = posts.map(post => {
        return {
          id: post.payload.doc.id,
          ...post.payload.doc.data()
        } as Post;
      });
      this.allStatus.forEach(stat => {
        this.db.getComments(stat).subscribe(comnts => {
          stat.commentsCount = comnts.length;
          stat.comments = comnts.map(comnt => {
            return {
              id: comnt.payload.doc.id,
              ...comnt.payload.doc.data()
            } as Comnt;
          });
        });
      });
    });
  }

  fileSelected(file: File) {
    if (file) {
      if (file.type.includes('image')) {
        if (file.size <= 5000000) {
          this.imageSelected = file;
          this.toast.success(file.name + ' of Size ' + file.size / 1000000 + 'MB will be uploaded');
          this.post.imageURL = '';
          return;
        }
        this.toast.error('File should be Less than 5 MB');
      }
      this.toast.error('File should be an image Type');
    }
  }

  uid() {
    return this.user.getUID();
  }

  async onUpload() {
    this.post.owner = this.user.owner;
    try {
      this.uploading = true;
      if (this.imageSelected) {
        this.uploadStatus = 'Uploading Image..';
        const task = await this.storage.ref('/Posts/' + this.user.userData.firstName + (new Date().getTime())).put(this.imageSelected);
        this.uploadStatus = 'Fetching URL';
        this.post.imageURL = await task.ref.getDownloadURL();
      } else {
        delete this.post.imageURL;
      }
      this.uploadStatus = 'Updating Status';
      const upload = await this.db.posts().add(this.post);
      this.uploading = false;
      this.toast.success('Post Uploaded Successfully');
      this.uploadStatus = '';
      this.imageSelected = null;
    } catch (e) {
      this.uploading = false;
      this.imageSelected = null;
      this.toast.error('Error' + e);
    }
    this.resetForm();

  }

  resetForm() {
    this.post = {
      likes: 0,
      content: '',
      owner: this.user.owner
    };
  }

  isValid() {
    return this.post.content !== '';
  }

  thumbUp(stat: Post) {
    this.db.like(stat).update({
      likes: firestore.FieldValue.increment(1)
    });
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

  commentLabelToggle() {
    this._commentLabel = !this._commentLabel;
  }

  comment(stat: Post, element: HTMLInputElement) {
    const comnt: Comnt = {
      comment: element.value,
      owner: this.user.owner
    };
    element.value = '';
    this.db.comment(stat).add(comnt);
  }

  deleteComment(stat: Post, c: Comnt) {
    if (this.auth.checkUser()) {
      if (confirm('Delete Comment?...')) {
        this.db.deleteComment(stat, c.id);
        this.toast.warning('Comment Deleted');
      }
    }
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
}

