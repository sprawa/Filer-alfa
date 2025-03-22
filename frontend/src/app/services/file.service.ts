import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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
  private apiUrl = 'http://localhost:8080/files';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getFiles(folderId?: number): Observable<FileItem[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders().set('Authorization', token);
    const url = folderId ? `${this.apiUrl}/items?rootId=${folderId}` : `${this.apiUrl}/items`;
    
    return this.http.get<FileItem[]>(url, { headers });
  }

  uploadFile(file: File, onProgress: (progress: number) => void): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders().set('Authorization', token);

    return this.http.post(this.apiUrl, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = Math.round(100 * event.loaded / event.total);
          onProgress(progress);
        }
        return event;
      })
    );
  }
}
