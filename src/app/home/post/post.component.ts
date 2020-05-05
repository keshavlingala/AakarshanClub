import {Component, Input, OnInit} from '@angular/core';
import {Post} from '../post.model';
import {AuthService} from '../../auth/auth.service';
import {PostService} from '../post.service';
import {PostDetailComponent} from '../post-detail/post-detail.component';
import { MatDialog } from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  @Input() post: Post;

  constructor(
    private _auth: AuthService,
    private _pService: PostService,
    private dialog: MatDialog,
    private router: Router
  ) {

  }

  get auth(): AuthService {
    return this._auth;
  }

  get pService(): PostService {
    return this._pService;
  }

  ngOnInit() {
    // console.log(this.post);
  }

  commentMe(post: Post) {
    this.dialog.open(PostDetailComponent, {
      autoFocus: true,
      data: post,
      panelClass: 'p-0'
    });
    // this.router.navigate(['post', post.pid]);
  }

  log() {

  }
}
