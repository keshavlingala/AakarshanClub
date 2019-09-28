import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Post} from '../home/post.model';
import {Router} from '@angular/router';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {CompressorService} from '../Advanced/compressor.service';
import {PostService} from '../home/post.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-upload-post',
  templateUrl: './upload-post.component.html',
  styleUrls: ['./upload-post.component.scss']
})
export class UploadPostComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UploadPostComponent>,
    private _authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private toast: ToastrService,
    private afs: AngularFirestore,
    private compressor: CompressorService,
    private postService: PostService,
    private storage: AngularFireStorage,
  ) {
    this.post = {
      owner: _authService.getOwner,
      imageURL: '',
      likes: 0,
      content: '',
      fullSize: null,
      commentsCount: 0
    };
  }

  get authService(): AuthService {
    return this._authService;
  }

  original = false;
  status = 'Status';
  loading = false;
  previewImage;
  post: Post;
  originalImage: File;
  compressedImage: File;

  ngOnInit() {
    console.log(this.post);
    // this.previewImage = 'assets/upload.svg';
    if (!this._authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.post.owner = this._authService.getOwner;
    if (!this.post.owner.displayName || !this.post.owner.photoURL || !this.post.owner.uid) {
      this.snackBar.open('Something went Wrong with the Authentication Please login Again', 'Dismiss', {
        duration: 3000
      });
      this._authService.signout().then(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  fileSelected(event) {
    const file = event.target.files[0];
    console.log('original img', file);
    if (file) {
      if (file.type.includes('image')) {
        if (file.size <= 5000000) {
          this.originalImage = file;
          this.post.imageURL = '';
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.previewImage = reader.result;
          };
          this.compressor.compress(file).subscribe(compressedImg => {
            this.compressedImage = compressedImg;
          });
        } else {
          this.toast.error('File should be Less than 5 MB');
        }
      } else {
        this.toast.error('File should be an image Type');
      }
    } else {
      this.originalImage = null;
      this.compressedImage = null;
      this.previewImage = null;
    }
  }


  BugMe() {
    console.log(this.post);
    console.log(this.original ? 'True' : 'False');
    console.log(this.originalImage);
    console.log(this.compressedImage);
  }

  everythingIsCool() {
    return true;
  }

  async onUpload() {
    if (this.everythingIsCool()) {
      this.loading = true;
      this.status = 'Generating Thumbnail';
      const compressTask = await this.storage.upload('/Posts/' + '@thumb' + this.post.content +
        this._authService.getOwner.displayName + (new Date()).getTime(), this.compressedImage, {
        contentType: this.originalImage.type
      });
      if (this.original) {
        this.status = 'Uploading High Quality Image';
        const fullTask = await this.storage.upload('/Posts/' + '@original' + this.post.content +
          this._authService.getOwner.displayName + (new Date()).getTime(), this.originalImage, {
          contentType: this.originalImage.type
        });
        this.status = 'Generating URLs';
        this.post.fullSize = await fullTask.ref.getDownloadURL();
      }
      this.post.imageURL = await compressTask.ref.getDownloadURL();
      this.status = 'Adding Post to DataBase';
      const docRef = await this.afs.collection('Posts').add(this.post);
      this.status = 'Upading Meta Data';
      await docRef.update({
        pid: docRef.id,
        timeStamp: new Date(),
        fileMetaData: {
          size: this.originalImage.size,
          compressedSize: this.compressedImage.size,
          fileName: this.originalImage.name,
          fileType: this.originalImage.type,
          lastModified: this.originalImage.lastModified
        }
      });
      this.loading = false;
      await delay(4000);
      this.dialogRef.close();

      // this.postService.uploadPost(this.compressedImage, this.originalImage, this.post);
      // if (false) {
      //   alert('Post Uploading Failed check the console\ ' +
      //     'window for more information,' +
      //     ' Please Report the problem in Reports Section that would be Great Help \n Thanks');
      // }
    }
  }

}
