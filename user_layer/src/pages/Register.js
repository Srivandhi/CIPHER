import { api } from '../services/mockApi.js';

export const RegisterPage = async () => {
    const container = document.createElement('div');
    container.className = 'page-container animate-fade-in';

    // State
    let step = 1;
    let registrationData = {};

    const renderStep = () => {
        container.innerHTML = '';
        const content = document.createElement('div');
        content.className = 'glass-panel auth-form';

        if (step === 1) {
            // Step 1: Aadhaar Verification
            content.innerHTML = `
        <h2 style="text-align: center;">Registration</h2>
        <p style="text-align: center; font-size: 0.9rem; color: var(--text-muted);">Step 1: Verify Identity</p>
        
        <form id="step1Form" class="form-group">
          <div class="form-group">
            <label class="form-label">Aadhaar Number</label>
            <input type="text" name="aadhaar" class="glass-input" placeholder="Enter 12-digit Aadhaar" maxlength="12" required />
          </div>
          <div id="errorMsg" class="error-msg"></div>
          <button type="submit" class="btn-primary">Verify & Send OTP</button>
        </form>
        <div style="text-align: center; margin-top: 1rem;">
           <a href="/login" style="color: var(--text-muted); font-size: 0.9rem;" data-link>Back to Login</a>
        </div>
      `;

            const form = content.querySelector('#step1Form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const aadhaar = form.aadhaar.value;
                const btn = form.querySelector('button');
                const errorMsg = content.querySelector('#errorMsg');

                btn.disabled = true;
                btn.textContent = 'Verifying...';
                errorMsg.textContent = '';

                try {
                    const userDetails = await api.verifyAadhaar(aadhaar);
                    registrationData = { ...userDetails };
                    await api.sendOtp(userDetails.phone);
                    step = 2;
                    renderStep();
                } catch (err) {
                    errorMsg.textContent = err;
                    btn.disabled = false;
                    btn.textContent = 'Verify & Send OTP';
                }
            });
        } else if (step === 2) {
            // Step 2: OTP Verification
            content.innerHTML = `
        <h2 style="text-align: center;">Registration</h2>
        <p style="text-align: center; font-size: 0.9rem; color: var(--text-muted);">Step 2: Enter OTP</p>
        <p style="text-align: center; font-size: 0.8rem; color: var(--secondary-color);">OTP sent to linked mobile ending in ******${registrationData.phone.slice(-4)}</p>
        
        <form id="step2Form" class="form-group">
          <div class="form-group">
            <label class="form-label">OTP</label>
            <input type="text" name="otp" class="glass-input" placeholder="Enter 6-digit OTP (123456)" maxlength="6" required />
          </div>
          <div id="errorMsg" class="error-msg"></div>
          <button type="submit" class="btn-primary">Verify OTP</button>
        </form>
      `;

            const form = content.querySelector('#step2Form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const otp = form.otp.value;
                const btn = form.querySelector('button');
                const errorMsg = content.querySelector('#errorMsg');

                btn.disabled = true;
                btn.textContent = 'Verifying...';

                try {
                    await api.verifyOtp(otp);
                    step = 3;
                    renderStep();
                } catch (err) {
                    errorMsg.textContent = err;
                    btn.disabled = false;
                    btn.textContent = 'Verify OTP';
                }
            });
        } else if (step === 3) {
            // Step 3: Personal Info (Read-only) & Password Setup
            content.innerHTML = `
        <h2 style="text-align: center;">Registration</h2>
        <p style="text-align: center; font-size: 0.9rem; color: var(--text-muted);">Step 3: Setup Password</p>
        
        <div class="form-group" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 8px;">
          <p><strong>Name:</strong> ${registrationData.name}</p>
          <p><strong>Address:</strong> ${registrationData.address}</p>
        </div>

        <form id="step3Form" class="form-group">
          <div class="form-group">
            <label class="form-label">Create Password</label>
            <input type="password" name="password" class="glass-input" placeholder="Min 6 characters" minlength="6" required />
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" name="confirmPassword" class="glass-input" placeholder="Re-enter password" minlength="6" required />
          </div>
          <div id="errorMsg" class="error-msg"></div>
          <button type="submit" class="btn-primary">Complete Registration</button>
        </form>
      `;

            const form = content.querySelector('#step3Form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const password = form.password.value;
                const confirmPassword = form.confirmPassword.value;
                const errorMsg = content.querySelector('#errorMsg');

                if (password !== confirmPassword) {
                    errorMsg.textContent = 'Passwords do not match';
                    return;
                }

                const btn = form.querySelector('button');
                btn.disabled = true;
                btn.textContent = 'Registering...';

                try {
                    await api.register({ ...registrationData, password });
                    step = 4;
                    renderStep();
                } catch (err) {
                    errorMsg.textContent = err;
                    btn.disabled = false;
                    btn.textContent = 'Complete Registration';
                }
            });
        } else if (step === 4) {
            // Step 4: Success
            content.innerHTML = `
        <div style="text-align: center;">
          <h2 style="color: #4ade80; margin-bottom: 1rem;">Success!</h2>
          <p style="margin-bottom: 2rem;">You have been successfully registered.</p>
          <a href="/login" class="btn-primary" data-link>Proceed to Login</a>
        </div>
      `;
        }

        container.appendChild(content);
    };

    renderStep();
    return container;
};
