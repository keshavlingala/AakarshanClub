export interface Post {
  doc?: any;
  pid?: string;
  content: string;
  imageURL?: string;
  fullSize?: string;
  owner: Owner;
  likes: number;
  commentsCount?: number;
  comments?: Comment[];
}

export interface Owner {
  uid: string;
  email: string;
  photoURL: string;
  displayName: string;
}

export interface Comment {
  id?: string;
  comment: string;
  pid: string;
  owner: Owner;
}
