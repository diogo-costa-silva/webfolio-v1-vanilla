/**
 * Modal System
 * Simple, accessible modal implementation
 */

export class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        if (!this.modal) return;

        this.modalContent = this.modal.querySelector('.modal__content');
        this.closeBtn = this.modal.querySelector('.modal__close');

        this.init();
    }

    init() {
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('modal--active')) {
                this.close();
            }
        });
    }

    open() {
        this.modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';

        // Focus first focusable element
        const focusable = this.modalContent.querySelector('button, a, input, textarea');
        if (focusable) {
            setTimeout(() => focusable.focus(), 100);
        }
    }

    close() {
        this.modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize all modals on page
 */
export function initModals() {
    // Get all modal triggers
    const triggers = document.querySelectorAll('[data-modal-trigger]');
    const modals = new Map();

    triggers.forEach(trigger => {
        const modalId = trigger.getAttribute('data-modal-trigger');

        // Create modal instance if not exists
        if (!modals.has(modalId)) {
            modals.set(modalId, new Modal(modalId));
        }

        // Add click listener to trigger
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            modals.get(modalId).open();
        });
    });
}
