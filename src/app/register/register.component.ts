import {Component, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {User} from '../interfaces/user.model';
import {AuthService} from '../auth/auth.service';
import {snapshotChanges} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import {isSnakeCased} from 'tslint/lib/utils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  status = 'Status Field';
  selectedFile: File;
  years = [
    1, 2, 3, 4
  ];
  classes = [
    {branch: 'CSE', sections: ['A', 'B', 'C', 'D', 'E', 'F', 'G']},
    {branch: 'ECE', sections: ['A', 'B']},
    {branch: 'IT', sections: ['A']},
    {branch: 'EIE', sections: ['A']}
  ];
  selectedClass: { branch: string, sections: string[] };
  loading = false;

  constructor(
    private AfStorage: AngularFireStorage,
    private db: AngularFirestore,
    private authService: AuthService,
    private auth: AngularFireAuth,
    private route: Router,
    private snack: MatSnackBar
  ) {
    authService.authState.subscribe(change => {
      if (authService.isLoggedIn) {
        this.route.navigate(['/']);
      }
    });
  }

  public userData: User;
  faces = [
    {id: 0, img: 'assets/faces/faces-06.svg'},
    {id: 1, img: 'assets/faces/faces-01.svg'},
    {id: 2, img: 'assets/faces/faces-02.svg'},
    {id: 3, img: 'assets/faces/faces-03.svg'},
    {id: 4, img: 'assets/faces/faces-04.svg'},
    {id: 5, img: 'assets/faces/faces-05.svg'},
  ];
  selected = this.faces[0];


  ngOnInit() {
    this.userData = {
      branch: null,
      email: null,
      phone: null,
      rollNo: '',
      section: null,
      year: null,
      photoURL: this.faces[0].img,
      postCount: 0,
      displayName: null
    };
    this.selectedClass = {branch: null, sections: null};
    this.auth.authState.subscribe(user => {
        if (user) {
          this.route.navigate(['']);
          this.snack.open('Registeration Succefull', '', {
            duration: 3000
          });
        }
      }
    );
  }

  async onSubmit(email: string, pass: string) {
    this.loading = true;
    try {
      console.log('Sign Up Started');
      const credentials = await this.authService.signup(email, pass);
      console.log('Sign Up Ended');
      this.status = 'New User Created';
      console.log('Upload Task Start');
      // File Upload
      if (this.selectedFile) {
        this.status = 'Profile Pic Uploading...';
        const upload = await this.AfStorage
          .ref('profiles/' + this.userData.displayName + this.userData.rollNo + (new Date()).getTime())
          .put(this.selectedFile);


        console.log('Upload Task Finish');
        this.status = 'Profile Pic Uploaded Successfully';


        const url = await upload.ref.getDownloadURL();


        console.log('Download URL Fetched');
        this.status = 'Profile Reference Fetched';
        this.userData.photoURL = url;
      } else {  // using placeholder
        // this.userData.photoURL = 'https://firebasestorage.googleapis.com/v0/b/aakarshankmit.appspot.com' +
        //   '/o/profiles%2Fman-user-svgrepo-com.svg?alt=media&token=36e560d1-6b4f-4b21-b7ad-1ec6cdcbb83a';
        this.status = 'Using Profile Cards';
      }
      console.log('Uploading UserInfo to Database');
      this.status = 'Adding user to Database...';
      console.log(this.userData);
      this.userData.pass = pass;
      this.userData.uid = credentials.user.uid;
      await this.db.collection('Users').doc(credentials.user.uid).set(this.userData);

      this.loading = false;
      // this.route.navigate(['/login']);
    } catch (e) {
      await this.db.collection('Errors').add(e);
      alert(e);
      this.loading = false;
    }
    // this.AfStorage.ref('profiles/' + email + this.userData.rollNo).put(file);
  }

  isValid() {
    return (this.userData.year !== null && this.userData.section !== null && this.userData.branch !== null);
  }

  fileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type.includes('image')) {
        if (file.size <= 5000000) {
          this.selectedFile = file;
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.userData.photoURL = reader.result as string;
          };
        } else {
          event.target.value = null;
          alert('Image should be Less than 5 MB');
        }
      } else {
        event.target.value = null;
        alert('File should be Image');
      }
    } else {
      event.target.value = null;
      alert('File Not Found');
    }
  }

  faceSelected(face: { img: string; id: number }) {
    this.userData.photoURL = face.img;
    this.selected = face;
    this.selectedFile = null;
  }

  privacy() {
    alert('Your Email Address will be available for public');
  }
}
