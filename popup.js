document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('jobForm');
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    // Load saved data from localStorage
    chrome.storage.local.get(null, (data) => {
      Object.keys(data).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
          input.value = data[key];
        }
      });
      updateFullName(); // Update full name after loading data
    });
  
    // Auto-update full name when first or last name changes
    document.getElementById('firstName').addEventListener('input', updateFullName);
    document.getElementById('lastName').addEventListener('input', updateFullName);
  
    function updateFullName() {
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      document.getElementById('fullName').value = `${firstName} ${lastName}`.trim();
    }
  
    // Handle copy buttons
    copyButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const fieldId = button.dataset.field;
        const input = document.getElementById(fieldId);
        
        try {
          await navigator.clipboard.writeText(input.value);
          showToast(`${fieldId} copied!`);
          
          // Visual feedback
          button.classList.add('copied');
          button.textContent = 'Copied!';
          
          setTimeout(() => {
            button.classList.remove('copied');
            button.textContent = 'Copy';
          }, 2000);
        } catch (err) {
          showToast('Failed to copy text');
        }
      });
    });
  
    // Save form data
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {};
      new FormData(form).forEach((value, key) => {
        formData[key] = value;
      });
  
      // Save to chrome.storage.local
      chrome.storage.local.set(formData, () => {
        showToast('Details saved successfully!');
      });
    });
  
    // Toast notification
    function showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
  
      // Trigger reflow
      toast.offsetHeight;
  
      // Show toast
      toast.classList.add('show');
  
      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    }
  
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);
      
      if (value.length >= 6) {
        value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
      } else if (value.length >= 3) {
        value = `${value.slice(0, 3)}-${value.slice(3)}`;
      }
      
      e.target.value = value;
    });
  
    // Pincode validation
    const pincodeInput = document.getElementById('pincode');
    pincodeInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 6) value = value.slice(0, 6);
      e.target.value = value;
    });
  });