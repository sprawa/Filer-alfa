import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FileService } from '../../services/file.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  isDragging = false;
  uploadProgress: { [key: string]: number } = {};
  uploadError: string | null = null;
  protected readonly Object = Object;

  constructor(
    private fileService: FileService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.uploadFiles(files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadFiles(input.files);
    }
  }

  uploadFiles(files: FileList) {
    Array.from(files).forEach(file => {
      this.uploadProgress[file.name] = 0;
      
      this.fileService.uploadFile(file, (progress: number) => {
        this.uploadProgress[file.name] = progress;
      }).subscribe({
        next: () => {
          this.snackBar.open(`${file.name} uploaded successfully`, 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
          if (Object.values(this.uploadProgress).every(p => p === 100)) {
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Upload failed:', error);
          this.uploadError = `Failed to upload ${file.name}`;
          this.snackBar.open(`Failed to upload ${file.name}`, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            panelClass: ['error-snackbar']
          });
        }
      });
    });
  }
}
