import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[highligth]',
  standalone: true
})
export class HighligthDirective {

  @Input('highligth') bgColor = '';
  defaultColor = 'gray';

  constructor(
    private element: ElementRef
  ) {
    this.element.nativeElement.style.backgroundColor = this.defaultColor;
  }

  ngOnChanges(): void {
    this.element.nativeElement.style.backgroundColor = this.bgColor || this.defaultColor;
  }

}
