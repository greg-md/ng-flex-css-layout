import { Directive, ElementRef, Input, Renderer2, OnChanges, Optional, Self, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReplaySubject } from 'rxjs';

import { FlexCssService } from './flex-css.service';
import { BaseDirective } from './directive';
import { LayoutDirective } from './layout.directive';

const TRULY = ['true', true, 1];

export function isTrueValue(value: any) {
  return value === '' || TRULY.indexOf(value) >= 0;
}

@Directive({
  selector: `
  [fcShow],
  [fcShow.xs], [fcShow.sm], [fcShow.md], [fcShow.lg], [fcShow.xl],
  [fcShow.lt-sm], [fcShow.lt-md], [fcShow.lt-lg], [fcShow.lt-xl],
  [fcShow.gt-xs], [fcShow.gt-sm], [fcShow.gt-md], [fcShow.gt-lg],
  [fcHide],
  [fcHide.xs], [fcHide.sm], [fcHide.md], [fcHide.lg], [fcHide.xl],
  [fcHide.lt-sm], [fcHide.lt-md], [fcHide.lt-lg], [fcHide.lt-xl],
  [fcHide.gt-xs], [fcHide.gt-sm], [fcHide.gt-md], [fcHide.gt-lg]
  `,
})
export class ShowHideDirective extends BaseDirective implements OnChanges {
  readonly fcValues = {};

  readonly observer$ = new ReplaySubject(1);

  @Input() fcDisplayDefault;

  @Input('fcShow')       set show(val)  { this.fcValues['all'] = isTrueValue(val); }
  @Input('fcShow.xs')    set showXs(val) { this.fcValues['xs'] = isTrueValue(val); }
  @Input('fcShow.sm')    set showSm(val) { this.fcValues['sm'] = isTrueValue(val); }
  @Input('fcShow.md')    set showMd(val) { this.fcValues['md'] = isTrueValue(val); }
  @Input('fcShow.lg')    set showLg(val) { this.fcValues['lg'] = isTrueValue(val); }
  @Input('fcShow.xl')    set showXl(val) { this.fcValues['xl'] = isTrueValue(val); }

  @Input('fcShow.lt-sm') set showLtSm(val) { this.fcValues['lt-sm'] = isTrueValue(val); }
  @Input('fcShow.lt-md') set showLtMd(val) { this.fcValues['lt-md'] = isTrueValue(val); }
  @Input('fcShow.lt-lg') set showLtLg(val) { this.fcValues['lt-lg'] = isTrueValue(val); }
  @Input('fcShow.lt-xl') set showLtXl(val) { this.fcValues['lt-xl'] = isTrueValue(val); }

  @Input('fcShow.gt-xs') set showGtXs(val) { this.fcValues['gt-xs'] = isTrueValue(val); }
  @Input('fcShow.gt-sm') set showGtSm(val) { this.fcValues['gt-sm'] = isTrueValue(val); }
  @Input('fcShow.gt-md') set showGtMd(val) { this.fcValues['gt-md'] = isTrueValue(val); }
  @Input('fcShow.gt-lg') set showGtLg(val) { this.fcValues['gt-lg'] = isTrueValue(val); }

  @Input('fcHide')       set hide(val)  { this.fcValues['all'] = !isTrueValue(val); }
  @Input('fcHide.xs')    set hideXs(val) { this.fcValues['xs'] = !isTrueValue(val); }
  @Input('fcHide.sm')    set hideSm(val) { this.fcValues['sm'] = !isTrueValue(val); }
  @Input('fcHide.md')    set hideMd(val) { this.fcValues['md'] = !isTrueValue(val); }
  @Input('fcHide.lg')    set hideLg(val) { this.fcValues['lg'] = !isTrueValue(val); }
  @Input('fcHide.xl')    set hideXl(val) { this.fcValues['xl'] = !isTrueValue(val); }

  @Input('fcHide.lt-sm') set hideLtSm(val) { this.fcValues['lt-sm'] = !isTrueValue(val); }
  @Input('fcHide.lt-md') set hideLtMd(val) { this.fcValues['lt-md'] = !isTrueValue(val); }
  @Input('fcHide.lt-lg') set hideLtLg(val) { this.fcValues['lt-lg'] = !isTrueValue(val); }
  @Input('fcHide.lt-xl') set hideLtXl(val) { this.fcValues['lt-xl'] = !isTrueValue(val); }

  @Input('fcHide.gt-xs') set hideGtXs(val) { this.fcValues['gt-xs'] = !isTrueValue(val); }
  @Input('fcHide.gt-sm') set hideGtSm(val) { this.fcValues['gt-sm'] = !isTrueValue(val); }
  @Input('fcHide.gt-md') set hideGtMd(val) { this.fcValues['gt-md'] = !isTrueValue(val); }
  @Input('fcHide.gt-lg') set hideGtLg(val) { this.fcValues['gt-lg'] = !isTrueValue(val); }

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private service: FlexCssService,
    @Optional() @Self() private layout: LayoutDirective,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    super(elementRef, renderer);
  }

  ngOnChanges() {
    this.reload();
  }

  reload() {
    const classNames = [];

    const display = this.getDisplayStyle();

    this.breakpoints.forEach(breakpoint => {
      classNames.push(this.service.addShowHide(display, this.fcValues[breakpoint], breakpoint));
    });

    this.setClassNames(classNames);

    this.observer$.next(this.fcValues);
  }

  getDisplayStyle() {
    return this.layout ? 'flex' : (
      this.getElementStyle(this.elementRef.nativeElement, 'display')
      || this.fcDisplayDefault
      || 'block'
    );
  }

  getElementStyle(element, styleName) {
    return (element ? element.style[styleName] || element.style.getPropertyValue(styleName) : '')
      || (isPlatformBrowser(this.platformId) ? getComputedStyle(element).getPropertyValue(styleName) : '');
  }

  get breakpoints() {
    return Object.keys(this.fcValues);
  }
}
