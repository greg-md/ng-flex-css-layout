import { ElementRef, Renderer2 } from '@angular/core';

export abstract class BaseDirective {
  private classNames: string[] = [];

  constructor(
    public elementRef: ElementRef,
    protected renderer: Renderer2,
  ) {
  }

  setClassNames(classNames: string[]) {
    classNames = classNames.filter((value, index, self) => self.indexOf(value) === index);

    classNames.forEach(className => this.addClassName(className));

    this.classNames
      .filter(className => classNames.indexOf(className) < 0)
      .forEach(className => this.removeClassName(className));

    this.classNames = classNames;
  }

  addClassName(className: string) {
    this.renderer.addClass(this.elementRef.nativeElement, className);
  }

  removeClassName(className: string) {
    this.renderer.removeClass(this.elementRef.nativeElement, className);
  }
}
