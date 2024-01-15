import { Injectable } from '@angular/core';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  getData(attribute?: string, value?: string): Observable<any> {
    let params = new HttpParams();

    // If attribute and value are provided, add them to the params
    if (attribute && value) {
      params = params.set(attribute, value);
    }
    
    return this.http.get<any>(`${this.apiUrl}/data/getData`, { params });
  }

  getAttributeValues(attribute: string): Observable<string[]> {
    
    return this.http.get<string[]>(`${this.apiUrl}/data/attributeValues/${attribute}`);
  }
}
