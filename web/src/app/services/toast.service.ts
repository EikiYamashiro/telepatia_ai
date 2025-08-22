import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();

  showSuccess(message: string, duration: number = 4000) {
    this.showToast({
      type: 'success',
      message,
      duration
    });
  }

  showError(message: string, duration: number = 6000) {
    this.showToast({
      type: 'error',
      message,
      duration
    });
  }

  showInfo(message: string, duration: number = 4000) {
    this.showToast({
      type: 'info',
      message,
      duration
    });
  }

  private showToast(toast: Omit<Toast, 'id' | 'timestamp'>) {
    const newToast: Toast = {
      ...toast,
      id: this.generateId(),
      timestamp: new Date()
    };

    this._toasts.update(toasts => [...toasts, newToast]);

    // Auto-remove after duration
    if (toast.duration) {
      setTimeout(() => {
        this.removeToast(newToast.id);
      }, toast.duration);
    }
  }

  removeToast(id: string) {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  clearAll() {
    this._toasts.set([]);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
