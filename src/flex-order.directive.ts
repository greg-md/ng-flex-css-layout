import { Directive, ElementRef, OnInit, Input, Renderer2, Optional, Host, OnChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { FlexCssService } from './flex-css.service';
import { BaseDirective } from './directive';
import { LayoutDirective } from './layout.directive';

@Directive({
  selector: `
    [fcFlexOrder],
    [fcFlexOrder.xs], [fcFlexOrder.sm], [fcFlexOrder.md], [fcFlexOrder.lg], [fcFlexOrder.xl],
    [fcFlexOrder.lt-sm], [fcFlexOrder.lt-md], [fcFlexOrder.lt-lg], [fcFlexOrder.lt-xl],
    [fcFlexOrder.gt-xs], [fcFlexOrder.gt-sm], [fcFlexOrder.gt-md], [fcFlexOrder.gt-lg]
  `,
})
export class FlexOrderDirective extends BaseDirective implements OnInit, OnChanges {
  fcValues = {};

  observer$ = new ReplaySubject(1);

  private layout: LayoutDirective;

  @Input('fcFlexOrder')       set order(val)     { this.fcValues['all'] = val; }
  @Input('fcFlexOrder.xs')    set orderXs(val)   { this.fcValues['xs'] = val; }
  @Input('fcFlexOrder.sm')    set orderSm(val)   { this.fcValues['sm'] = val; }
  @Input('fcFlexOrder.md')    set orderMd(val)   { this.fcValues['md'] = val; }
  @Input('fcFlexOrder.lg')    set orderLg(val)   { this.fcValues['lg'] = val; }
  @Input('fcFlexOrder.xl')    set orderXl(val)   { this.fcValues['xl'] = val; }

  @Input('fcFlexOrder.gt-xs') set orderGtXs(val) { this.fcValues['gt-xs'] = val; }
  @Input('fcFlexOrder.gt-sm') set orderGtSm(val) { this.fcValues['gt-sm'] = val; }
  @Input('fcFlexOrder.gt-md') set orderGtMd(val) { this.fcValues['gt-md'] = val; }
  @Input('fcFlexOrder.gt-lg') set orderGtLg(val) { this.fcValues['gt-lg'] = val; }

  @Input('fcFlexOrder.lt-sm') set orderLtSm(val) { this.fcValues['lt-sm'] = val; }
  @Input('fcFlexOrder.lt-md') set orderLtMd(val) { this.fcValues['lt-md'] = val; }
  @Input('fcFlexOrder.lt-lg') set orderLtLg(val) { this.fcValues['lt-lg'] = val; }
  @Input('fcFlexOrder.lt-xl') set orderLtXl(val) { this.fcValues['lt-xl'] = val; }

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
        this.service.addFlexOrder(this.fcValues[breakpoint], breakpoint)
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
