import {Component, OnInit} from '@angular/core';
import {DbService} from '../db.service';
import {UserService} from '../user.service';
import {Post} from '../Types/post';
import {ActivatedRoute, Router} from '@angular/router';
import {Comnt} from '../Types/comnt';
import {AuthService} from '../auth.service';
import {ToastrService} from 'ngx-toastr';
import {AngularFireStorage} from '@angular/fire/storage';
import {firestore} from 'firebase/app';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  currpost: Post;
  loading = false;

  constructor(
    private db: DbService,
    private user: UserService,
    private auth: AuthService,
    private toast: ToastrService,
    private snack: MatSnackBar,
    private storage: AngularFireStorage,
    private rout: ActivatedRoute,
    private router: Router,
  ) {
  }

  uid() {
    return this.user.getUID();
  }

  ngOnInit() {
    this.loading = true;
    this.currpost = {
      comments: [],
      commentsCount: 0,
      content: '',
      id: '',
      imageURL: '',
      likes: 0,
      owner: undefined
    };
    const parms = this.rout.snapshot.params;
    const pid = parms.pid;
    if (!pid) {
      this.router.navigate(['/']);
    }
    this.db.getPost(pid).onSnapshot(post => {
      if (post.exists) {
        this.currpost = {
          id: parms.pid,
          ...post.data()
        } as Post;
        this.db.getComments(this.currpost).subscribe(comnts => {
          this.currpost.commentsCount = comnts.length;
          this.currpost.comments = comnts.map(comnt => {
            return {
              id: comnt.payload.doc.id,
              ...comnt.payload.doc.data()
            } as Comnt;
          });
        });
        this.loading = false;
      } else {
        this.router.navigate(['/post/404']);
        this.loading = false;
      }
    });
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
}
