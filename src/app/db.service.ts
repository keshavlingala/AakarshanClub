import {Injectable} from '@angular/core';
import {AngularFirestore, QueryFn} from '@angular/fire/firestore';
import {Post} from './Types/post';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
    private _store: AngularFirestore
  ) {
  }

  get store(): AngularFirestore {
    return this._store;
  }

  getUser(uid: string) {
    return this.store.collection('Users').doc(uid).ref;
  }

  getPost(pid: string) {
    return this.store.collection('Posts').doc(pid).ref;
  }

  getPosts() {
    return this._store.collection('Posts').snapshotChanges();
  }

  getComments(post: Post) {
    return this._store.collection('Posts').doc(post.id).collection('Comments').snapshotChanges();
  }

  getLikes(post: Post) {
    return this._store.collection('Posts').doc(post.id).collection('Likes').snapshotChanges();
  }

  posts(query?: QueryFn) {
    if (query) {
      return this._store.collection('Posts', query);
    }
    return this._store.collection('Posts');
  }

  like(post: Post) {
    return this._store.collection('Posts').doc(post.id);
  }

  comment(post: Post) {
    return this._store.collection('Posts').doc(post.id).collection('Comments');
  }

  deleteComment(post, cid) {
    return this._store.collection('Posts').doc(post.id)
      .collection('Comments').doc(cid).delete();
  }

  deletePost(stat: Post) {
    return this._store.collection('Posts').doc(stat.id).delete();
  }
}
