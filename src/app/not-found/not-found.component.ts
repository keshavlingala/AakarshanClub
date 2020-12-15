import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
  window: Window;

  constructor(
    public route: ActivatedRoute
  ) {
  }

  get isProfile(): boolean {
    return window.location.href.includes('profile');
  }

  ngOnInit() {
  }

}
