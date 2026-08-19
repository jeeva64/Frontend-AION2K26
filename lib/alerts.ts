import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// AION Light Theme
const AION_THEME = {
  background: '#ffffff',
  color: '#1e293b',
  confirmButtonColor: '#2563eb',
  cancelButtonColor: '#64748b',
  customClass: {
    popup: 'aion-swal-popup',
    confirmButton: 'aion-swal-confirm',
    cancelButton: 'aion-swal-cancel',
    title: 'aion-swal-title',
    htmlContainer: 'aion-swal-content',
    icon: 'aion-swal-icon'
  },
  buttonsStyling: false,
  reverseButtons: true
};

export const aionAlert = {
  success: (title: string, text?: string, timer = 2000) =>
    Swal.fire({ ...AION_THEME, icon: 'success', title, text, timer, showConfirmButton: false }),

  error: (title: string, text?: string) =>
    Swal.fire({ ...AION_THEME, icon: 'error', title, text }),

  warning: (title: string, text?: string) =>
    Swal.fire({ ...AION_THEME, icon: 'warning', title, text }),

  info: (title: string, text?: string) =>
    Swal.fire({ ...AION_THEME, icon: 'info', title, text }),

  confirm: (options: {
    title: string;
    html?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: 'warning' | 'question' | 'error';
  }) => Swal.fire({
    ...AION_THEME,
    icon: options.icon || 'warning',
    title: options.title,
    html: options.html,
    showCancelButton: true,
    confirmButtonText: options.confirmText || 'Yes, confirm',
    cancelButtonText: options.cancelText || 'Cancel'
  }),

  input: (options: {
    title: string;
    placeholder: string;
    confirmText?: string;
    inputValidator?: (value: string) => string | null;
  }) => Swal.fire({
    ...AION_THEME,
    input: 'text',
    title: options.title,
    inputPlaceholder: options.placeholder,
    showCancelButton: true,
    confirmButtonText: options.confirmText || 'Submit',
    inputValidator: options.inputValidator
  }),

  loading: (title: string, text?: string) =>
    Swal.fire({ ...AION_THEME, title, text, allowOutsideClick: false, didOpen: () => Swal.showLoading() }),

  close: () => Swal.close()
};

export { Swal };