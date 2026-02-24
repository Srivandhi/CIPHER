import { api } from '../services/mockApi.js';
import { LanguageService } from '../services/LanguageService.js';

export const LoginPage = async () => {
  const container = document.createElement('div');
  container.className = 'page-container animate-fade-in';

  container.innerHTML = `
    <div class="glass-panel auth-form" style="position: relative;">
      <div style="position: absolute; top: 1rem; right: 1rem;">
        <select id="langSelect" class="glass-input" style="padding: 5px; font-size: 0.8rem; width: auto;">
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="ta">தமிழ் (Tamil)</option>
        </select>
      </div>

      <h2 style="text-align: center; margin-bottom: 1rem;">Citizen Login</h2>
      
      <form id="loginForm" class="form-group">
        <div class="form-group">
          <label class="form-label">Aadhaar Number</label>
          <input type="text" name="aadhaar" class="glass-input" placeholder="Enter 12-digit Aadhaar" maxlength="12" required />
        </div>
        
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" name="password" class="glass-input" placeholder="Enter your password" required />
        </div>
        
        <div id="loginError" class="error-msg"></div>
        
        <button type="submit" class="btn-primary" style="margin-top: 1rem;">Login</button>
      </form>
      
      <div style="text-align: center; font-size: 0.9rem; margin-top: 1rem;">
        <a href="/forgot-password" style="color: var(--secondary-color);" data-link>Forgot Password?</a>
        <br/><br/>
        <span style="color: var(--text-muted);">New User?</span> 
        <a href="/register" style="color: var(--primary-color); font-weight: 600;" data-link>Register Here</a>
      </div>
      

    </div>
  `;

  const form = container.querySelector('#loginForm');
  const errorMsg = container.querySelector('#loginError');
  const langSelect = container.querySelector('#langSelect');

  // Initialize Language
  // langSelect.value = LanguageService.currentLang; // If we persist it later

  langSelect.addEventListener('change', async (e) => {
    const lang = e.target.value;
    await LanguageService.translatePage(lang);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    const formData = new FormData(form);
    const aadhaar = formData.get('aadhaar');
    const password = formData.get('password');

    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Logging in...';
    btn.disabled = true;

    try {
      await api.login(aadhaar, password);
      window.router.navigateTo('/dashboard');
    } catch (err) {
      errorMsg.textContent = err;
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });



  return container;
};
