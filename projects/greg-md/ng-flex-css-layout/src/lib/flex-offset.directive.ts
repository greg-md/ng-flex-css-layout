import { Directive, ElementRef, OnInit, Input, Renderer2, Optional, Host, OnChanges, SkipSelf } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { FlexCssService } from './flex-css.service';
import { BaseDirective } from './directive';
import { LayoutDirective } from './layout.directive';

@Directive({
  selector: `
    [fcFlexOffset],
    [fcFlexOffset.xs], [fcFlexOffset.sm], [fcFlexOffset.md], [fcFlexOffset.lg], [fcFlexOffset.xl],
    [fcFlexOffset.lt-sm], [fcFlexOffset.lt-md], [fcFlexOffset.lt-lg], [fcFlexOffset.lt-xl],
    [fcFlexOffset.gt-xs], [fcFlexOffset.gt-sm], [fcFlexOffset.gt-md], [fcFlexOffset.gt-lg]
  `,
})
export class FlexOffsetDirective extends BaseDirective implements OnInit, OnChanges {
  fcValues = {};

  observer$ = new ReplaySubject(1);

  private layout: LayoutDirective;

  @Input('fcFlexOffset')       set offset(val)     { this.fcValues['all'] = val; }
  @Input('fcFlexOffset.xs')    set offsetXs(val)   { this.fcValues['xs'] = val; }
  @Input('fcFlexOffset.sm')    set offsetSm(val)   { this.fcValues['sm'] = val; }
  @Input('fcFlexOffset.md')    set offsetMd(val)   { this.fcValues['md'] = val; }
  @Input('fcFlexOffset.lg')    set offsetLg(val)   { this.fcValues['lg'] = val; }
  @Input('fcFlexOffset.xl')    set offsetXl(val)   { this.fcValues['xl'] = val; }

  @Input('fcFlexOffset.gt-xs') set offsetGtXs(val) { this.fcValues['gt-xs'] = val; }
  @Input('fcFlexOffset.gt-sm') set offsetGtSm(val) { this.fcValues['gt-sm'] = val; }
  @Input('fcFlexOffset.gt-md') set offsetGtMd(val) { this.fcValues['gt-md'] = val; }
  @Input('fcFlexOffset.gt-lg') set offsetGtLg(val) { this.fcValues['gt-lg'] = val; }

  @Input('fcFlexOffset.lt-sm') set offsetLtSm(val) { this.fcValues['lt-sm'] = val; }
  @Input('fcFlexOffset.lt-md') set offsetLtMd(val) { this.fcValues['lt-md'] = val; }
  @Input('fcFlexOffset.lt-lg') set offsetLtLg(val) { this.fcValues['lt-lg'] = val; }
  @Input('fcFlexOffset.lt-xl') set offsetLtXl(val) { this.fcValues['lt-xl'] = val; }

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private service: FlexCssService,
    @Optional() @Host() @SkipSelf() layout: LayoutDirective,
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
      Object.keys(this.layoutValues).forEach(layoutBreakpoint => {
        classNames.push(
          this.service.addFlexOffset(this.layoutValues[layoutBreakpoint], layoutBreakpoint, this.fcValues[breakpoint], breakpoint)
        );
      });
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

  get layoutValues() {
    return this.layout ? this.layout.fcValues : { 'all': '' };
  }

  get breakpoints() {
    return Object.keys(this.fcValues);
  }
}
