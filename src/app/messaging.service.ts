import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from './auth/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {AngularFireAuth} from '@angular/fire/auth';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private authService: AuthService,
    private angularFireDB: AngularFirestore,
    private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    );
  }

  isEnabled() {

  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    if (this.authService.isLoggedIn) {
      this.angularFireDB.collection('Tokens').doc(token).set({
        token,
        owner: this.authService.getOwner
      });
    }
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.updateToken(userId, token);
      },
      (err) => {
        alert('Browser Not Enabled for Notifications');
      }
    );
  }

  deleteToken() {

  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log('new message received. ', payload);
        this.currentMessage.next(payload);
      });
  }
}
