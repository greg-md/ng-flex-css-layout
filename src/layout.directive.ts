import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { FlexCssService } from './flex-css.service';
import { BaseDirective } from './directive';

@Directive({
  selector: `
    [fcLayout],
    [fcLayout.xs], [fcLayout.sm], [fcLayout.md], [fcLayout.lg], [fcLayout.xl],
    [fcLayout.lt-sm], [fcLayout.lt-md], [fcLayout.lt-lg], [fcLayout.lt-xl],
    [fcLayout.gt-xs], [fcLayout.gt-sm], [fcLayout.gt-md], [fcLayout.gt-lg]
  `,
})
export class LayoutDirective extends BaseDirective implements OnChanges {
  readonly fcValues = {};

  readonly observer$ = new ReplaySubject(1);

  @Input('fcLayout')        set layout(val)     { this.fcValues['none'] = val; }
                            // get layout()        { return this.fcValues['none']; }

  @Input('fcLayout.xs')     set layoutXs(val)   { this.fcValues['xs'] = val; }
  @Input('fcLayout.sm')     set layoutSm(val)   { this.fcValues['sm'] = val; }
  @Input('fcLayout.md')     set layoutMd(val)   { this.fcValues['md'] = val; }
  @Input('fcLayout.lg')     set layoutLg(val)   { this.fcValues['lg'] = val; }
  @Input('fcLayout.xl')     set layoutXl(val)   { this.fcValues['xl'] = val; }

  @Input('fcLayout.gt-xs')  set layoutGtXs(val) { this.fcValues['gt-xs'] = val; }
  @Input('fcLayout.gt-sm')  set layoutGtSm(val) { this.fcValues['gt-sm'] = val; }
  @Input('fcLayout.gt-md')  set layoutGtMd(val) { this.fcValues['gt-md'] = val; }
  @Input('fcLayout.gt-lg')  set layoutGtLg(val) { this.fcValues['gt-lg'] = val; }

  @Input('fcLayout.lt-sm')  set layoutLtSm(val) { this.fcValues['lt-sm'] = val; }
  @Input('fcLayout.lt-md')  set layoutLtMd(val) { this.fcValues['lt-md'] = val; }
  @Input('fcLayout.lt-lg')  set layoutLtLg(val) { this.fcValues['lt-lg'] = val; }
  @Input('fcLayout.lt-xl')  set layoutLtXl(val) { this.fcValues['lt-xl'] = val; }

  constructor(
    elementRef: ElementRef,
    renderer: Renderer2,
    private service: FlexCssService,
  ) {
    super(elementRef, renderer);
  }

  ngOnChanges() {
    this.reload();
  }

  reload() {
    const classNames = [];

    this.breakpoints.forEach(breakpoint => {
      classNames.push(this.service.addLayout(this.fcValues[breakpoint], breakpoint));
    });

    this.setClassNames(classNames);

    this.observer$.next(this.fcValues);
  }

  addNewBreakpoints(breakpoints: string[], defaultValue?) {
    breakpoints.forEach(breakpoint => {
      if (!this.fcValues[breakpoint]) {
        this.fcValues[breakpoint] = defaultValue;
      }
    });

    this.reload();
  }

  get breakpoints() {
    return Object.keys(this.fcValues);
  }
}
