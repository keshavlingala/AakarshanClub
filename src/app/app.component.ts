import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {MessagingService} from './messaging.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Aakarshan';

  constructor(
    private _auth: AuthService,
    private http: HttpClient,
    private _msg: MessagingService
  ) {
  }

  ngOnInit(): void {

  }

  get msg(): MessagingService {
    return this._msg;
  }

  get auth(): AuthService {
    return this._auth;
  }

  update(event: any) {
    console.log(event);
  }
}
