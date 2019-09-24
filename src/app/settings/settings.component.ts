import {Component, OnInit} from '@angular/core';
import {MessagingService} from '../messaging.service';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private msg: MessagingService,
    private auth: AuthService,
  ) {
  }

  ngOnInit() {

  }


}
