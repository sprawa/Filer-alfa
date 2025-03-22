import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UploadComponent } from './components/upload/upload.component';
import { FileListComponent } from './components/file-list/file-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/files', pathMatch: 'full'},
    { path: 'home', component: HomeComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'login', component: LoginComponent},
    { path: 'upload', component: UploadComponent},
    { path: 'files', component: FileListComponent}
];
