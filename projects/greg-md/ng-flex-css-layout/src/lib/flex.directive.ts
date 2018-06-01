import { Directive, ElementRef, OnInit, Input, Renderer2, Optional, Host, OnChanges, SkipSelf } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { FlexCssService } from './flex-css.service';
import { BaseDirective } from './directive';
import { LayoutDirective } from './layout.directive';

@Directive({
  selector: `
    [fcFlex],
    [fcFlex.xs], [fcFlex.sm], [fcFlex.md], [fcFlex.lg], [fcFlex.xl],
    [fcFlex.lt-sm], [fcFlex.lt-md], [fcFlex.lt-lg], [fcFlex.lt-xl],
    [fcFlex.gt-xs], [fcFlex.gt-sm], [fcFlex.gt-md], [fcFlex.gt-lg],
  `,
})
export class FlexDirective extends BaseDirective implements OnInit, OnChanges {
  fcValues = {};

  observer$ = new ReplaySubject(1);

  private layout: LayoutDirective;

  @Input() fcShrink = 1;
  @Input() fcGrow = 1;

  @Input('fcFlex')       set flex(val)     { this.fcValues['all'] = val; }
  @Input('fcFlex.xs')    set flexXs(val)   { this.fcValues['xs'] = val; }
  @Input('fcFlex.sm')    set flexSm(val)   { this.fcValues['sm'] = val; }
  @Input('fcFlex.md')    set flexMd(val)   { this.fcValues['md'] = val; }
  @Input('fcFlex.lg')    set flexLg(val)   { this.fcValues['lg'] = val; }
  @Input('fcFlex.xl')    set flexXl(val)   { this.fcValues['xl'] = val; }

  @Input('fcFlex.gt-xs') set flexGtXs(val) { this.fcValues['gt-xs'] = val; }
  @Input('fcFlex.gt-sm') set flexGtSm(val) { this.fcValues['gt-sm'] = val; }
  @Input('fcFlex.gt-md') set flexGtMd(val) { this.fcValues['gt-md'] = val; }
  @Input('fcFlex.gt-lg') set flexGtLg(val) { this.fcValues['gt-lg'] = val; }

  @Input('fcFlex.lt-sm') set flexLtSm(val) { this.fcValues['lt-sm'] = val; }
  @Input('fcFlex.lt-md') set flexLtMd(val) { this.fcValues['lt-md'] = val; }
  @Input('fcFlex.lt-lg') set flexLtLg(val) { this.fcValues['lt-lg'] = val; }
  @Input('fcFlex.lt-xl') set flexLtXl(val) { this.fcValues['lt-xl'] = val; }

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
          this.service.addFlex(
            this.layoutValues[layoutBreakpoint], layoutBreakpoint, this.fcValues[breakpoint], breakpoint, this.fcGrow, this.fcShrink
          )
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

  get layoutValues() {
    return this.layout ? this.layout.fcValues : { 'all': '' };
  }

  get parentElement() {
    return this.renderer.parentNode(this.elementRef.nativeElement);
  }

  get breakpoints() {
    return Object.keys(this.fcValues);
  }
}
