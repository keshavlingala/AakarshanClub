import {Component, OnInit} from '@angular/core';
import {UserData} from '../Types/UserData';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
    private route: Router
  ) {
    if (authService.isLoggedIn) {
      this.route.navigate(['/home']);
    }
  }

  private _userData: UserData;

  get userData(): UserData {
    return this._userData;
  }

  ngOnInit() {
    this._userData = {
      branch: null, email: null, phone: null, rollNo: null, section: null, year: null,
      firstName: null,
      lastName: null
    };
    this.selectedClass = {branch: null, sections: null};
  }

  async onSubmit(email: string, pass: string) {
    this.loading = true;
    try {
      console.log('Sign Up Started');
      await this.authService.signup(email, pass);
      console.log('Sign Up Ended');
      this.status = 'New User Created';
      console.log('Upload Task Start');
      if (this.selectedFile && this.selectedFile.type.includes('image')) {
        this.status = 'Profile Pic Uploading...';
        const upload = await this.AfStorage
          .ref('profiles/' + this._userData.firstName + this._userData.rollNo + (new Date()).getTime())
          .put(this.selectedFile);
        console.log('Upload Task Finish');
        this.status = 'Profile Pic Uploaded Successfully';
        const url = await upload.ref.getDownloadURL();
        console.log('Download URL Fetched');
        this.status = 'Profile Reference Fetched';
        this._userData.profilePicURL = url;
      } else {
        this._userData.profilePicURL = 'https://firebasestorage.googleapis.com/v0/b/aakarshankmit.appspot.com' +
          '/o/profiles%2Fman-user-svgrepo-com.svg?alt=media&token=36e560d1-6b4f-4b21-b7ad-1ec6cdcbb83a';
        this.status = 'No File Found, Using PlaceHolder Instead';
      }
      console.log('Uploading UserInfo to Database');
      this.status = 'Adding user to Database...';
      console.log(this._userData);
      await this.db.collection('Users').doc(this.authService.getUser.uid).set(this._userData);
      console.log('Database Updated Successfully');
      this.status = 'Registration Finished Successfully';
      await setTimeout(null, 500);
      this.loading = false;
      this.route.navigate(['/login']);
    } catch (e) {
      alert(e);
      this.loading = false;
    }
    // this.AfStorage.ref('profiles/' + email + this.userData.rollNo).put(file);
  }

  isValid() {
    return (this._userData.year !== null && this._userData.section !== null && this._userData.branch !== null);
  }

  fileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      if (file.type.includes('image')) {
        if (file.size <= 5000000) {
          this.selectedFile = file;
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
}
