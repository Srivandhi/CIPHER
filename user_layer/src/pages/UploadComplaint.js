import { api } from '../services/mockApi.js';

export const UploadComplaint = async () => {
  const container = document.createElement('div');
  container.className = 'glass-panel animate-fade-in';
  container.style.padding = '2rem';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';

  container.innerHTML = `
    <h2 style="margin-bottom: 1.5rem; text-align: center;">File a Complaint</h2>
    
    <form id="complaintForm" class="auth-form" style="max-width: 100%;">
      
      <!-- Section 1: Incident Timing -->
      <h3 class="text-sm text-muted mb-4" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem;">SECTION 1: INCIDENT TIMING</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Date of Incident</label>
          <input type="date" name="date" class="glass-input" required />
        </div>
        <div class="form-group">
          <label class="form-label">Time of Incident</label>
          <input type="time" name="time" class="glass-input" required />
        </div>
      </div>

      <!-- Section 2: Fraud Details -->
      <h3 class="text-sm text-muted mb-4" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 1.5rem;">SECTION 2: FRAUD DETAILS</h3>
      
      <div class="form-group">
        <label class="form-label">Fraud Type</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.9rem;">
          <label><input type="radio" name="fraudType" value="KYC Update Scam" required> KYC Update Scam</label>
          <label><input type="radio" name="fraudType" value="Card Skimming"> Card Skimming</label>
          <label><input type="radio" name="fraudType" value="OTP Fraud"> OTP Fraud</label>
          <label><input type="radio" name="fraudType" value="UPI Scam"> UPI Scam</label>
          <label><input type="radio" name="fraudType" value="Loan App Scam"> Loan App Scam</label>
          <label style="grid-column: 1 / -1; display: flex; align-items: center; gap: 0.5rem;">
            <input type="radio" name="fraudType" value="Other"> Others: 
            <input type="text" name="fraudTypeOther" class="glass-input" style="padding: 4px 8px; font-size: 0.85rem;" placeholder="Specify other">
          </label>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Channel Used</label>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; font-size: 0.9rem;">
          <label><input type="checkbox" name="channel" value="WhatsApp"> WhatsApp</label>
          <label><input type="checkbox" name="channel" value="Phone Call"> Phone Call</label>
          <label><input type="checkbox" name="channel" value="SMS"> SMS</label>
          <label><input type="checkbox" name="channel" value="Email"> Email</label>
          <label><input type="checkbox" name="channel" value="UPI App"> UPI App</label>
          <label><input type="checkbox" name="channel" value="ATM Machine"> ATM Machine</label>
          <label><input type="checkbox" name="channel" value="Social Media"> Social Media</label>
          <label style="grid-column: 1 / -1; display: flex; align-items: center; gap: 0.5rem;">
             Other: <input type="text" name="channelOther" class="glass-input" style="padding: 4px 8px; font-size: 0.85rem;">
          </label>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Victim Bank Name</label>
          <select name="bankName" class="glass-input" required>
            <option value="">Select Bank</option>
            <option value="SBI">State Bank of India</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="Axis">Axis Bank</option>
            <option value="PNB">Punjab National Bank</option>
            <option value="BOB">Bank of Baroda</option>
            <option value="Canara">Canara Bank</option>
            <option value="Kotak">Kotak Mahindra Bank</option>
            <option value="IndusInd">IndusInd Bank</option>
            <option value="Union">Union Bank of India</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Account Type</label>
          <select name="accountType" class="glass-input" required>
            <option value="">Select Type</option>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Transaction Reference / UTR (Optional)</label>
          <input type="text" name="utr" class="glass-input" placeholder="e.g. 123456789012" />
        </div>
        <div class="form-group">
          <label class="form-label">Payment App Used (Optional)</label>
          <select name="paymentApp" class="glass-input">
            <option value="">Select App</option>
            <option value="GPay">Google Pay (GPay)</option>
            <option value="PhonePe">PhonePe</option>
            <option value="Paytm">Paytm</option>
            <option value="BHIM">BHIM</option>
            <option value="AmazonPay">Amazon Pay</option>
            <option value="Cred">Cred</option>
            <option value="NetBanking">Net Banking</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Device Type</label>
          <select name="deviceType" class="glass-input" required>
            <option value="">Select Device</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS</option>
            <option value="Windows">Windows</option>
            <option value="Mac">Mac</option>
            <option value="Linux">Linux</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Account Age (Months)</label>
          <input type="number" name="accountAge" class="glass-input" placeholder="e.g. 12" />
        </div>
      </div>

      <!-- Card Details (Conditional) -->
      <div class="form-group" style="background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px;">
        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
          <input type="checkbox" id="usedCardToggle" name="usedCard" />
          <span>Did this transaction involve a Credit/Debit Card?</span>
        </label>
        
        <div id="cardDetailsSection" style="display: none; margin-top: 1rem; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label">Card Type</label>
            <select name="cardType" class="glass-input">
              <option value="">Select Type</option>
              <option value="Debit">Debit Card</option>
              <option value="Credit">Credit Card</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Last 4 Digits of Card</label>
            <input type="text" name="cardLast4" class="glass-input" maxlength="4" pattern="\d{4}" placeholder="XXXX" />
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Reported Loss Amount (₹)</label>
          <input type="number" name="lossAmount" class="glass-input" required />
        </div>
        <div class="form-group">
          <label class="form-label">Number of Transactions</label>
          <input type="number" name="transactionCount" class="glass-input" required />
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Did you share OTP?</label>
          <div style="display: flex; gap: 1rem;">
            <label><input type="radio" name="sharedOtp" value="Yes" required> Yes</label>
            <label><input type="radio" name="sharedOtp" value="No"> No</label>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Clicked suspicious link?</label>
          <div style="display: flex; gap: 1rem;">
            <label><input type="radio" name="clickedLink" value="Yes" required> Yes</label>
            <label><input type="radio" name="clickedLink" value="No"> No</label>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Fraudster Phone (if known)</label>
          <input type="text" name="fraudsterPhone" class="glass-input" />
        </div>
        <div class="form-group">
          <label class="form-label">Fraudster UPI ID (if known)</label>
          <input type="text" name="fraudsterUpi" class="glass-input" />
        </div>
      </div>

      <!-- Section 3: Incident Location -->
      <h3 class="text-sm text-muted mb-4" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 1.5rem;">SECTION 3: INCIDENT LOCATION</h3>
      
      <div class="form-group">
        <label class="form-label" style="display: block; margin-bottom: 0.5rem; color: #94a3b8;">
            Select Location via Map or GPS (Address will auto-fill)
        </label>
        <button type="button" id="useLocationBtn" class="btn-secondary" style="margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; width: 100%; justify-content: center;">
          <span>📍</span> Use Current Location
        </button>
      </div>

      <!-- Map Container -->
      <!-- Map Container - Always Visible -->
      <div id="map" class="form-group" style="height: 300px; width: 100%; border-radius: 8px; margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.1); display: block;"></div>
      <input type="hidden" name="latitude" id="latitude" />
      <input type="hidden" name="longitude" id="longitude" />

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">State</label>
          <input type="text" name="locationState" id="locState" class="glass-input" readonly style="cursor: not-allowed; opacity: 0.7;" required />
        </div>
        <div class="form-group">
          <label class="form-label">District</label>
          <input type="text" name="locationDistrict" id="locDistrict" class="glass-input" readonly style="cursor: not-allowed; opacity: 0.7;" required />
        </div>
        <div class="form-group">
          <label class="form-label">Taluka (Sub-District)</label>
          <input type="text" name="locationTaluka" id="locTaluka" class="glass-input" readonly style="cursor: not-allowed; opacity: 0.7;" />
        </div>
        <div class="form-group">
          <label class="form-label">Village / City</label>
          <input type="text" name="locationVillage" id="locVillage" class="glass-input" readonly style="cursor: not-allowed; opacity: 0.7;" />
        </div>
        <div class="form-group">
          <label class="form-label">Area Type</label>
          <input type="text" name="ruralUrban" id="locRuralUrban" class="glass-input" readonly style="cursor: not-allowed; opacity: 0.7;" placeholder="Auto-detected" />
        </div>
        <div class="form-group">
          <label class="form-label">Pincode</label>
          <input type="text" name="locationPincode" id="locPincode" class="glass-input" pattern="[0-9]{6}" readonly style="cursor: not-allowed; opacity: 0.7;" required />
        </div>
      </div>


      <!-- Section 4: Additional Information -->
      <h3 class="text-sm text-muted mb-4" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 1.5rem;">SECTION 4: ADDITIONAL INFORMATION</h3>
      
      <div class="form-group">
        <label class="form-label">Description of the incident (Full Details)</label>
        <textarea name="description" class="glass-input" rows="5" required></textarea>
      </div>

      <div class="form-group">
        <label class="form-label">Evidence Files (Upload images, PDFs, etc.)</label>
        <div style="display: flex; gap: 1rem; align-items: start;">
          <label class="btn-secondary" style="cursor: pointer; display: inline-block;">
             + Add Files
            <input type="file" id="evidenceInput" style="display: none;" multiple accept="image/*,.pdf" />
          </label>
          <div id="fileList" style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
            <!-- File items will act here -->
          </div>
        </div>
      </div>

      <!-- Section 5: Declaration -->
      <h3 class="text-sm text-muted mb-4" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 1.5rem;">SECTION 5: DECLARATION</h3>
      <p class="text-sm text-muted" style="margin-bottom: 1rem;">I declare that the above information is true to the best of my knowledge.</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Signature (Type Name)</label>
          <input type="text" name="signature" class="glass-input" required />
        </div>
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="date" name="declarationDate" class="glass-input" required value="${new Date().toISOString().split('T')[0]}" />
        </div>
      </div>

      <div id="msg" class="error-msg" style="color: #10b981; margin-top: 1rem;"></div>
      
      <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1.5rem;">Submit Complaint</button>
    </form>
  `;

  const form = container.querySelector('#complaintForm');
  const msg = container.querySelector('#msg');
  const evidenceInput = container.querySelector('#evidenceInput');
  const fileList = container.querySelector('#fileList');
  const usedCardToggle = container.querySelector('#usedCardToggle');
  const cardDetailsSection = container.querySelector('#cardDetailsSection');

  // Toggle Card Details
  usedCardToggle.addEventListener('change', (e) => {
    cardDetailsSection.style.display = e.target.checked ? 'grid' : 'none';
    const requiredInputs = cardDetailsSection.querySelectorAll('select, input');
    requiredInputs.forEach(input => {
      if (e.target.checked) {
        input.setAttribute('required', 'true');
      } else {
        input.removeAttribute('required');
        input.value = '';
      }
    });
  });

  // State for accumulated files
  let selectedFiles = [];

  // Geolocation & Map Handler
  const useLocationBtn = container.querySelector('#useLocationBtn');
  const mapDiv = container.querySelector('#map');
  const latInput = container.querySelector('#latitude');
  const lngInput = container.querySelector('#longitude');
  let map, marker;

  // Address Fetching Function (Nominatim)
  const fetchAddress = async (lat, lng) => {
    useLocationBtn.textContent = '📍 Fetching Address...';
    useLocationBtn.disabled = true;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();

      if (data && data.address) {
        // Auto-fill fields
        container.querySelector('#locState').value = data.address.state || '';
        container.querySelector('#locDistrict').value = data.address.state_district || data.address.county || data.address.city_district || '';
        container.querySelector('#locPincode').value = data.address.postcode || '';

        // New Fields
        container.querySelector('#locTaluka').value = data.address.county || data.address.suburb || '';
        const village = data.address.village || data.address.town || data.address.city || data.address.hamlet || '';
        container.querySelector('#locVillage').value = village;

        // Auto-guess Rural/Urban based on 'village' key
        if (data.address.village || data.address.hamlet) {
          container.querySelector('#locRuralUrban').value = 'Rural';
        } else if (data.address.city || data.address.town) {
          container.querySelector('#locRuralUrban').value = 'Urban';
        }

        useLocationBtn.textContent = '📍 Address Found';
      } else {
        useLocationBtn.textContent = '📍 Location Set (Address Not Found)';
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      useLocationBtn.textContent = '📍 Location Set (Manual Entry Needed)';
    } finally {
      useLocationBtn.disabled = false;
      setTimeout(() => {
        // Reset button text only if successful
        if (useLocationBtn.textContent === '📍 Address Found') {
          useLocationBtn.textContent = '📍 Use Current Location';
        }
      }, 3000);
    }
  };

  // Initialize Map function
  const initMap = (lat, lng) => {
    if (map) {
      map.setView([lat, lng], 13);
      if (marker) marker.setLatLng([lat, lng]);
      else {
        marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        marker.on('dragend', function (e) {
          const position = marker.getLatLng();
          latInput.value = position.lat;
          lngInput.value = position.lng;
          fetchAddress(position.lat, position.lng);
        });
      }
      return;
    }

    mapDiv.style.display = 'block';
    // Default or provided coordinates. If no coords, default to Bangalore
    const startLat = lat || 12.9716;
    const startLng = lng || 77.5946;

    map = L.map('map').setView([startLat, startLng], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    marker = L.marker([startLat, startLng], { draggable: true }).addTo(map);
    latInput.value = startLat;
    lngInput.value = startLng;

    // Update input on drag
    marker.on('dragend', function (e) {
      const position = marker.getLatLng();
      latInput.value = position.lat;
      lngInput.value = position.lng;
      fetchAddress(position.lat, position.lng);
    });

    // Move marker on map click
    map.on('click', function (e) {
      marker.setLatLng(e.latlng);
      latInput.value = e.latlng.lat;
      lngInput.value = e.latlng.lng;
      fetchAddress(e.latlng.lat, e.latlng.lng);
    });
  };

  // Show map initially with default coords on load
  setTimeout(() => initMap(), 500);

  useLocationBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    useLocationBtn.textContent = '📍 Detecting...';
    useLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Update Map
        initMap(latitude, longitude);

        // Update inputs
        latInput.value = latitude;
        lngInput.value = longitude;

        // Fetch Real Address
        fetchAddress(latitude, longitude);
      },
      (error) => {
        alert('Unable to retrieve your location. Please enter details manually.');
        useLocationBtn.textContent = '📍 Use Current Location';
        useLocationBtn.disabled = false;
        initMap();
      }
    );
  });

  // Handle file selection
  evidenceInput.addEventListener('change', (e) => {
    const newFiles = Array.from(e.target.files);
    selectedFiles = [...selectedFiles, ...newFiles];
    renderFileList();
    // Reset input so same file can be selected again if needed (though duplicated in list)
    evidenceInput.value = '';
  });

  const renderFileList = () => {
    fileList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.style.background = 'rgba(255,255,255,0.05)';
      item.style.padding = '0.5rem';
      item.style.borderRadius = '6px';

      const name = document.createElement('span');
      name.textContent = file.name;
      name.style.fontSize = '0.9rem';

      const removeBtn = document.createElement('button');
      removeBtn.textContent = '×';
      removeBtn.style.background = 'none';
      removeBtn.style.border = 'none';
      removeBtn.style.color = '#ef4444';
      removeBtn.style.fontSize = '1.2rem';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.marginLeft = '1rem';
      removeBtn.onclick = (e) => {
        e.preventDefault(); // Prevent form submission
        selectedFiles.splice(index, 1);
        renderFileList();
      };

      item.appendChild(name);
      item.appendChild(removeBtn);
      fileList.appendChild(item);
    });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const user = api.getCurrentUser();
    const formData = new FormData(form);

    // Collect checkbox values for Channel
    const channels = [];
    form.querySelectorAll('input[name="channel"]:checked').forEach(cb => channels.push(cb.value));
    if (formData.get('channelOther')) channels.push(formData.get('channelOther'));

    // Process selected files names
    const evidenceFileNames = selectedFiles.map(f => f.name).join(', ');

    // Construct schema matching `complaint_example`
    const complaintData = {
      // -- NEW SCHEMA FIELDS --
      complaint_timestamp: `${formData.get('date')} ${formData.get('time')}:00`,
      victim_state: formData.get('locationState'),
      victim_district: formData.get('locationDistrict'),
      victim_taluka: formData.get('locationTaluka'),
      victim_village: formData.get('locationVillage'),
      victim_pincode: Number(formData.get('locationPincode')),
      victim_rural_urban: formData.get('ruralUrban'),
      victim_lat: Number(formData.get('latitude')) || 0,
      victim_lon: Number(formData.get('longitude')) || 0,
      channel: 'NCRP', // Default as per schema example, or map from formData.get('channel') if needed
      fraud_type: formData.get('fraudType') === 'Other' ? formData.get('fraudTypeOther') : formData.get('fraudType'),
      bank_name: formData.get('bankName'),
      reported_loss_amount: Number(formData.get('lossAmount')),
      num_transactions: Number(formData.get('transactionCount')),
      device_type: formData.get('deviceType'),
      is_otp_shared: formData.get('sharedOtp') === 'Yes' ? 1 : 0,
      clicked_malicious_link: formData.get('clickedLink') === 'Yes' ? 1 : 0,
      account_age_months: Number(formData.get('accountAge')) || 0,


      // -- KEEPING EXISTING FIELDS JUST IN CASE (Optional, but good for UI display compatibility if needed) --
      id: 'CMP-' + Date.now().toString().slice(-6), // generated in backend usually, but structure might need it
      userId: user.aadhaar,
      description: formData.get('description'),
      evidence: evidenceFileNames,
      status: 'Submitted',
      // Preserve other form data in a 'meta' object if needed, or just flatten as above
      raw_channels: channels, // Store the checkbox array if needed
      payment_app: formData.get('paymentApp'),
      utr: formData.get('utr'),
      card_details: {
        used: formData.get('usedCard') ? 'Yes' : 'No',
        type: formData.get('cardType'),
        last4: formData.get('cardLast4')
      }
    };

    try {
      const result = await api.submitComplaint(complaintData);

      // Redirect to success page
      window.router.navigateTo(`/complaint-success?id=${result.id}`);

    } catch (err) {
      msg.style.color = '#ef4444';
      msg.textContent = 'Failed to submit complaint.';
      btn.disabled = false;
      btn.textContent = 'Submit Complaint';
    }
  });

  return container;
};
