import { Component } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UploadComponent {
  files: File[] = [];
  uploading = false;
  uploadProgress: { [key: string]: number } = {};
  apiUrl = 'http://localhost:8080/files';
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    this.files = Array.from(selectedFiles);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = event.dataTransfer?.files;
    if (droppedFiles) {
      this.files = Array.from(droppedFiles);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  async uploadFiles() {
    if (this.files.length === 0) return;
    
    const token = this.authService.getToken();
    if (!token) {
      this.error = 'No authentication token found. Please log in.';
      return;
    }

    this.error = null;
    this.uploading = true;
    
    const headers = new HttpHeaders().set('Authorization', token);
    let successCount = 0;
    
    for (const file of this.files) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        await this.http.post(this.apiUrl, formData, {
          headers,
          reportProgress: true,
          observe: 'events'
        }).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress[file.name] = Math.round(100 * event.loaded / event.total);
          } else if (event.type === HttpEventType.Response) {
            successCount++;
            if (successCount === this.files.length) {
              // All files uploaded successfully
              this.router.navigate(['/files']);
            }
          }
        });
        
        console.log(`Successfully uploaded ${file.name}`);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        this.uploadProgress[file.name] = -1;
        this.error = 'Failed to upload file. Please try again.';
      }
    }
    
    this.uploading = false;
    if (!this.error) {
      this.files = [];
    }
  }
}
