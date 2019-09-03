export class Post {
  pid?: string;
  content: string;
  imageURL?: string;
  owner: Owner;
  likes: number;
  commentsCount?: number;
  comments?: Comment[];
}

export interface Owner {
  uid: string;
  photoURL: string;
  displayName: string;
}

export interface Comment {
  id?: string;
  comment: string;
  pid: string;
  owner: Owner;
}
