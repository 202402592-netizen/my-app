import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastService, Toast } from '../../../core/services/toast';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];
  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  remove(id: number): void {
    this.toastService.remove(id);
  }

  getToastClass(type: string): string {
    const baseClasss = 'toast show';
    switch (type) {
      case 'success':
        return `${baseClasss} bg-info text-white`;
      case 'error':
        return `${baseClasss} bg-danger text-white`;
      case 'warning':
        return `${baseClasss} bg-warning text-dark`;
      default:
        return `${baseClasss} bg-info text-white`;
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  }
}