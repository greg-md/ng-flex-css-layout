import { Directive, ElementRef, OnInit, Input, Renderer2, Optional, Self, OnChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { FlexCssService } from './flex-css.service';
import { BaseDirective } from './directive';
import { LayoutDirective } from './layout.directive';

@Directive({
  selector: `
    [fcLayoutGap],
    [fcLayoutGap.xs], [fcLayoutGap.sm], [fcLayoutGap.md], [fcLayoutGap.lg], [fcLayoutGap.xl],
    [fcLayoutGap.lt-sm], [fcLayoutGap.lt-md], [fcLayoutGap.lt-lg], [fcLayoutGap.lt-xl],
    [fcLayoutGap.gt-xs], [fcLayoutGap.gt-sm], [fcLayoutGap.gt-md], [fcLayoutGap.gt-lg]
  `,
})
export class LayoutGapDirective extends BaseDirective implements OnInit, OnChanges {
  fcValues = {};

  observer$ = new ReplaySubject(1);

  @Input('fcLayoutGap')       set gap(val) { this.fcValues['none'] = val; }
  @Input('fcLayoutGap.xs')    set gapXs(val) { this.fcValues['xs'] = val; }
  @Input('fcLayoutGap.sm')    set gapSm(val) { this.fcValues['sm'] = val; }
  @Input('fcLayoutGap.md')    set gapMd(val) { this.fcValues['md'] = val; }
  @Input('fcLayoutGap.lg')    set gapLg(val) { this.fcValues['lg'] = val; }
  @Input('fcLayoutGap.xl')    set gapXl(val) { this.fcValues['xl'] = val; }

  @Input('fcLayoutGap.gt-xs') set gapGtXs(val) { this.fcValues['gt-xs'] = val; }
  @Input('fcLayoutGap.gt-sm') set gapGtSm(val) { this.fcValues['gt-sm'] = val; }
  @Input('fcLayoutGap.gt-md') set gapGtMd(val) { this.fcValues['gt-md'] = val; }
  @Input('fcLayoutGap.gt-lg') set gapGtLg(val) { this.fcValues['gt-lg'] = val; }

  @Input('fcLayoutGap.lt-sm') set gapLtSm(val) { this.fcValues['lt-sm'] = val; }
  @Input('fcLayoutGap.lt-md') set gapLtMd(val) { this.fcValues['lt-md'] = val; }
  @Input('fcLayoutGap.lt-lg') set gapLtLg(val) { this.fcValues['lt-lg'] = val; }
  @Input('fcLayoutGap.lt-xl') set gapLtXl(val) { this.fcValues['lt-xl'] = val; }

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
          this.service.addLayoutGap(this.layoutValues[layoutBreakpoint], layoutBreakpoint, this.fcValues[breakpoint], breakpoint)
        );
      });
    });

    this.setClassNames(classNames);

    this.observer$.next(this.fcValues);
  }

  dependsOnLayout() {
    if (this.layout) {
      this.layout.addNewBreakpoints(this.breakpoints);
    } else {
      this.breakpoints.forEach(breakpoint => {
        this.addClassName(this.service.addLayout('row', breakpoint));
      });
    }
  }

  get layoutValues() {
    return this.layout ? this.layout.fcValues : { none: '' };
  }

  get breakpoints() {
    return Object.keys(this.fcValues);
  }
}
