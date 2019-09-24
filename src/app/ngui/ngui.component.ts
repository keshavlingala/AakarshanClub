import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output, PLATFORM_ID,
  Renderer2,
  TemplateRef
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-ngui',
  template: `
      <ng-container *ngIf="inView" [ngTemplateOutlet]="template">
      </ng-container>
  `,
  styles: [':host {display: block;}']
})
export class NguiComponent implements OnInit, OnDestroy {
  observer: IntersectionObserver;
  inView = false;
  once50PctVisible = false;

  @ContentChild(TemplateRef, {
    static: false
  }) template: TemplateRef<any>;
  @Input() options: any = {threshold: [.1, .2, .3, .4, .5, .6, .7, .8]};
  @Output() inView$: EventEmitter<any> = new EventEmitter();
  @Output() notInView$: EventEmitter<any> = new EventEmitter();

  constructor(
    public element: ElementRef,
    public renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(this.handleIntersect.bind(this), this.options);
      this.observer.observe(this.element.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }

  handleIntersect(entries, observer): void {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        this.inView = true;
        this.inView$.emit(entry);
      } else {
        this.notInView$.emit(entry);
      }
    });
  }
}
