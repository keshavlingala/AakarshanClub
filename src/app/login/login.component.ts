import {Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {__await} from 'tslib';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Post} from '../home/post.model';
import {PostService} from '../home/post.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loading = false;

  constructor(
    // public dialogRef: MatDialogRef<LoginComponent>,
    private _auth: AuthService,
    private router: Router
  ) {
    if (_auth.isLoggedIn) {
      this.router.navigate(['/']);
    }
    _auth.authState.subscribe(change => {
      if (_auth.isLoggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnInit() {
  }


  get auth(): AuthService {
    return this._auth;
  }

  async login(value: string, value2: string) {
    await this._auth.signInWithEmail(value, value2);
    this.router.navigate(['/']);
  }
}
