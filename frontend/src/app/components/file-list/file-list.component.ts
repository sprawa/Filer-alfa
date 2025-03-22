import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileService, FileItem } from '../../services/file.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  files: FileItem[] = [];
  loading = true;
  error: string | null = null;
  currentFolder: number | undefined;

  constructor(
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles(folderId?: number) {
    this.loading = true;
    this.error = null;
    this.currentFolder = folderId;

    this.fileService.getFiles(folderId).subscribe({
      next: (files) => {
        this.files = files;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading files:', err);
        this.error = 'Failed to load files. Please try again.';
        this.loading = false;
        this.snackBar.open('Failed to load files', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  navigateToFolder(folderId: number) {
    this.loadFiles(folderId);
  }

  goBack() {
    this.loadFiles(undefined);
  }

  downloadFile(file: FileItem, event: Event) {
    event.stopPropagation(); // Prevent folder navigation if file is in a folder
    
    if (file.folder) {
      return; // Don't download folders
    }

    this.fileService.downloadFile(file.id).subscribe({
      next: (blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = file.fileName; // Set the file name
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        window.URL.revokeObjectURL(url);
        
        this.snackBar.open('File downloaded successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end'
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to download file', 'Close', {
          duration: 3000,
          horizontalPosition: 'end'
        });
      }
    });
  }
}
