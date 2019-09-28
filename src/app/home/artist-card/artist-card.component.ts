import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../interfaces/user.model';

@Component({
  selector: 'app-artist-card',
  templateUrl: './artist-card.component.html'
})
export class ArtistCardComponent implements OnInit {
  @Input() artist: User;

  constructor() {
  }

  ngOnInit() {

  }

  mail(url: string) {
    console.log(url);
    window.open(url, '_blank');
  }
}
