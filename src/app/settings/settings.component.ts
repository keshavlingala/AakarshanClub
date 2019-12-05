import {Component, OnInit} from '@angular/core';
import {MessagingService} from '../messaging.service';
import {AuthService} from '../auth/auth.service';
import {MatSlideToggleChange, MatSnackBar} from '@angular/material';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  notifications = false;
  stayPosts = true;

  constructor(
    private msg: MessagingService,
    private auth: AuthService,
    private snack: MatSnackBar,
    private afs: AngularFirestore
  ) {
  }

  ngOnInit() {

  }


  async deleteAccount() {
    if (this.auth.isLoggedIn) {
      if (confirm('Are you Sure You want to delete your Account')) {
        if (confirm('This Cannot be Undone Are you Sure')) {
          await this.auth.deleteAccount();
          this.snack.open('Account Deleted', '', {
            duration: 3000
          });
        }
      }
    } else {
      alert('Not Logged in');
    }
  }

  checked(event: MatSlideToggleChange) {
    console.log(event.checked);
    if (event.checked) {
      this.msg.requestPermission(this.auth.getUid);
    } else {
      //  TODO Turn off notifications
    }
  }
}
