import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter, RouterLink } from '@angular/router';
import { queryByDirective } from '../testing';
import { DebugElement } from '@angular/core';

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let linkDes: DebugElement[];
  let routerLinks: RouterLink[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterLink,
      ],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    linkDes = queryByDirective(fixture, RouterLink);
    routerLinks = linkDes.map((de) => de.injector.get(RouterLink));
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).withContext('should have 7 routerLinks').toBe(7);
    expect(routerLinks[0].href).toBe('/');
    expect(routerLinks[1].href).toBe('/auth/register');
    expect(routerLinks[2].href).toBe('/products');
    expect(routerLinks[3].href).toBe('/others');
    expect(routerLinks[4].href).toBe('/pico-preview');
    expect(routerLinks[5].href).toBe('/people');
    expect(routerLinks[6].href).toBe('/auth/login');
  });

});
