import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileService, FileItem } from '../../services/file.service';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  files: FileItem[] = [];
  loading = true;
  error: string | null = null;
  currentFolder: number | undefined;

  constructor(private fileService: FileService) {}

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
      }
    });
  }

  navigateToFolder(folderId: number) {
    this.loadFiles(folderId);
  }

  goBack() {
    this.loadFiles(undefined);
  }
}
