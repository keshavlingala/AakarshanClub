import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Aakarshan';

  constructor(
    private _auth: AuthService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
  }

  get auth(): AuthService {
    return this._auth;
  }

}
