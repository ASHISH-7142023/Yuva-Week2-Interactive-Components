/**
 * Nova UI Toolkit — Interactive Component Architecture
 * Yuva Intern: Junior Frontend Developer Internship (Week 2 Task)
 * 
 * Modular Vanilla ES6 Architecture:
 * 1. ModalManager — Focus trapping, backdrop dismissal, keyboard escape, focus restoration
 * 2. TabsManager — WAI-ARIA 1.2 arrow key navigation, automatic panel sync
 * 3. AccordionManager — CSS Grid animation, Single/Multi mode switch, keyboard arrows
 * 4. ToastManager — Stackable notification manager, live progress bars, auto-dismiss
 */

'use strict';

// ============================================================================
// 1. MODAL DIALOG CONTROLLER (WAI-ARIA Focus Trap Pattern)
// ============================================================================
class ModalManager {
  constructor() {
    this.activeModal = null;
    this.lastFocusedElement = null;
    this.focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    this.init();
  }

  init() {
    // Global ESC key and Focus Trap listener
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Backdrop click dismiss
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop') && this.activeModal) {
        this.close(this.activeModal);
      }
    });

    // Close button triggers via data-modal-close
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn && this.activeModal) {
        this.close(this.activeModal);
      }
    });
  }

  open(modalId, triggerElement = null) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Save previous active focus for restoration
    this.lastFocusedElement = triggerElement || document.activeElement;
    this.activeModal = modal;

    // Show modal
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus first interactive element inside dialog
    const focusable = this.getFocusableElements(modal);
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 50);
    }

    // Dispatch custom event
    modal.dispatchEvent(new CustomEvent('modal:open', { bubbles: true }));
  }

  close(modal) {
    if (!modal) return;

    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Restore focus to initiating element for assistive devices
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }

    this.activeModal = null;
    this.lastFocusedElement = null;

    modal.dispatchEvent(new CustomEvent('modal:close', { bubbles: true }));
  }

  getFocusableElements(modal) {
    const elements = modal.querySelectorAll(this.focusableSelectors);
    return Array.from(elements).filter(el => {
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
    });
  }

  handleKeyDown(e) {
    if (!this.activeModal) return;

    // 1. Escape key dismissal
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close(this.activeModal);
      return;
    }

    // 2. Focus Trap inside Modal
    if (e.key === 'Tab') {
      const focusable = this.getFocusableElements(this.activeModal);
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: backward cycle
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: forward cycle
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }
}

// ============================================================================
// 2. WAI-ARIA TABBED CONTENT SWITCHER CONTROLLER
// ============================================================================
class TabsManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.tabs = Array.from(this.container.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.container.querySelectorAll('[role="tabpanel"]'));

    if (this.tabs.length > 0) {
      this.init();
    }
  }

  init() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.activateTab(index));
      tab.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
    });
  }

  activateTab(index) {
    const targetTab = this.tabs[index];
    const targetPanelId = targetTab.getAttribute('aria-controls');

    // Deselect all tabs
    this.tabs.forEach((tab) => {
      tab.classList.remove('is-active');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });

    // Select clicked tab
    targetTab.classList.add('is-active');
    targetTab.setAttribute('aria-selected', 'true');
    targetTab.setAttribute('tabindex', '0');
    targetTab.focus();

    // Toggle panels
    this.panels.forEach((panel) => {
      if (panel.id === targetPanelId) {
        panel.classList.add('is-active');
        panel.removeAttribute('hidden');
      } else {
        panel.classList.remove('is-active');
        panel.setAttribute('hidden', '');
      }
    });

    this.container.dispatchEvent(new CustomEvent('tab:change', { 
      bubbles: true, 
      detail: { activeIndex: index, tabId: targetTab.id } 
    }));
  }

  handleKeyDown(e, currentIndex) {
    let targetIndex = null;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (currentIndex + 1) % this.tabs.length;
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (currentIndex - 1 + this.tabs.length) % this.tabs.length;
        break;

      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;

      case 'End':
        e.preventDefault();
        targetIndex = this.tabs.length - 1;
        break;

      default:
        return;
    }

    if (targetIndex !== null) {
      this.activateTab(targetIndex);
    }
  }
}

// ============================================================================
// 3. INTERACTIVE ACCORDION CONTROLLER
// ============================================================================
class AccordionManager {
  constructor(accordionElement) {
    this.accordion = accordionElement;
    this.items = Array.from(this.accordion.querySelectorAll('.accordion-item'));
    this.triggers = this.items.map(item => item.querySelector('.accordion-trigger'));
    this.allowMultiple = this.accordion.dataset.allowMultiple === 'true';

    this.init();
  }

