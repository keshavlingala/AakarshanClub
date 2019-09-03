import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MAT_DIALOG_DATA, MatBottomSheetRef, MatSnackBar} from '@angular/material';
import {Post} from '../home/post.model';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
})
export class ShareComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public post: Post,
    private _bottomSheetRef: MatBottomSheetRef<ShareComponent>,
    private snack: MatSnackBar
  ) {
  }

  ngOnInit() {
  }


  openLink(id: number, event: MouseEvent) {
    const url = 'https://aakarshan.web.app/post/' + this.post.pid;
    const text = 'Hey Check out the Post by ' + this.post.owner.displayName + ' \n' +
      'at Aakarshan Website \n' + url;
    // console.log(this.post);
    let shareurl = '';
    switch (id) {
      case 1:
        shareurl = 'https://api.whatsapp.com/send?text=' + text
          .replace('https:', '%0A https:');
        window.open(shareurl, '_blank');
        // console.log(shareurl);
        break;
      case 2:
        shareurl = 'tg://share';
        window.open(shareurl, '_blank');
        // console.log(shareurl);
        break;
      case 3:
        break;
    }
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (text));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this.snack.open('Copied to Clipboard', 'Dismiss', {
      duration: 2000
    });
    // console.log(url);
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
