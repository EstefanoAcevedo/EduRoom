import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/api/auth/auth-service';
import { ToastService } from '../../../core/services/ui/toast/toast-service';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  isLoading: boolean = false;

  userName: string = '';
  userRol: string = '';
  
  ngOnInit() {
    this.userName = sessionStorage.getItem('user_name') || '';
    this.userRol = sessionStorage.getItem('roles') || '';
  }

  @ViewChild('sidebar') sidebarElement!: ElementRef;
  private sidebarOffcanvas!: bootstrap.Offcanvas;

  ngAfterViewInit() {
    this.sidebarOffcanvas = new bootstrap.Offcanvas(
      this.sidebarElement.nativeElement,
      {
        backdrop: true,     
        keyboard: true,    
        scroll: false
      }
    );
  }

  open() {
    this.sidebarOffcanvas.show();
  }

  close() {
    this.sidebarOffcanvas.hide();
  }

  logout() {
    this.isLoading = true;
    this.authService.logout({}).subscribe({
      next: (response) => {
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user_name');
        sessionStorage.removeItem('roles');
        this.isLoading = false;
        this.router.navigate(['login']);
      },
      error: (error) => {
        console.error(error.error);
        this.toastService.showError('No se pudo cerrar la sesión. Inténtalo de nuevo más tarde.', 'Error al cerrar sesión');
        this.isLoading = false;
      }
    })
  }

}
