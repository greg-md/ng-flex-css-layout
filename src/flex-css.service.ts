import { DOCUMENT } from '@angular/common';
import { Injectable, Inject, InjectionToken } from '@angular/core';

import { applyCssPrefixes } from './auto-prefixer';
import { validateValue, buildCSS, isFlowHorizontal } from './layout-validator';
import {
  generateLayoutClassName, normalizeLayoutAlignValue, generateLayoutAlignClassName,
  generateLayoutGapClassName, generateFlexClassName, generateFlexOrderClassName, generateFlexOffsetClassName,
  generateFlexAlignClassName, generateFlexFillClassName
} from './helpers';
import { validateBasis } from './basis-validator';

export interface Breakpoint {
  alias: string;
  media: string[];
}

export const FLEX_CSS_DEFAULT_BREAKPOINTS: Breakpoint[] = [
  { alias: 'lt-sm', media: ['screen', '(max-width: 599px)'] },
  { alias: 'xs',    media: ['screen', '(max-width: 599px)'] },
  { alias: 'gt-xs', media: ['screen', '(min-width: 600px)'] },

  { alias: 'lt-md', media: ['screen', '(max-width: 959px)'] },
  { alias: 'sm',    media: ['screen', '(min-width: 600px)', '(max-width: 959px)'] },
  { alias: 'gt-sm', media: ['screen', '(min-width: 960px)'] },

  { alias: 'lt-lg', media: ['screen', '(max-width: 1279px)'] },
  { alias: 'md',    media: ['screen', '(min-width: 960px)', '(max-width: 1279px)'] },
  { alias: 'gt-md', media: ['screen', '(min-width: 1280px)'] },

  { alias: 'lt-xl', media: ['screen', '(max-width: 1919px)'] },
  { alias: 'lg',    media: ['screen', '(min-width: 1280px)', '(max-width: 1919px)'] },
  { alias: 'gt-lg', media: ['screen', '(min-width: 1920px)'] },

  { alias: 'xl',    media: ['screen', '(min-width: 1920px)', '(max-width: 5000px)'] },
];

export const FLEX_CSS_BREAKPOINTS = new InjectionToken<string>('flex_css_breakpoints');

export type StyleDefinition = string | { [property: string]: string | number | null };

export class FlexCssStyleElement {
  public storage: { [property: string]: { [property: string]: Text } } = {};

  constructor(
    public style: HTMLStyleElement,
  ) {}
}

@Injectable()
export class FlexCssService {
  private layout: FlexCssStyleElement;

  private flex: FlexCssStyleElement;

  private fill: FlexCssStyleElement;

  constructor(
    @Inject(DOCUMENT) private doc,
    @Inject(FLEX_CSS_BREAKPOINTS) private breakpoints,
  ) {
    this.initLayout();
    this.initFlex();
    this.initFill();
  }

  initLayout() {
    const style = this.doc.createElement('style');

    style.id = 'fc-layout';

    this.doc.head.appendChild(style);

    this.layout = new FlexCssStyleElement(style);
  }

  initFlex() {
    const style = this.doc.createElement('style');

    style.id = 'fc-flex';

    this.doc.head.appendChild(style);

    this.flex = new FlexCssStyleElement(style);
  }

  initFill() {
    const style = this.doc.createElement('style');

    style.id = 'fc-fill';

    this.doc.head.appendChild(style);

    this.fill = new FlexCssStyleElement(style);
  }

  addLayout(layout: string, breakpoint: string) {
    const [direction, wrap, isInline] = validateValue(layout);

    const className = generateLayoutClassName(direction, wrap, isInline, breakpoint);

    if (!this.hasInLayoutStorage(className, breakpoint)) {
      const style = buildCSS(direction, wrap, isInline);

      this.addToLayoutStorage(className, style, breakpoint);
    }

    return className;
  }

