import { NgModule, ModuleWithProviders } from '@angular/core';

import { FlexCssService, FLEX_CSS_BREAKPOINTS, FLEX_CSS_DEFAULT_BREAKPOINTS, Breakpoint } from './flex-css.service';

import { LayoutDirective } from './layout.directive';
import { LayoutAlignDirective } from './layout-align.directive';
import { LayoutGapDirective } from './layout-gap.directive';
import { FlexDirective } from './flex.directive';
import { FlexOrderDirective } from './flex-order.directive';
import { FlexOffsetDirective } from './flex-offset.directive';
import { FlexAlignDirective } from './flex-align.directive';
import { FlexFillDirective } from './flex-fill.directive';

export interface BreakpointsFn {
  (defaultBreakpoints: Breakpoint[]): Breakpoint[];
}

@NgModule({
  declarations: [
    LayoutDirective,
    LayoutAlignDirective,
    LayoutGapDirective,

    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexAlignDirective,
    FlexFillDirective,
  ],
  exports: [
    LayoutDirective,
    LayoutAlignDirective,
    LayoutGapDirective,

    FlexDirective,
    FlexOrderDirective,
    FlexOffsetDirective,
    FlexAlignDirective,
    FlexFillDirective,
  ],
})
export class FlexCssModule {
  static forRoot(breakpoints?: Breakpoint[]|BreakpointsFn): ModuleWithProviders {
    if (typeof breakpoints === "function") {
      breakpoints = breakpoints(FLEX_CSS_DEFAULT_BREAKPOINTS);
    }

    return {
      ngModule: FlexCssModule,
      providers: [
        FlexCssService,
        {
          provide: FLEX_CSS_BREAKPOINTS,
          useValue: breakpoints || FLEX_CSS_DEFAULT_BREAKPOINTS,
        },
      ],
    };
  }
}
