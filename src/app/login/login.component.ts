import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;

  constructor(
    private AFAuth: AuthService,
    private router: Router
  ) {
    if (this.AFAuth.isLoggedIn) {
      router.navigate(['/home']);
    }
  }

  ngOnInit() {
  }

  login(mail: string, pass: string) {
    this.loading = true;
    this.AFAuth.login(mail, pass).then(res => {
      this.router.navigate(['/home']);
      this.loading = false;
    }).catch(reason => {
      alert('Reason: ' + reason);
      this.loading = false;
    });

  }
}
