import { api } from '../services/mockApi.js';

export const Profile = async () => {
  const container = document.createElement('div');
  container.className = 'glass-panel animate-fade-in';
  container.style.padding = '2rem';

  const user = api.getCurrentUser();

  container.innerHTML = `
    <h2 style="margin-bottom: 1.5rem;">Edit Personal Details</h2>
    
    <form id="profileForm" class="auth-form" style="max-width: 800px;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
        
        <!-- Read Only Section -->
        <div class="form-group">
          <label class="form-label">Aadhaar Number (Masked)</label>
          <input type="text" class="glass-input" value="XXXX-XXXX-${user.aadhaar.slice(-4)}" disabled style="background: #f1f5f9;" />
        </div>

        <div class="form-group">
          <label class="form-label">Registered Phone</label>
          <input type="text" class="glass-input" value="${user.phone}" disabled style="background: #f1f5f9;" />
        </div>

        <!-- Personal Info -->
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" name="name" class="glass-input" value="${user.name || ''}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Email (Optional)</label>
          <input type="email" name="email" class="glass-input" value="${user.email || ''}" />
        </div>

        <div class="form-group">
          <label class="form-label">Alternate Phone (Optional)</label>
          <input type="tel" name="alternatePhone" class="glass-input" value="${user.alternatePhone || ''}" pattern="[0-9]{10}" />
        </div>

        <!-- Address Details -->
        <div class="form-group">
          <label class="form-label">State</label>
          <input type="text" name="state" class="glass-input" value="${user.state || ''}" required />
        </div>

        <div class="form-group">
          <label class="form-label">District</label>
          <input type="text" name="district" class="glass-input" value="${user.district || ''}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Taluka / Block</label>
          <input type="text" name="taluka" class="glass-input" value="${user.taluka || ''}" required />
        </div>

        <div class="form-group">
          <label class="form-label">Village / Locality</label>
          <input type="text" name="village" class="glass-input" value="${user.village || ''}" required />
        </div>

        <div class="form-group">
          <label class="form-label">PIN Code</label>
          <input type="text" name="pincode" class="glass-input" value="${user.pincode || ''}" pattern="[0-9]{6}" required />
        </div>

        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Full Address (Optional)</label>
          <textarea name="address" class="glass-input" rows="3">${user.address || ''}</textarea>
        </div>

      </div>

      <div id="msg" class="error-msg" style="color: #10b981; margin-top: 1rem;"></div>
      
      <button type="submit" class="btn-primary" style="align-self: flex-start; margin-top: 1rem;">Save Changes</button>
    </form>
  `;

  const form = container.querySelector('#profileForm');
  const msg = container.querySelector('#msg');

  form.addEventListener('submit', async (e) => {
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    const formData = new FormData(form);

    try {
      await api.updateUser(user.aadhaar, {
        name: formData.get('name'),
        email: formData.get('email'),
        alternatePhone: formData.get('alternatePhone'),
        state: formData.get('state'),
        district: formData.get('district'),
        taluka: formData.get('taluka'),
        village: formData.get('village'),
        pincode: formData.get('pincode'),
        address: formData.get('address')
      });

      msg.textContent = 'Profile Updated Successfully!';

      setTimeout(() => {
        msg.textContent = '';
        btn.textContent = 'Save Changes';
        btn.disabled = false;
      }, 2000);

    } catch (err) {
      msg.style.color = '#ef4444';
      msg.textContent = 'Failed to update profile.';
      btn.disabled = false;
      btn.textContent = 'Save Changes';
    }
  });

  return container;
};