  addLayoutAlign(layout: string, layoutBreakpoint: string, align: string, breakpoint: string): string {
    const [mainAxis, crossAxis] = normalizeLayoutAlignValue(align);

    const layoutAlignClassName = generateLayoutAlignClassName(mainAxis, crossAxis, breakpoint);

    if (!this.hasInLayoutStorage(layoutAlignClassName, breakpoint)) {
      const style = {
        'justify-content': mainAxis,
      };

      switch (crossAxis) {
        case 'baseline':
          style['align-items'] = crossAxis;
          break;
        default:
          style['align-items'] = style['align-content'] = crossAxis;
          break;
      }

      this.addToLayoutStorage(layoutAlignClassName, style, breakpoint);
    }

    if (crossAxis === 'stretch') {
      const [direction, wrap, isInline] = validateValue(layout);

      const layoutClassName = generateLayoutClassName(direction, wrap, isInline, layoutBreakpoint);

      const className = layoutAlignClassName + '.' + layoutClassName;

      if (!this.hasInLayoutStorage(className, breakpoint)) {
        const style = isFlowHorizontal(layout) ? { 'max-height': '100%' } : { 'max-width': '100%' };

        this.addToLayoutStorage(className, style, breakpoint, [layoutBreakpoint]);
      }
    }

    return layoutAlignClassName;
  }

  addLayoutGap(layout: string, layoutBreakpoint: string, value: string, breakpoint: string): string {
    value = value || '0';

    const [direction, wrap, isInline] = validateValue(layout);

    const layoutClassName = generateLayoutClassName(direction, wrap, isInline, layoutBreakpoint);

    const layoutGapClassName = generateLayoutGapClassName(value, breakpoint);

    const className = layoutGapClassName + '.' + layoutClassName + ' > *:not(:last-child)';

    if (!this.hasInLayoutStorage(className, breakpoint)) {
      const style = isFlowHorizontal(layout) ? { 'margin-right': value } : { 'margin-bottom': value };

      this.addToLayoutStorage(className, style, breakpoint, [layoutBreakpoint]);
    }

    return layoutGapClassName;
  }

  addFlex(layout: string, layoutBreakpoint: string, value: string, breakpoint: string, grow?, shrink?) {
    value = value.replace(';', '');

    let [theGrow, theShrink, theBasis] = validateBasis(value, grow, shrink);

    theGrow = (theGrow === '0') ? 0 : theGrow;
    theShrink = (theShrink === '0') ? 0 : theShrink;

    // flex-basis allows you to specify the initial/starting main-axis size of the element,
    // before anything else is computed. It can either be a percentage or an absolute value.
    // It is, however, not the breaking point for flex-grow/shrink properties
    //
    // flex-grow can be seen as this:
    //   0: Do not stretch. Either size to element's content width, or obey 'flex-basis'.
    //   1: (Default value). Stretch; will be the same size to all other flex items on
    //       the same row since they have a default value of 1.
    //   ≥2 (integer n): Stretch. Will be n times the size of other elements
    //      with 'flex-grow: 1' on the same row.

    const style = {
      'box-sizing': 'border-box',
    };

    switch (theBasis || '') {
      case '':
        style['flex'] = `${theGrow} ${theShrink} 0.000000001px`;
        break;
      case 'initial':   // default
      case 'nogrow':
        theGrow = 0;
        style['flex'] = `0 1 auto`;
        break;
      case 'grow':
        style['flex'] = `1 1 100%`;
        break;
      case 'noshrink':
        theShrink = 0;
        style['flex'] = `1 0 auto`;
        break;
      case 'auto':
        style['flex'] = `${theGrow} ${theShrink} auto`;
        break;
      case 'none':
        theGrow = 0;
        theShrink = 0;
        style['flex'] = `0 0 auto`;
        break;
      default:
        const hasCalc = String(theBasis).indexOf('calc') > -1;
        const isPercent = String(theBasis).indexOf('%') > -1 && !hasCalc;

        const isValue = hasCalc ||
          String(theBasis).indexOf('px') > -1 ||
          String(theBasis).indexOf('em') > -1 ||
          String(theBasis).indexOf('vw') > -1 ||
          String(theBasis).indexOf('vh') > -1;

        // Defaults to percentage sizing unless `px` is explicitly set
        if (!isValue && !isPercent && !isNaN(theBasis as any)) {
          theBasis = theBasis + '%';
        }

        if (theBasis === '0px') {
          theBasis = '0%';
        }

        style['flex-grow'] = `${theGrow}`;
        style['flex-shrink'] = `${theShrink}`;
        style['flex-basis'] = isValue ? `${theBasis}` : '100%';
        break;
    }

    const flexClassName = generateFlexClassName(theGrow, theShrink, theBasis, breakpoint);

    if (!this.hasInFlexStorage(flexClassName, breakpoint)) {
      this.addToFlexStorage(flexClassName, style, breakpoint);
    }

    const [direction, wrap, isInline] = validateValue(layout);

    const layoutClassName = generateLayoutClassName(direction, wrap, isInline, layoutBreakpoint);

    const className = flexClassName + '.' + layoutClassName;

    if (!this.hasInFlexStorage(className, breakpoint)) {
      const max = isFlowHorizontal(direction) ? 'max-width' : 'max-height';
      const min = isFlowHorizontal(direction) ? 'min-width' : 'min-height';

      const usingCalc = (String(theBasis).indexOf('calc') > -1) || (theBasis === 'auto');
      const isPx = String(theBasis).indexOf('px') > -1 || usingCalc;

      // make box inflexible when shrink and grow are both zero
      // should not set a min when the grow is zero
      // should not set a max when the shrink is zero
      const isFixed = !theGrow && !theShrink;

      const layoutStyle = {};

      layoutStyle[min] = (theBasis === '0%') ? 0 : isFixed || (isPx && theGrow) ? theBasis : null;
      layoutStyle[max] = (theBasis === '0%') ? 0 : isFixed || (!usingCalc && theShrink) ? theBasis : null;

      this.addToFlexStorage(className, layoutStyle, breakpoint, [layoutBreakpoint]);
    }

    return flexClassName;
  }

