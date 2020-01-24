import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../interfaces/user.model';
import {PostService} from '../post.service';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html'
})
export class ArtistCardComponent implements OnInit {
  @Input() artist: User;

  constructor(
    private pService: PostService
  ) {
  }

  ngOnInit() {

  }

  mail(url: string) {
    console.log(url);
    window.open(url, '_blank');
  }

  share() {
    this.pService.sharePost({type: 'profile', id: this.artist.uid, name: this.artist.displayName, url: this.artist.photoURL});
  }
}
