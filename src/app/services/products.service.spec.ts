import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { environment } from '../../environments/environment';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';

fdescribe('ProductsService', () => {
  let productsService: ProductsService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    productsService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(productsService).toBeTruthy();
  });

  describe('tests for getAllSimple', () => {
    it('should return a product list', (doneFn) =>{
      const mockData: Product[] = generateManyProducts(2);

      productsService.getAllSimple()
      .subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });

  describe('tests for getAll', () => {
    it('should return a product list', (doneFn) =>{
      const mockData: Product[] = generateManyProducts(4);

      productsService.getAll()
      .subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should return product list with taxes', (doneFn) => {
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100,
        },
        {
          ...generateOneProduct(),
          price: 200,
        },
        {
          ...generateOneProduct(),
          price: 0,
        },
        {
          ...generateOneProduct(),
          price: -100,
        }
      ];

      productsService.getAll()
      .subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        expect(data[0].taxes).toEqual(19);
        expect(data[1].taxes).toEqual(38);
        expect(data[2].taxes).toEqual(0);
        expect(data[3].taxes).toEqual(0);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should send query params with limit 10 and offset 2', (doneFn) =>{
      const mockData: Product[] = generateManyProducts(4);
      const limit = 10;
      const offset = 2;

      productsService.getAll(limit, offset)
      .subscribe((data) => {
        expect(data.length).toEqual(mockData.length);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
      req.flush(mockData);
    });
  });

  describe('tests for create', () => {
    it('should return a new product', (dataFn) => {
      const mockData: Product = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new product',
        price: 100,
        images: ['img'],
        description: 'bla bla',
        categoryId: 12
      };
      productsService.create({...dto})
      .subscribe(data => {
        expect(data).toEqual(mockData);
        dataFn();
      });

      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
      req.flush(mockData);
    })
  });

  describe('tests for update', () => {
    it('should update a product', (doneFn) => {
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new product'
      };
      const productId = '1';

      productsService.update(productId, {...dto})
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
      req.flush(mockData);
    });
  });

  describe('tests for delete', () => {
    it('should delete a product', (doneFn) => {
      const mockData = true;
      const productId = '1';

      productsService.delete(productId)
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });

  describe('tests for getOne', () => {
    it('should return a product', (doneFn) => {
      const mockData: Product = generateOneProduct();
      const productId = '1';

      productsService.getOne(productId)
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the right message when the status code is 404', (doneFn) => {
      const msgError = '404 message';
      const productId = '1';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      };

      productsService.getOne(productId)
      .subscribe({
        error: (error) => {
          expect(error).toEqual('El producto no existe');
          doneFn();
        }
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right message when the status code is 401', (doneFn) => {
      const msgError = '401 message';
      const productId = '1';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError
      };

      productsService.getOne(productId)
      .subscribe({
        error: (error) => {
          expect(error).toEqual('No estas permitido');
          doneFn();
        }
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right message when the status code is 409', (doneFn) => {
      const msgError = '409 message';
      const productId = '1';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError
      };

      productsService.getOne(productId)
      .subscribe({
        error: (error) => {
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        }
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right message when the status code is other', (doneFn) => {
      const msgError = 'Error message';
      const productId = '1';
      const mockError = {
        status: HttpStatusCode.BadGateway,
        statusText: msgError
      };

      productsService.getOne(productId)
      .subscribe({
        error: (error) => {
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        }
      });

      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });
});
