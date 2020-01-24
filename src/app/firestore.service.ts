import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {BehaviorSubject, Observable} from 'rxjs';
import {Post} from './home/post.model';
import {scan, take, tap} from 'rxjs/operators';
import {User} from './interfaces/user.model';

interface QueryConfig {
  path: string;
  field: string;
  limit?: number;
  reserve?: boolean;
  prepend?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private _doneP = new BehaviorSubject(false);
  private _doneA = new BehaviorSubject(false);
  private _loadingP = new BehaviorSubject(false);
  private _loadingA = new BehaviorSubject(false);
  private _posts = new BehaviorSubject<Post[]>([]);
  private _artists = new BehaviorSubject<User[]>([]);
  postQuery: QueryConfig;
  artistQuery: QueryConfig;
  doneP: Observable<boolean> = this._doneP.asObservable();
  doneA: Observable<boolean> = this._doneA.asObservable();
  loadingP: Observable<boolean> = this._loadingP.asObservable();
  loadingA: Observable<boolean> = this._loadingA.asObservable();
  private _posts$: Observable<Post[]>;
  private _artist$: Observable<User[]>;

  get artists(): BehaviorSubject<User[]> {
    return this._artists;
  }

  constructor(
    private afs: AngularFirestore
  ) {
  }

  get posts$(): Observable<Post[]> {
    return this._posts$;
  }


  get artist$(): Observable<User[]> {
    return this._artist$;
  }

  get posts(): BehaviorSubject<Post[]> {
    return this._posts;
  }

  initPosts(field, path?, opts?) {
    this.postQuery = {
      path: 'Posts',
      field,
      limit: 6,
      prepend: false,
      reserve: true,
      ...opts
    };
    const first = this.afs.collection<Post>(this.postQuery.path, ref => {
      return ref
        .orderBy(this.postQuery.field, this.postQuery.reserve ? 'desc' : 'asc')
        .limit(this.postQuery.limit);
    });
    this.mapAndUpdateP(first);
    this._posts$ = this._posts.asObservable().pipe(
      scan((acc, value) => this.postQuery.prepend ? value.concat(acc) : acc.concat(value))
    );
  }

  initArtists(field) {
    this.artistQuery = {
      path: 'Users',
      reserve: true,
      field,
      prepend: false,
      limit: 6
    };
    const first = this.afs.collection<User>(this.artistQuery.path, ref => {
      return ref
        .orderBy(this.artistQuery.field, this.artistQuery.reserve ? 'desc' : 'asc')
        .limit(this.artistQuery.limit);
    });
    this.mapAndUpdateA(first);
    this._artist$ = this._artists.asObservable().pipe(
      scan((acc, value) => this.artistQuery.prepend ? value.concat(acc) : acc.concat(value))
    );
  }

// Mapping the new collection batch to the old batch
  private mapAndUpdateP(col: AngularFirestoreCollection<Post>) {
    if (this._doneP.value || this._loadingP.value) {
      return;
    }
    this._loadingP.next(true);
    return col.snapshotChanges().pipe(
      tap(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data();
          const doc = snap.payload.doc;
          return {...data, doc};
        });
        values = this.postQuery.prepend ? values.reverse() : values;
        // update source with new values, doneP loadingP
        this._posts.next(values);
        this._loadingP.next(false);

        // no more values, mark doneP
        if (!values.length) {
          this._doneP.next(true);
        }
      }),
      take(1)
    ).subscribe();
  }

  private mapAndUpdateA(col: AngularFirestoreCollection<User>) {
    if (this._doneA.value || this._loadingA.value) {
      return;
    }
    this._loadingA.next(true);
    return col.snapshotChanges().pipe(
      tap(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data();
          const doc = snap.payload.doc;
          return {...data, doc};
        });
        values = this.artistQuery.prepend ? values.reverse() : values;
        // update source with new values, doneP loadingP
        this._artists.next(values);
        this._loadingA.next(false);

        // no more values, mark doneP
        if (!values.length) {
          this._doneA.next(true);
        }
      }),
      take(1)
    ).subscribe();
  }

  private getPostsCursor() {
    const current = this._posts.value;
    if (current.length) {
      return this.postQuery.prepend ? current[0].doc : current[current.length - 1].doc;
    }
    return null;
  }

  private getArtistCursor() {
    const current = this._artists.value;
    if (current.length) {
      return this.artistQuery.prepend ? current[0].doc : current[current.length - 1].doc;
    }
    return null;
  }

  // More Posts
  moreP() {
    const cursor = this.getPostsCursor();
    // console.log(cursor);
    const more = this.afs.collection<Post>(this.postQuery.path, ref => {
      return ref
        .orderBy(this.postQuery.field, this.postQuery.reserve ? 'desc' : 'asc')
        .limit(this.postQuery.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdateP(more);
  }

  moreArtists() {
    const cursor = this.getArtistCursor();
    const more = this.afs.collection<User>(this.artistQuery.path, ref => {
      return ref
        .orderBy(this.artistQuery.field, this.artistQuery.reserve ? 'desc' : 'asc')
        .limit(this.artistQuery.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdateA(more);
  }
}
