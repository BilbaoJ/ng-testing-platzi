import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideRouter, Router, RouterLinkWithHref } from "@angular/router";
import { asyncData, clickElement, getText, mockObservable, query, queryByDirective } from "../testing";
import { routes } from "./app.routes";
import { PicPreviewComponent } from "./components/pic-preview/pic-preview.component";
import { PeopleComponent } from "./components/people/people.component";
import { OthersComponent } from "./components/others/others.component";
import { ProductsService } from "./services/products.service";
import { generateManyProducts } from "./models/product.mock";
import { AuthService } from "./services/auth.service";
import { generateOneUser } from "./models/user.mock";


describe('App integration test', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let productService: jasmine.SpyObj<ProductsService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(fakeAsync(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        PicPreviewComponent,
        PeopleComponent,
        OthersComponent
      ],
      providers: [
        provideRouter(routes),
        { provide:ProductsService, useValue: productServiceSpy},
        { provide:AuthService, useValue: authServiceSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //providers
    router = TestBed.inject(Router);
    productService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
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

  it('should render OthersComponent when clicked with session', fakeAsync(() => {
    const productsMock = generateManyProducts(10);
    productService.getAll.and.returnValue(asyncData(productsMock));
    const userMock = generateOneUser();
    authService.getUser.and.returnValue(mockObservable(userMock));
    clickElement(fixture, 'others-link', true);
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(router.url).toEqual('/others');
    const element = query(fixture, 'app-others');
    expect(element).not.toBeNull();
    const text = getText(fixture, 'products-length');
    expect(text).toContain(productsMock.length);
  }));

  it('should render OthersComponent when clicked without session', fakeAsync(() => {

    authService.getUser.and.returnValue(mockObservable(null));
    clickElement(fixture, 'others-link', true);
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(router.url).toEqual('/');
  }));

  it('should render PicoPreview when clicked', fakeAsync(() => {
    clickElement(fixture, 'pico-link', true);
    tick();
    fixture.detectChanges();
    expect(router.url).toEqual('/pico-preview');
    const element = query(fixture, 'app-pic-preview');
    expect(element).not.toBeNull();
  }));
});
