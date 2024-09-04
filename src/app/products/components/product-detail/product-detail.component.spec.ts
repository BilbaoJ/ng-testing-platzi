import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { ProductDetailComponent } from './product-detail.component';
import { provideRouter } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { Location } from '@angular/common';
import { generateOneProduct } from '../../../models/product.mock';
import { getText, mockObservable } from '../../../../testing';

fdescribe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let productsService: jasmine.SpyObj<ProductsService>;
  let location: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService', ['getOne']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ProductsService, useValue: productServiceSpy},
        { provide: Location, useValue: locationSpy},
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
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
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


});