  addFlexOrder(order, breakpoint: string) {
    order = parseInt(order, 10);

    order = isNaN(order) ? 0 : order;

    const className = generateFlexOrderClassName(order, breakpoint);

    if (!this.hasInFlexStorage(className, breakpoint)) {
      const style = {'order': order};

      this.addToFlexStorage(className, style, breakpoint);
    }

    return className;
  }

  addFlexOffset(layout: string, layoutBreakpoint: string, offset, breakpoint: string) {
    const isPercent = String(offset).indexOf('%') > -1;
    const isPx = String(offset).indexOf('px') > -1;

    if (!isPx && !isPercent && !isNaN(offset)) {
      offset = offset + '%';
    }

    const [direction, wrap, isInline] = validateValue(layout);

    const offsetClassName = generateFlexOffsetClassName(offset, breakpoint);

    const layoutClassName = generateLayoutClassName(direction, wrap, isInline, layoutBreakpoint);

    const className = offsetClassName + '.' + layoutClassName;

    if (!this.hasInFlexStorage(className, breakpoint)) {
      const style = isFlowHorizontal(direction) ? {'margin-left': `${offset}`} : {'margin-top': `${offset}`};

      this.addToFlexStorage(className, style, breakpoint, [layoutBreakpoint]);
    }

    return offsetClassName;
  }

  addFlexAlign(align, breakpoint: string) {
    align = align || 'stretch';

    // Cross-axis
    switch (align) {
      case 'start':
        align = 'flex-start';
        break;
      case 'end':
        align = 'flex-end';
        break;
    }

    const className = generateFlexAlignClassName(align, breakpoint);

    if (!this.hasInFlexStorage(className, breakpoint)) {
      const style = {'align-self': align};

      this.addToFlexStorage(className, style, breakpoint);
    }

    return className;
  }

  addFlexFill() {
    const className = generateFlexFillClassName();

    if (!this.hasInFillStorage(className, 'none')) {
      const style = {
        'margin': 0,
        'width': '100%',
        'height': '100%',
        'min-width': '100%',
        'min-height': '100%',
      };

      this.addToFillStorage(className, style, 'none');
    }

    return className;
  }