  init() {
    this.triggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => this.toggleItem(index));
      trigger.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
    });
  }

  setAllowMultiple(allow) {
    this.allowMultiple = Boolean(allow);
    this.accordion.dataset.allowMultiple = String(this.allowMultiple);

    // If switching to single-mode and multiple are open, collapse all except first
    if (!this.allowMultiple) {
      const openItems = this.items.filter(item => item.classList.contains('is-expanded'));
      if (openItems.length > 1) {
        openItems.slice(1).forEach(item => {
          this.collapseItem(item);
        });
      }
    }
  }

  toggleItem(index) {
    const item = this.items[index];
    const isExpanded = item.classList.contains('is-expanded');

    if (isExpanded) {
      this.collapseItem(item);
    } else {
      if (!this.allowMultiple) {
        this.items.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('is-expanded')) {
            this.collapseItem(otherItem);
          }
        });
      }
      this.expandItem(item);
    }
  }

  expandItem(item) {
    item.classList.add('is-expanded');
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    trigger.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
  }

  collapseItem(item) {
    item.classList.remove('is-expanded');
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    trigger.setAttribute('aria-expanded', 'false');
    // Hide panel after animation concludes
    setTimeout(() => {
      if (!item.classList.contains('is-expanded')) {
        panel.setAttribute('hidden', '');
      }
    }, 250);
  }

  expandAll() {
    this.items.forEach(item => this.expandItem(item));
  }

  collapseAll() {
    this.items.forEach(item => this.collapseItem(item));
  }

  handleKeyDown(e, currentIndex) {
    let targetIndex = null;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (currentIndex + 1) % this.triggers.length;
        break;

      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (currentIndex - 1 + this.triggers.length) % this.triggers.length;
        break;

      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;

      case 'End':
        e.preventDefault();
        targetIndex = this.triggers.length - 1;
        break;

      default:
        return;
    }

    if (targetIndex !== null && this.triggers[targetIndex]) {
      this.triggers[targetIndex].focus();
    }
  }
}

// ============================================================================
// 4. DYNAMIC TOAST NOTIFICATION CONTROLLER
// ============================================================================
class ToastNotificationService {
  constructor(containerId = 'toast-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      this.container = document.createElement('aside');
      this.container.id = containerId;
      this.container.className = 'toast-container';
      this.container.setAttribute('role', 'status');
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }
  }

  show({ title, message, type = 'info', duration = 4500 }) {
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.setAttribute('role', 'alert');

    // Type icons
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <div class="toast-inner">
        <span class="toast-icon" aria-hidden="true">${icons[type] || 'ℹ️'}</span>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button type="button" class="toast-close-btn" aria-label="Dismiss notification">✕</button>
      </div>
      <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    // Manual close listener
    const closeBtn = toast.querySelector('.toast-close-btn');
    closeBtn.addEventListener('click', () => this.dismiss(toast));

    // Mount to DOM
    this.container.appendChild(toast);

    // Auto-dismiss timeout
    const timer = setTimeout(() => {
      this.dismiss(toast);
    }, duration);

    // Pause on hover
    toast.addEventListener('mouseenter', () => {
      const progressBar = toast.querySelector('.toast-progress');
      if (progressBar) progressBar.style.animationPlayState = 'paused';
      clearTimeout(timer);
    });

    toast.addEventListener('mouseleave', () => {
      this.dismiss(toast);
    });

    return toast;
  }

  dismiss(toast) {
    if (!toast || toast.classList.contains('is-dismissing')) return;

    toast.classList.add('is-dismissing');
    toast.addEventListener('animationend', () => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    });
  }

  clearAll() {
    const toasts = this.container.querySelectorAll('.toast-item');
    toasts.forEach(toast => this.dismiss(toast));
  }

  success(title, message, duration) {
    return this.show({ title, message, type: 'success', duration });
  }

  error(title, message, duration) {
    return this.show({ title, message, type: 'error', duration });
  }

  warning(title, message, duration) {
    return this.show({ title, message, type: 'warning', duration });
  }

  info(title, message, duration) {
    return this.show({ title, message, type: 'info', duration });
  }
}

