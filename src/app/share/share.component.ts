import {Component, Inject, OnInit} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Post} from '../home/post.model';


@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
})
export class ShareComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public post: { type: 'post' | 'profile', id: string, name: string, url: string },
    private _bottomSheetRef: MatBottomSheetRef<ShareComponent>,
    private snack: MatSnackBar
  ) {
  }

  ngOnInit() {
  }


  openLink(id: number, event: MouseEvent) {
    const url = `https://aakarshan.web.app/${this.post.type}/${this.post.id}`;
    let text;
    if (this.post.type === 'post') {
      text = 'Hey Check out the Post by ' + this.post.name + ' \n' +
        'in Aakarshan App \n';
    } else {
      text = `Hey Check out this Awesome Arts by ${this.post.name} in Aakarshan App \n`;
    }
    // console.log(this.post);
    let shareurl = '';
    switch (id) {
      case 1:
        shareurl = 'https://api.whatsapp.com/send?text=' + encodeURI(text) + encodeURI(url)
          .replace('https:', '%0A https:');
        window.open(shareurl, '_blank');
        // console.log(shareurl);
        break;
      case 2:
        shareurl = `https://telegram.me/share/url?url=${url}&text=${text}`;
        window.open(shareurl, '_blank');
        // console.log(shareurl);
        break;
      case 3:
        shareurl = `https://twitter.com/intent/tweet?text=${encodeURI(text + '\n' + url)}`;
        window.open(shareurl, '_blank');
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
