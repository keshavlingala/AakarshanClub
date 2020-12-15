import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-login',
  templateUrl: './pop-login.component.html',
})
export class PopLoginComponent implements OnInit {

  loading = false;

  constructor(
    public dialogRef: MatDialogRef<PopLoginComponent>,
    private _auth: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
  }


  get auth(): AuthService {
    return this._auth;
  }

  login(value: string, value2: string) {
    this._auth.signInWithEmail(value, value2).then(() => {
      this.dialogRef.close();
    });

  }
}
