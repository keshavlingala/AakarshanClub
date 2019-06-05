import {Comnt} from './comnt';

export class Post {
  id?: string;
  content: string;
  imageURL?: string;
  owner: Owner;
  likes: number;
  comments?: Comnt[];
  commentsCount?: number;
}

export interface Owner {
  uid: string;
  profileURL: string;
  name: string;
}
