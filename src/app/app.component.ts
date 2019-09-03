import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {HttpClient} from '@angular/common/http';

declare var particlesJS: any;

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
    particlesJS.load('particles-js', 'assets/particlesjs-config.json', () => {
      console.log('callback - particles.js config loaded');
    });
  }

  get auth(): AuthService {
    return this._auth;
  }

}
