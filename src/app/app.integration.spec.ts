import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { provideRouter, Router, RouterLinkWithHref } from "@angular/router";
import { clickElement, query, queryByDirective } from "../testing";

@Component({standalone: true, selector: 'app-pic-preview', template: ''})
class PicPreviewComponent {}

@Component({standalone: true, selector: 'app-people', template: ''})
class PeopleComponent {}

@Component({standalone: true, selector: 'app-others', template: ''})
class OthersComponent {}

const routes = [
  {
    path: 'pico-preview',
    component: PicPreviewComponent
  },
  {
    path: 'people',
    component: PeopleComponent
  },
  {
    path: 'others',
    component: OthersComponent
  },
]

fdescribe('App integration test', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(fakeAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        PicPreviewComponent,
        PeopleComponent,
        OthersComponent
      ],
      providers: [provideRouter(routes)],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //providers
    router = TestBed.inject(Router);
    router.initialNavigation();
    tick(); // wait while nav
    fixture.detectChanges();
  }));

  it('should create the component', () =>{
    expect(component).toBeTruthy();
  });

  it('can get RouterLinks from template', () => {
    const links = queryByDirective(fixture, RouterLinkWithHref);
    //const routerLinks = linkDes.map((de) => de.injector.get(RouterLinkWithHref));
    expect(links.length).withContext('should have 7 routerLinks').toBe(7);
  });

  it('should render OthersComponent when clicked', fakeAsync(() => {
    clickElement(fixture, 'others-link', true);
    tick();
    fixture.detectChanges();
    expect(router.url).toEqual('/others');
    const element = query(fixture, 'app-others');
    expect(element).not.toBeNull();
  }));
});
