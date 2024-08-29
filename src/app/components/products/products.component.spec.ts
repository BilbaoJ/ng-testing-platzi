import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ProductComponent } from '../product/product.component';
import { ProductsService } from '../../services/products.service';
import { generateManyProducts } from '../../models/product.mock';
import { defer, of } from 'rxjs';
import { ValueService } from '../../services/value.service';
import { By } from '@angular/platform-browser';

fdescribe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsService: jasmine.SpyObj<ProductsService>;
  let valueService: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductsService',['getAll']);
    const valueServiceSpy = jasmine.createSpyObj('ValueService',['getPromiseValue']);
    await TestBed.configureTestingModule({
      imports: [ProductsComponent, ProductComponent],
      providers: [
        {provide: ProductsService, useValue: productServiceSpy},
        {provide: ValueService, useValue: valueServiceSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
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

  describe('tests for callPromise', () => {
    it('should call to promise', async() => {
      const mockMsg = 'my mock message';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
      await component.callPromise();
      fixture.detectChanges();
      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
    });

    it('should show "my mock message" in <p> when button was clicked', fakeAsync(() => {
      const mockMsg = 'my mock message';
      valueService.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
      const btnDebug = fixture.debugElement.query(By.css('.btn-promise'));
      btnDebug.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();
      const pDebug = fixture.debugElement.query(By.css('p.rta'));
      expect(component.rta).toEqual(mockMsg);
      expect(valueService.getPromiseValue).toHaveBeenCalled();
      expect(pDebug.nativeElement.textContent).toEqual(mockMsg);

    }));
  });
});
