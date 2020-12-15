import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from './auth/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private authService: AuthService,
    private angularFireDB: AngularFirestore,
    private snack: MatSnackBar,
    private angularFireMessaging: AngularFireMessaging) {
    // this.angularFireMessaging.messages.subscribe(
    //   (_messaging) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    // );
  }

  isEnabled() {

  }

  async updateToken(userId, token) {
    // we can change this function to request our backend service
    if (this.authService.isLoggedIn) {
      await this.angularFireDB.collection('Tokens').doc(token).set({
        token,
        owner: this.authService.getOwner
      });
      this.snack.open('Notifications Enabled', '', {
        duration: 1000,
        verticalPosition: 'bottom'
      });
    } else {
      await this.angularFireDB.collection('Tokens').doc(token).set({
        token,
        owner: null
      });
      this.snack.open('Notifications Enabled', '', {
        duration: 500
      });
    }
    console.log('Notifications Token Updated');
  }

  async requestPermission(userId) {
    console.log('Requested');
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.updateToken(userId, token);
      },
      (err) => {
        alert('Browser Not Enabled for Notifications');
      }
    );
  }

  deleteToken() {

  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        // console.log('new message received. ', payload);
        this.currentMessage.next(payload);
      });
  }
}
