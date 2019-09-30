import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../interfaces/user.model';
import {AuthService} from '../auth/auth.service';
import {Post} from '../home/post.model';
import {PostService} from '../home/post.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  $profile: Observable<User>;
  $posts: Observable<Post[]>;
  posts: Post[];

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private pService: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // console.log('Showing profile Compoent');
    let uid = '';
    this.route.params.subscribe(u => {
      // console.log(u);
      uid = u.uid;
      if (uid) {
        // console.log('UID Exits');
        // Load Profile
        this.$profile = this.afs.collection<User>('Users').doc<User>(uid).valueChanges();
        this.$profile.subscribe(val => {
          if (!val) {
            // console.log('No Valid User Navigating to /profile');
            this.router.navigate(['profile', '404']);
          }
        });
        // Load User Posts
        this.$posts = this.afs.collection<Post>('Posts', ref => ref.where('owner.uid', '==', uid))
          .valueChanges();
      } else {
        this.$profile = this.afs.collection<User>('Users').doc<User>(this.auth.getUid).valueChanges();
        this.$posts = this.afs.collection<Post>('Posts', ref => ref.where('owner.uid', '==', this.auth.getUid))
          .valueChanges();
      }
    });
  }

}
