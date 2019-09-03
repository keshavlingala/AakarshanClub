import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../auth/user.model';
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
  profile: Observable<User>;
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
    let uid = '';
    this.route.params.subscribe(u => {
      uid = u.uid;
      if (uid) {
        console.log('UID Exits');
        // Load Profile
        this.profile = this.afs.collection<User>('users').doc<User>(uid).valueChanges();
        this.profile.subscribe(val => {
          if (!val) {
            console.log('No Valid User Navigating to /profile');
            this.router.navigate(['/profile']);
          }
        });
        // Load User Posts
        this.afs.collection<Post>('posts', ref => ref.where('owner.uid', '==', uid))
          .snapshotChanges()
          .subscribe(posts => {
            this.posts = posts.map(post => {
              return {
                pid: post.payload.doc.id,
                ...post.payload.doc.data()
              };
            });
          });
      } else {
        // Load Logged in User profile
        this.profile = this.afs.collection<User>('users').doc<User>(this.auth.getUid).valueChanges();
        // Load Logged in User Posts
        this.afs.collection<Post>('posts', ref => ref.where('owner.uid', '==', this.auth.getUid))
          .snapshotChanges().subscribe(posts => {
          this.posts = posts.map(post => {
            return {
              pid: post.payload.doc.id,
              ...post.payload.doc.data()
            };
          });
        });
      }
    });
  }

}