// ============================================================================
// 5. APPLICATION INITIALIZATION & DEMO WORKFLOWS
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Instantiate core component controllers
  const modalManager = new ModalManager();
  const toastService = new ToastNotificationService();

  const tabsElement = document.getElementById('system-tabs');
  if (tabsElement) {
    new TabsManager(tabsElement);
  }

  const accordionElement = document.getElementById('faq-accordion');
  let accordionManager = null;
  if (accordionElement) {
    accordionManager = new AccordionManager(accordionElement);
  }

  // --- Modal Demo Wiring ---
  const confirmBtn = document.getElementById('open-confirm-modal');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      modalManager.open('modal-confirm', confirmBtn);
    });
  }

  const formBtn = document.getElementById('open-form-modal');
  if (formBtn) {
    formBtn.addEventListener('click', () => {
      modalManager.open('modal-form', formBtn);
    });
  }

  const destBtn = document.getElementById('open-destructive-modal');
  if (destBtn) {
    destBtn.addEventListener('click', () => {
      modalManager.open('modal-destructive', destBtn);
    });
  }

  // Modal Actions
  const btnConfirmAction = document.getElementById('btn-confirm-action');
  if (btnConfirmAction) {
    btnConfirmAction.addEventListener('click', () => {
      modalManager.close(document.getElementById('modal-confirm'));
      toastService.success(
        'Canary Rollout Dispatched',
        'Workload deployment queued across 64 edge zones.'
      );
    });
  }

  const modalForm = document.getElementById('modal-service-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const tokenNameInput = document.getElementById('token-name');
      const tokenError = document.getElementById('token-name-error');
      const nameVal = tokenNameInput.value.trim();

      if (!nameVal) {
        tokenError.textContent = 'Please specify a token name.';
        tokenNameInput.focus();
        return;
      }

      tokenError.textContent = '';
      modalManager.close(document.getElementById('modal-form'));
      toastService.success(
        'Service Token Generated',
        `Secret token "${nameVal}" created with active permissions.`
      );
      modalForm.reset();
    });
  }

  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', () => {
      modalManager.close(document.getElementById('modal-destructive'));
      toastService.error(
        'Cluster Decommissioned',
        'Edge cluster us-east-zone-4 was terminated and resources released.'
      );
    });
  }

  // --- Accordion Controls Wiring ---
  const accordionModeToggle = document.getElementById('accordion-mode-toggle');
  if (accordionModeToggle && accordionManager) {
    accordionModeToggle.addEventListener('change', (e) => {
      accordionManager.setAllowMultiple(!e.target.checked);
      const modeText = e.target.checked ? 'Single-Expand Mode' : 'Multi-Expand Mode';
      toastService.info('Accordion Mode Updated', `Switched to ${modeText}.`);
    });
  }

  const expandAllBtn = document.getElementById('accordion-expand-all');
  if (expandAllBtn && accordionManager) {
    expandAllBtn.addEventListener('click', () => {
      accordionManager.setAllowMultiple(true);
      if (accordionModeToggle) accordionModeToggle.checked = false;
      accordionManager.expandAll();
    });
  }

  const collapseAllBtn = document.getElementById('accordion-collapse-all');
  if (collapseAllBtn && accordionManager) {
    collapseAllBtn.addEventListener('click', () => {
      accordionManager.collapseAll();
    });
  }

  // --- Toast Trigger Triggers ---
  const btnToastSuccess = document.getElementById('toast-trigger-success');
  if (btnToastSuccess) {
    btnToastSuccess.addEventListener('click', () => {
      toastService.success(
        'Cluster Synchronization Complete',
        '64 edge nodes updated successfully without downtime.'
      );
    });
  }

  const btnToastError = document.getElementById('toast-trigger-error');
  if (btnToastError) {
    btnToastError.addEventListener('click', () => {
      toastService.error(
        'mTLS Handshake Error',
        'Node us-west-1 reported certificate mismatch on port 8443.'
      );
    });
  }

  const btnToastWarning = document.getElementById('toast-trigger-warning');
  if (btnToastWarning) {
    btnToastWarning.addEventListener('click', () => {
      toastService.warning(
        'High CPU Utilization Detected',
        'Compute node cluster-08 reached 89% saturation threshold.'
      );
    });
  }

  const btnToastInfo = document.getElementById('toast-trigger-info');
  if (btnToastInfo) {
    btnToastInfo.addEventListener('click', () => {
      toastService.info(
        'Telemetry Ingestion Active',
        'Streaming 48,250 RPS across OpenTelemetry collectors.'
      );
    });
  }

  const btnToastClear = document.getElementById('toast-clear-all');
  if (btnToastClear) {
    btnToastClear.addEventListener('click', () => {
      toastService.clearAll();
    });
  }

  // --- Token Demo Copy Button ---
  const btnCopyToken = document.getElementById('btn-demo-token-copy');
  if (btnCopyToken) {
    btnCopyToken.addEventListener('click', () => {
      navigator.clipboard.writeText('nova_live_94f83b1a20c78e45d91e6b330ac9ef58a27d14')
        .then(() => {
          toastService.success('Token Copied', 'Active API key copied to clipboard.');
        })
        .catch(() => {
          toastService.info('Token Selected', 'API key selected for copy.');
        });
    });
  }
});
