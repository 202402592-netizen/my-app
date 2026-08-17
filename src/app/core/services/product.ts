import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private apiUrl = 'https://fakestoreapi.com/products';

    constructor(private http: HttpClient) {}

    getAllProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl,); 
        }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    getCategories(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/categories`);
    }

    getProductsByCategory(category: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`);
    }

    addProducts(product: Partial<Product>): Observable<Product[]> {
        return this.http.post<Product[]>(this.apiUrl, product);
    }

    updateProducts(id: number, product: Partial<Product>): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    }
    deleteProduct(id: number): Observable<any> {
  return this.http.delete('${this.apiUrl}/${id}');
}

}


