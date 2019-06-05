import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {UserService} from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AakarshanClub';

  constructor(
    private _afAuth: AuthService,
    private router: Router,
    private user: UserService
  ) {
  }

  get afAuth(): AuthService {
    return this._afAuth;
  }

  ngOnInit(): void {
    if (!this._afAuth.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.user.Init(this._afAuth.getUID());
    }
  }

}
