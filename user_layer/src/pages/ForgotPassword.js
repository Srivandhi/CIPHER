import { api } from '../services/mockApi.js';

export const ForgotPasswordPage = async () => {
    const container = document.createElement('div');
    container.className = 'page-container animate-fade-in';

    let step = 1;
    let userData = null;

    const renderStep = () => {
        container.innerHTML = '';
        const content = document.createElement('div');
        content.className = 'glass-panel auth-form';

        if (step === 1) {
            content.innerHTML = `
        <h2 style="text-align: center;">Reset Password</h2>
        <p style="text-align: center; font-size: 0.9rem; color: var(--text-muted);">Enter your Aadhaar Number</p>
        
        <form id="fpStep1" class="form-group">
          <input type="text" name="aadhaar" class="glass-input" placeholder="12-digit Aadhaar" maxlength="12" required />
          <div id="errorMsg" class="error-msg"></div>
          <button type="submit" class="btn-primary">Get OTP</button>
        </form>
        <div style="text-align: center; margin-top: 1rem;">
           <a href="/login" style="color: var(--text-muted); font-size: 0.9rem;" data-link>Back to Login</a>
        </div>
      `;

            const form = content.querySelector('#fpStep1');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const aadhaar = form.aadhaar.value;
                const btn = form.querySelector('button');
                const errorMsg = content.querySelector('#errorMsg');

                btn.disabled = true;
                btn.textContent = 'Checking...';

                try {
                    // In a real app, we'd have a specific API for this. Reusing verifyAadhaar for mock.
                    // We need to check if user EXISTS in our mock DB, not just valid aadhaar.
                    // But verifyAadhaar in mockApi checks if registered and throws if it IS.
                    // So we need a slight tweak or just assume valid for this mock flow if it's in our local storage.

                    // Let's check local storage directly for this mock
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const user = users.find(u => u.aadhaar === aadhaar);

                    if (!user) {
                        throw new Error('User not found with this Aadhaar number.');
                    }

                    userData = user;
                    await api.sendOtp(user.phone);
                    step = 2;
                    renderStep();
                } catch (err) {
                    errorMsg.textContent = err.message || err;
                    btn.disabled = false;
                    btn.textContent = 'Get OTP';
                }
            });
        } else if (step === 2) {
            content.innerHTML = `
        <h2 style="text-align: center;">Verify OTP</h2>
        <p style="text-align: center; font-size: 0.8rem; color: var(--secondary-color);">OTP sent to ******${userData.phone.slice(-4)}</p>
        
        <form id="fpStep2" class="form-group">
          <input type="text" name="otp" class="glass-input" placeholder="Enter OTP (123456)" maxlength="6" required />
          <div id="errorMsg" class="error-msg"></div>
          <button type="submit" class="btn-primary">Verify</button>
        </form>
      `;

            const form = content.querySelector('#fpStep2');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const otp = form.otp.value;
                const btn = form.querySelector('button');
                const errorMsg = content.querySelector('#errorMsg');

                btn.disabled = true;

                try {
                    await api.verifyOtp(otp);
                    step = 3;
                    renderStep();
                } catch (err) {
                    errorMsg.textContent = err;
                    btn.disabled = false;
                }
            });
        } else if (step === 3) {
            content.innerHTML = `
        <h2 style="text-align: center;">New Password</h2>
        <form id="fpStep3" class="form-group">
          <input type="password" name="password" class="glass-input" placeholder="New Password" minlength="6" required />
          <input type="password" name="confirm" class="glass-input" placeholder="Confirm Password" minlength="6" required />
          <div id="errorMsg" class="error-msg"></div>
          <button type="submit" class="btn-primary">Reset Password</button>
        </form>
      `;

            const form = content.querySelector('#fpStep3');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const password = form.password.value;
                const confirm = form.confirm.value;
                const errorMsg = content.querySelector('#errorMsg');

                if (password !== confirm) {
                    errorMsg.textContent = 'Passwords do not match';
                    return;
                }

                const btn = form.querySelector('button');
                btn.disabled = true;

                try {
                    await api.updateUser(userData.aadhaar, { password });
                    step = 4;
                    renderStep();
                } catch (err) {
                    errorMsg.textContent = err;
                    btn.disabled = false;
                }
            });
        } else if (step === 4) {
            content.innerHTML = `
        <div style="text-align: center;">
          <h2 style="color: #4ade80; margin-bottom: 1rem;">Password Reset!</h2>
          <a href="/login" class="btn-primary" data-link>Login Now</a>
        </div>
      `;
        }

        container.appendChild(content);
    };

    renderStep();
    return container;
};
