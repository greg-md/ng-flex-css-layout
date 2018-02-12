import { Directive, ElementRef, OnInit, Renderer2, Optional, Host } from '@angular/core';

import { FlexCssService } from './flex-css.service';
import { BaseDirective } from './directive';
import { LayoutDirective } from './layout.directive';

@Directive({
  selector: `
    [fcFill],
    [fcFlexFill]
  `,
})
export class FlexFillDirective extends BaseDirective implements OnInit {
  private layout: LayoutDirective;

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

    this.service.addFlexFill();
  }

  dependsOnParentLayout() {
    if (this.layout) {
      this.layout.addNewBreakpoints(['none'], 'row');
    } else {
      this.renderer.addClass(this.parentElement, this.service.addLayout('row', 'none'));
    }
  }

  get parentElement() {
    return this.renderer.parentNode(this.elementRef.nativeElement);
  }
}
