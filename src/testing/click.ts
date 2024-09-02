import { ComponentFixture } from "@angular/core/testing";
import { query, queryById } from "./finders";
import { DebugElement } from "@angular/core";

export function clickEvent<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  withTestId: boolean = false,
  event: unknown = null) {
  let element: DebugElement;
  if (withTestId) {
    element = queryById(fixture, selector);
  }else{
    element = query(fixture, selector);
  }
  element.triggerEventHandler('click', event);
}

export function clickElement<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  withTestId: boolean = false) {
  let elementebug: DebugElement;
  if (withTestId) {
    elementebug = queryById(fixture, selector);
  }else{
    elementebug = query(fixture, selector);
  }
  const element: HTMLElement = elementebug.nativeElement;
  element.click();
}
