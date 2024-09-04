import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideLocationMocks, SpyLocation } from '@angular/common/testing';
import { ProductDetailComponent } from './product-detail.component';
import { provideRouter } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { Location } from '@angular/common';
import { generateOneProduct } from '../../../models/product.mock';
import { asyncData, getText, mockObservable } from '../../../../testing';

fdescribe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let productsService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', ['getOne']);
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy},
        { provide: Location, useClass: SpyLocation},
        provideRouter([
        {
          path: 'products/:id',
          component: ProductDetailComponent
        },
      ]),
      provideLocationMocks(),
    ],
    })
    .compileComponents();
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    const location = TestBed.inject(Location) as SpyLocation;
  });

  it('should create', async() => {
    const harness = await RouterTestingHarness.create();
    const productMock = {
      ...generateOneProduct(),
      id: '1'
    };
    productsService.getOne.and.returnValue(mockObservable(productMock));
    component = await harness.navigateByUrl('products/1', ProductDetailComponent);
    expect(component).toBeTruthy();
  });

  it('should render the product', async() => {
    const harness = await RouterTestingHarness.create();
    const productMock = {
      ...generateOneProduct(),
      id: '2'
    };
    productsService.getOne.and.returnValue(mockObservable(productMock));
    component = await harness.navigateByUrl('products/2', ProductDetailComponent);
    const titleText = getText(harness.fixture, 'title');
    const priceText = getText(harness.fixture, 'price');
    expect(titleText).toContain(productMock.title);
    expect(priceText).toContain(productMock.price);
    expect(productsService.getOne).toHaveBeenCalledWith('2');
  });

  it('should go back without id param', async() => {
    const location = TestBed.inject(Location) as SpyLocation;
    spyOn(location, 'back');
    const harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('products/', ProductDetailComponent);
    //location.back.and.callThrough();
    harness.fixture.detectChanges();
    expect(location.back).toHaveBeenCalled();
  });

  xit('should change the status "loading" => "success"', fakeAsync(async() => {
    const harness = await RouterTestingHarness.create();
    const productMock = {
      ...generateOneProduct(),
      id: '2'
    };
    productsService.getOne.and.returnValue(asyncData(productMock));
    expect(component.status).toEqual('loading');
    component = await harness.navigateByUrl('products/2', ProductDetailComponent);
    tick();
    harness.fixture.detectChanges();
    expect(component.status).toEqual('success');
  }));
});
