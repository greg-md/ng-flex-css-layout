import { Directive, ElementRef, OnInit, Input, Renderer2, Optional, Self, OnChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { FlexCssService } from './flex-css.service';
import { BaseDirective } from './directive';
import { LayoutDirective } from './layout.directive';

@Directive({
  selector: `
    [fcLayoutAlign],
    [fcLayoutAlign.xs], [fcLayoutAlign.sm], [fcLayoutAlign.md], [fcLayoutAlign.lg],[fcLayoutAlign.xl],
    [fcLayoutAlign.lt-sm], [fcLayoutAlign.lt-md], [fcLayoutAlign.lt-lg], [fcLayoutAlign.lt-xl],
    [fcLayoutAlign.gt-xs], [fcLayoutAlign.gt-sm], [fcLayoutAlign.gt-md], [fcLayoutAlign.gt-lg]
  `,
})
export class LayoutAlignDirective extends BaseDirective implements OnInit, OnChanges {
  fcValues = {};

  observer$ = new ReplaySubject(1);

  @Input('fcLayoutAlign')       set align(val)     { this.fcValues['all'] = val; }
  @Input('fcLayoutAlign.xs')    set alignXs(val)   { this.fcValues['xs'] = val; }
  @Input('fcLayoutAlign.sm')    set alignSm(val)   { this.fcValues['sm'] = val; }
  @Input('fcLayoutAlign.md')    set alignMd(val)   { this.fcValues['md'] = val; }
  @Input('fcLayoutAlign.lg')    set alignLg(val)   { this.fcValues['lg'] = val; }
  @Input('fcLayoutAlign.xl')    set alignXl(val)   { this.fcValues['xl'] = val; }

  @Input('fcLayoutAlign.gt-xs') set alignGtXs(val) { this.fcValues['gt-xs'] = val; }
  @Input('fcLayoutAlign.gt-sm') set alignGtSm(val) { this.fcValues['gt-sm'] = val; }
  @Input('fcLayoutAlign.gt-md') set alignGtMd(val) { this.fcValues['gt-md'] = val; }
  @Input('fcLayoutAlign.gt-lg') set alignGtLg(val) { this.fcValues['gt-lg'] = val; }

  @Input('fcLayoutAlign.lt-sm') set alignLtSm(val) { this.fcValues['lt-sm'] = val; }
  @Input('fcLayoutAlign.lt-md') set alignLtMd(val) { this.fcValues['lt-md'] = val; }
  @Input('fcLayoutAlign.lt-lg') set alignLtLg(val) { this.fcValues['lt-lg'] = val; }
  @Input('fcLayoutAlign.lt-xl') set alignLtXl(val) { this.fcValues['lt-xl'] = val; }

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private service: FlexCssService,
    @Optional() @Self() private layout: LayoutDirective,
  ) {
    super(elementRef, renderer);
  }

  ngOnInit() {
    this.dependsOnLayout();
  }

  ngOnChanges() {
    this.reload();
  }

  reload() {
    const classNames = [];

    this.breakpoints.forEach(breakpoint => {
      Object.keys(this.layoutValues).forEach(layoutBreakpoint => {
        classNames.push(
          this.service.addLayoutAlign(this.layoutValues[layoutBreakpoint], layoutBreakpoint, this.fcValues[breakpoint], breakpoint)
        );
      });
    });

    this.setClassNames(classNames);

    this.observer$.next(this.fcValues);
  }

  dependsOnLayout() {
    if (this.layout) {
      this.layout.addNewBreakpoints(this.breakpoints, 'row');
    } else {
      this.breakpoints.forEach(breakpoint => {
        this.addClassName(this.service.addLayout('row', breakpoint));
      });
    }
  }

  get layoutValues() {
    return this.layout ? this.layout.fcValues : { 'all': '' };
  }

  get breakpoints() {
    return Object.keys(this.fcValues);
  }
}