  private hasInLayoutStorage(className: string, breakpoint: string): boolean {
    return this.hasInStorage(this.layout, className, breakpoint);
  }

  private addToLayoutStorage(className: string, style: StyleDefinition, breakpoint: string, customBreakpoints?: string[]) {
    return this.addToStorage(this.layout, className, style, breakpoint, customBreakpoints);
  }

  private hasInFlexStorage(className: string, breakpoint: string): boolean {
    return this.hasInStorage(this.flex, className, breakpoint);
  }

  private addToFlexStorage(className: string, style: StyleDefinition, breakpoint: string, customBreakpoints?: string[]) {
    return this.addToStorage(this.flex, className, style, breakpoint, customBreakpoints);
  }

  private hasInFillStorage(className: string, breakpoint: string): boolean {
    return this.hasInStorage(this.fill, className, breakpoint);
  }

  private addToFillStorage(className: string, style: StyleDefinition, breakpoint: string, customBreakpoints?: string[]) {
    return this.addToStorage(this.fill, className, style, breakpoint, customBreakpoints);
  }

  private hasInStorage(styleElement: FlexCssStyleElement, className: string, breakpoint: string): boolean {
    return !!(styleElement.storage[breakpoint] && styleElement.storage[breakpoint][className]);
  }

  private addToStorage(
    styleElement: FlexCssStyleElement, className: string, style: StyleDefinition, breakpoint: string, customBreakpoints?: string[]) {
    customBreakpoints = customBreakpoints || [];

    const styles = applyCssPrefixes(style);

    const css = this.generateCss(styles);

    if (css !== '') {
      const classCss = '.' + className + ' { ' + css + ' }';

      const cssElement = this.doc.createTextNode(this.addBreakpoints([breakpoint].concat(customBreakpoints), classCss));

      if (!styleElement.storage[breakpoint]) {
        styleElement.storage[breakpoint] = {};
      }

      styleElement.storage[breakpoint][className] = cssElement;

      this.reorderTextElements(styleElement);
    }
  }

  private reorderTextElements(styleElement: FlexCssStyleElement) {
    let position = this.reorderBreakpointElements(styleElement, 'none');

    this.breakpoints.forEach(breakpoint => {
      position = this.reorderBreakpointElements(styleElement, breakpoint.alias, position);
    });
  }

  protected reorderBreakpointElements(styleElement: FlexCssStyleElement, breakpoint: string, position: number = 0) {
    const breakpointElements = styleElement.storage[breakpoint];

    if (!breakpointElements) {
      return position;
    }

    Object.keys(breakpointElements).forEach(key => {
      if (styleElement.style.children.length) {
        styleElement.style.insertBefore(breakpointElements[key], styleElement.style.children[position]);
      } else {
        styleElement.style.appendChild(breakpointElements[key]);
      }

      ++position;
    });

    return position;
  }

  private generateCss(styles: Object) {
    const css = [];

    Object.keys(styles).sort().forEach(key => {
      const values = Array.isArray(styles[key]) ? styles[key] : [styles[key]];

      values.sort();

      values.forEach(value => {
        if (value !== null && value !== '') {
          css.push(key + ': ' + value + ';');
        }
      });
    });

    return css.join(' ');
  }

  private addBreakpoints(breakpointsAliases: string[], css: string) {
    breakpointsAliases = breakpointsAliases.filter(breakpoint => breakpoint !== 'none');

    if (!breakpointsAliases.length) {
      return css;
    }

    let theBreakpoints = [];

    this.breakpoints
      .filter(breakpoint => breakpointsAliases.indexOf(breakpoint.alias) >= 0)
      .forEach(breakpoint => theBreakpoints = theBreakpoints.concat(breakpoint.media));

    theBreakpoints = theBreakpoints.filter((value, index, self) => self.indexOf(value) === index);

    return '@media ' + theBreakpoints.join(' and ') + ' { ' + css + ' }';
  }
}
