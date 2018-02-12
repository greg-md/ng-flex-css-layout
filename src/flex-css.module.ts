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

export type BreakpointsFn = (defaultBreakpoints: Breakpoint[]) => Breakpoint[];

export function customizeBreakPoints(breakpoints: Breakpoint[]|BreakpointsFn) {
  if (typeof breakpoints === 'function') {
    breakpoints = breakpoints(FLEX_CSS_DEFAULT_BREAKPOINTS);
  }

  return breakpoints || FLEX_CSS_DEFAULT_BREAKPOINTS;
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
    return {
      ngModule: FlexCssModule,
      providers: [
        FlexCssService,
        {
          provide: 'flex_css_module_breakpoints',
          useValue: breakpoints,
        },
        {
          provide: FLEX_CSS_BREAKPOINTS,
          useFactory: customizeBreakPoints,
          deps: ['flex_css_module_breakpoints']
        },
      ],
    };
  }
}
