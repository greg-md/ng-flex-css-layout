import { Directive, ElementRef, OnInit, Input, Renderer2, Optional, Host, OnChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { FlexCssService } from './flex-css.service';
import { BaseDirective } from './directive';
import { LayoutDirective } from './layout.directive';

@Directive({
  selector: `
    [fcFlexAlign],
    [fcFlexAlign.xs], [fcFlexAlign.sm], [fcFlexAlign.md], [fcFlexAlign.lg], [fcFlexAlign.xl],
    [fcFlexAlign.lt-sm], [fcFlexAlign.lt-md], [fcFlexAlign.lt-lg], [fcFlexAlign.lt-xl],
    [fcFlexAlign.gt-xs], [fcFlexAlign.gt-sm], [fcFlexAlign.gt-md], [fcFlexAlign.gt-lg]
  `,
})
export class FlexAlignDirective extends BaseDirective implements OnInit, OnChanges {
  fcValues = {};

  observer$ = new ReplaySubject(1);

  private layout: LayoutDirective;

  @Input('fcFlexAlign')       set align(val)     { this.fcValues['all'] = val; }
  @Input('fcFlexAlign.xs')    set alignXs(val)   { this.fcValues['xs'] = val; }
  @Input('fcFlexAlign.sm')    set alignSm(val)   { this.fcValues['sm'] = val; }
  @Input('fcFlexAlign.md')    set alignMd(val)   { this.fcValues['md'] = val; }
  @Input('fcFlexAlign.lg')    set alignLg(val)   { this.fcValues['lg'] = val; }
  @Input('fcFlexAlign.xl')    set alignXl(val)   { this.fcValues['xl'] = val; }

  @Input('fcFlexAlign.gt-xs') set alignGtXs(val) { this.fcValues['gt-xs'] = val; }
  @Input('fcFlexAlign.gt-sm') set alignGtSm(val) { this.fcValues['gt-sm'] = val; }
  @Input('fcFlexAlign.gt-md') set alignGtMd(val) { this.fcValues['gt-md'] = val; }
  @Input('fcFlexAlign.gt-lg') set alignGtLg(val) { this.fcValues['gt-lg'] = val; }

  @Input('fcFlexAlign.lt-sm') set alignLtSm(val) { this.fcValues['lt-sm'] = val; }
  @Input('fcFlexAlign.lt-md') set alignLtMd(val) { this.fcValues['lt-md'] = val; }
  @Input('fcFlexAlign.lt-lg') set alignLtLg(val) { this.fcValues['lt-lg'] = val; }
  @Input('fcFlexAlign.lt-xl') set alignLtXl(val) { this.fcValues['lt-xl'] = val; }

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private service: FlexCssService,
    @Optional() @Host() layout: LayoutDirective,
  ) {
    super(elementRef, renderer);

    if (layout && layout.elementRef.nativeElement === this.parentElement) {
      this.layout = layout;
    }
  }

  ngOnInit() {
    this.dependsOnParentLayout();
  }

  ngOnChanges() {
    this.reload();
  }

  reload() {
    const classNames = [];

    this.breakpoints.forEach(breakpoint => {
      classNames.push(
        this.service.addFlexAlign(this.fcValues[breakpoint], breakpoint)
      );
    });

    this.setClassNames(classNames);

    this.observer$.next(this.fcValues);
  }

  dependsOnParentLayout() {
    if (this.layout) {
      this.layout.addNewBreakpoints(this.breakpoints, 'row');
    } else {
      this.breakpoints.forEach(breakpoint => {
        this.renderer.addClass(this.parentElement, this.service.addLayout('row', breakpoint));
      });
    }
  }

  get parentElement() {
    return this.renderer.parentNode(this.elementRef.nativeElement);
  }

  get breakpoints() {
    return Object.keys(this.fcValues);
  }
}
