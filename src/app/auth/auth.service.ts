import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../interfaces/user.model';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import {auth} from 'firebase/app';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Owner} from '../home/post.model';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router,
    private  snackbar: MatSnackBar
  ) {
    // if (this.isLoggedIn) {
    //   router.navigate(['/']);
    // }this.router.navigate(['/login']).then(r => this.snackbar.open('Logged Out, Please Login again'));
    this.user$ = afAuth.authState.pipe(
      switchMap(user => {
          if (user) {
            localStorage.setItem('_uid', user.uid);
            this.afs.doc<User>(`Users/${user.uid}`).get().subscribe(userData => {
              const data = userData.data() as User;
              delete data.pass;
              localStorage.setItem('user', JSON.stringify(data));
            });
            return this.afs.doc(`Users/${user.uid}`).valueChanges();
          } else {
            localStorage.removeItem('_uid');
            return of(null);
          }
        }
      ));
    // afAuth
    afAuth.onAuthStateChanged(user => {
      if (user) {
        this.user$ = afs.doc<User>(`Users/${user.uid}`).valueChanges();
        this.user$.subscribe(local => {
          localStorage.setItem('user', JSON.stringify(local));
          localStorage.setItem('_uid', local.uid);
        });
      } else {
        localStorage.removeItem('user');
      }
    });

  }

  get authState() {
    return this.afAuth.authState;
  }

  get isLoggedIn(): boolean {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  get getUid() {
    if (this.isLoggedIn) {
      return localStorage.getItem('_uid');
    } else {
      return null;
    }
  }

  get getOwner(): Owner {
    if (this.isLoggedIn) {
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (localUser !== null) {
        const owner = localUser as Owner;
        return {
          displayName: owner.displayName,
          photoURL: owner.photoURL,
          uid: owner.uid,
          email: owner.email
        };
      } else {
        this.snackbar.open('Login to upload new post', 'Dismiss', {
          duration: 1000
        });
      }
    } else {
      this.snackbar.open('Login to upload new post', 'Dismiss', {
        duration: 1000
      });
      return null;
    }
  }

  getUser(): User {
    if (this.isLoggedIn) {
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (localUser !== null) {
        return localUser as User;
      }
    } else {
      this.snackbar.open('Login to upload new post', 'Dismiss', {
        duration: 1000
      });
      return null;
    }
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    const credentials = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credentials.user);
  }

  async signout() {
    localStorage.clear();
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  async signInWithEmail(email, pass) {
    try {
      const credentials = await this.afAuth.signInWithEmailAndPassword(email, pass);

      return this.updateUserData(credentials.user);
    } catch (e) {
      console.log(e);
      alert(e.message);
      return of(e);
    }
  }

  async signup(email: string, pass: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, pass);
  }

  async deleteAccount() {
    const currentUser = this.getUser();
    await this.afs.collection('Users').doc(currentUser.uid).delete();
    // await this.afAuth.cu.currentUser.delete();
    await this.router.navigate(['']);
    console.log('User Deleted');
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    // const data: User = {
    //   uid,
    //   email,
    //   displayName,
    //   photoURL
    // };
    return userRef.get();
  }
}
