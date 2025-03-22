import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface FileItem {
  id: number;
  fileName: string;
  folder: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:8080/files/items';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getFiles(rootId?: number): Observable<FileItem[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', token || '');
    const url = rootId ? `${this.apiUrl}?rootId=${rootId}` : this.apiUrl;
    
    return this.http.get<FileItem[]>(url, { headers });
  }
}
