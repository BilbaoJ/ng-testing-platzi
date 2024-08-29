import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ProductComponent } from '../product/product.component';
import { ProductsService } from '../../services/products.service';
import { generateManyProducts } from '../../models/product.mock';
import { defer, of } from 'rxjs';

fdescribe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductsService',['getAll']);
    await TestBed.configureTestingModule({
      imports: [ProductsComponent, ProductComponent],
      providers: [
        {provide: ProductsService, useValue: spy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    const productsMock = generateManyProducts(3);
    productsService.getAll.and.returnValue(of(productsMock));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(productsService.getAll).toHaveBeenCalled();
  });

  describe('Test for getAllProducts', () => {
    it('should return a list of products from service', () => {
      const productsMock = generateManyProducts(10);
      const countPrev = component.products.length;
      productsService.getAll.and.returnValue(of(productsMock));
      component.getAllProducts();
      fixture.detectChanges();
      expect(component.products.length).toEqual(productsMock.length + countPrev);
    });

    it('should change the status "loading" => "success"', fakeAsync(() => {
      const productsMock = generateManyProducts(10);
      productsService.getAll.and.returnValue(defer(() => Promise.resolve(productsMock)));
      component.getAllProducts();
      fixture.detectChanges();
      expect(component.status).toEqual('loading');
      tick(); // exec, obs, setTimeOut, promise
      fixture.detectChanges();
      expect(component.status).toEqual('success');
    }));

    xit('should change the status "loading" => "error"', fakeAsync(() => {
      //prueba para setTimeOut
      productsService.getAll.and.returnValue(defer(() => Promise.reject('error')));
      component.getAllProducts();
      fixture.detectChanges();
      expect(component.status).toEqual('loading');
      tick(4000); // exec, obs, setTimeOut, promise
      fixture.detectChanges();
      expect(component.status).toEqual('error');
    }));
  });
});
