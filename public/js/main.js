// Simple UI helpers for modals, delete actions, and filtering

function setupModals() {
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeTriggers = document.querySelectorAll('[data-close-modal]');

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-open-modal');
      const modal = document.getElementById(targetId);
      if (!modal) return;

      // If editing, pre-fill form for employees and menu items
      if (targetId === 'employeeModal' && btn.dataset.employee) {
        const employee = JSON.parse(btn.dataset.employee);
        const form = modal.querySelector('form');
        const title = modal.querySelector('#employeeModalTitle');
        if (title) title.textContent = 'Edit Employee';
        if (form) {
          form.action = `/api/employees/${employee._id}`;
          form._method && (form._method.value = 'patch');
          form.employeeID.value = employee.employeeID;
          form.name.value = employee.name;
          form.position.value = employee.position;
          form.salary.value = employee.salary;
        }
      } else if (targetId === 'employeeModal') {
        const form = modal.querySelector('form');
        const title = modal.querySelector('#employeeModalTitle');
        if (title) title.textContent = 'Add Employee';
        if (form) {
          form.action = '/api/employees';
          form._method && (form._method.value = 'post');
          form.reset();
        }
      }

      if (targetId === 'menuItemModal' && btn.dataset.menuItem) {
        const item = JSON.parse(btn.dataset.menuItem);
        const form = modal.querySelector('form');
        const title = modal.querySelector('#menuItemModalTitle');
        if (title) title.textContent = 'Edit Menu Item';
        if (form) {
          form.action = `/api/menu-items/${item._id}`;
          form.name.value = item.name;
          form.description.value = item.description || '';
          form.price.value = item.price;
          form.ingredients.value = (item.ingredients || []).join(', ');
        }
      } else if (targetId === 'menuItemModal') {
        const form = modal.querySelector('form');
        const title = modal.querySelector('#menuItemModalTitle');
        if (title) title.textContent = 'Add Menu Item';
        if (form) {
          form.action = '/api/menu-items';
          form.reset();
        }
      }

      modal.classList.add('is-open');
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modal = trigger.closest('.modal') || document.querySelector('.modal.is-open');
      if (modal) modal.classList.remove('is-open');
    });
  });
}

function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll('[data-delete-endpoint]');

  deleteButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const endpoint = btn.getAttribute('data-delete-endpoint');
      if (!endpoint) return;
      const confirmed = window.confirm('Are you sure you want to delete this item?');
      if (!confirmed) return;

      try {
        const res = await fetch(endpoint, { method: 'DELETE' });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.message || 'Failed to delete item');
          return;
        }
        // Optimistic UI: remove row/card
        const row = btn.closest('tr, .card');
        if (row) row.remove();
      } catch (err) {
        console.error(err);
        alert('Failed to delete item');
      }
    });
  });
}

function setupEmployeeSearch() {
  const input = document.getElementById('employeeSearch');
  const table = document.getElementById('employeeTable');
  if (!input || !table) return;

  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row) => {
      const name = row.dataset.name || '';
      const position = row.dataset.position || '';
      const visible = !term || name.includes(term) || position.includes(term);
      row.style.display = visible ? '' : 'none';
    });
  });
}

function setupOrderFormParsing() {
  const orderModal = document.getElementById('orderModal');
  if (!orderModal) return;
  const form = orderModal.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', () => {
    // Convert comma-separated strings into arrays for menuItemIDs and quantity
    const menuInput = form.menuItemIDs;
    const quantityInput = form.quantity;
    if (menuInput && quantityInput) {
      const menuItems = menuInput.value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      const quantities = quantityInput.value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => Number(v));
      // Replace field names so Express receives arrays
      menuInput.name = 'menuItemIDs[]';
      quantityInput.name = 'quantity[]';
      menuInput.value = menuItems.join(',');
      quantityInput.value = quantities.join(',');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupModals();
  setupDeleteButtons();
  setupEmployeeSearch();
  setupOrderFormParsing();
});


