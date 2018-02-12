export function normalizeLayoutAlignValue(align: string) {
  align = align || 'start stretch';

  let [mainAxis, crossAxis] = align.split(' ');

  switch (mainAxis) {
    case 'center':
    case 'space-around':
    case 'space-between':
    case 'space-evenly':
      break;
    case 'end':
    case 'flex-end':
      mainAxis = 'flex-end';
      break;
    case 'start':
    case 'flex-start':
    default :
      mainAxis = 'flex-start';  // default main axis
      break;
  }

  switch (crossAxis) {
    case 'start':
    case 'flex-start':
      crossAxis = 'flex-start';
      break;
    case 'baseline':
    case 'center':
      crossAxis = 'center';
      break;
    case 'end':
    case 'flex-end':
      crossAxis = 'flex-end';
      break;
    case 'stretch':
    default : // 'stretch'
      crossAxis = 'stretch';   // default cross axis
      break;
  }

  return [mainAxis, crossAxis];
}

export function generateLayoutClassName(direction: string, wrap: string, isInline: boolean, breakpoint: string) {
  return 'fcLayout'
    + (breakpoint !== 'none' ? '--' + breakpoint : '')
    + '--' + direction + (wrap ? '-' + wrap : '') + (isInline ? '-inline' : '');
}

export function generateLayoutAlignClassName(mainAxis: string, crossAxis: string, breakpoint: string) {
  return 'fcLayoutAlign'
    + (breakpoint !== 'none' ? '--' + breakpoint : '')
    + '--' + mainAxis + '-' + crossAxis;
}

export function generateLayoutGapClassName(value: string, breakpoint: string) {
  return 'fcLayoutGap'
    + (breakpoint !== 'none' ? '--' + breakpoint : '')
    + '--' + valueToClassName(value);
}

export function generateFlexClassName(grow, shrink, basis, breakpoint: string) {
  return 'fcFlex'
    + (breakpoint !== 'none' ? '--' + breakpoint : '')
    + '--' + valueToClassName(grow) + '-' + valueToClassName(shrink) + (basis ? '-' + valueToClassName(basis) : '');
}

export function generateFlexOrderClassName(order, breakpoint: string) {
  return 'fcFlexOrder'
    + (breakpoint !== 'none' ? '--' + breakpoint : '')
    + '--' + valueToClassName(order);
}

export function generateFlexOffsetClassName(offset, breakpoint: string) {
  return 'fcFlexOffset'
    + (breakpoint !== 'none' ? '--' + breakpoint : '')
    + '--' + valueToClassName(offset);
}

export function generateFlexAlignClassName(align, breakpoint: string) {
  return 'fcFlexAlign'
    + (breakpoint !== 'none' ? '--' + breakpoint : '')
    + '--' + valueToClassName(align);
}

export function generateFlexFillClassName() {
  return 'fcFlexFill';
}

export function valueToClassName(value) {
  return String(value)
    .replace('%', 'p')
    .replace(' ', '');
}
