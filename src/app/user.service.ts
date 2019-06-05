import {Injectable} from '@angular/core';
import {UserData} from './Types/UserData';
import {AngularFirestore} from '@angular/fire/firestore';
import {Subscription} from 'rxjs';
import {Owner} from './Types/post';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private task: Subscription;

  constructor(
    private db: AngularFirestore,
  ) {
  }

  private _uid: string;

  get uid(): string {
    if (this._uid) {
      return this._uid;
    }
    return localStorage.getItem('_uid');
  }

  private _owner: Owner;

  get owner(): Owner {
    return {
      uid: localStorage.getItem('_uid'),
      name: this.userData.firstName + ' ' + this.userData.lastName,
      profileURL: this.userData.profilePicURL
    } as Owner;
  }

  private _userData: UserData;

  get userData(): UserData {
    if (this._userData) {
      return this._userData;
    } else {
      return JSON.parse(localStorage.getItem('userData'));
    }
  }

  getUID() {
    if (this._uid) {
      return this._uid;
    } else {
      return localStorage.getItem('_uid');
    }
  }

  Init(uid: string) {
    this._uid = uid;
    this.db.collection('Users').doc<UserData>(uid).valueChanges()
      .subscribe(us => {
        this._userData = us;
        localStorage.setItem('userData', JSON.stringify(us));
      });
  }

  destroy() {
    if (this.task) {
      this.task.unsubscribe();
    }
    this._userData = null;
  }

}
