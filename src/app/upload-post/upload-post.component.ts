import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Post} from '../home/post.model';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {CompressorService} from '../Advanced/compressor.service';

@Component({
  selector: 'app-upload-post',
  templateUrl: './upload-post.component.html',
  styleUrls: ['./upload-post.component.scss']
})
export class UploadPostComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private toast: ToastrService,
    private compressor: CompressorService
  ) {
  }

  imageUrl;
  post: Post;
  originalImage: File;


  ngOnInit() {

    this.post = new Post();
    console.log(this.post);
    this.imageUrl = 'assets/upload_place.png';
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.post.owner = this.authService.getOwner;
    if (!this.post.owner.displayName || !this.post.owner.photoURL || !this.post.owner.uid) {
      this.snackBar.open('Something went Wrong with the Authentication Please login Again', 'Dismiss', {
        duration: 3000
      });
      this.authService.signout().then(() => {
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

          this.compressor.compress(file).subscribe(compressedImg => {
            console.log(compressedImg);
            console.log('File Compressed', compressedImg);
            const reader = new FileReader();
            reader.readAsDataURL(compressedImg);
            reader.onload = (ref) => {
              console.log('ref', ref);
              // console.log(reader.result);
              this.imageUrl = reader.result;
            };
          });

        } else {
          this.toast.error('File should be Less than 5 MB');
        }
      } else {
        this.toast.error('File should be an image Type');
      }
    }
  }

  BugMe() {
    console.log(this.post);
  }

  upload() {

  }

  previewImage() {
    if (!this.originalImage) {
      return this.imageUrl;
    } else {
      return this.imageUrl;
    }
  }
}
