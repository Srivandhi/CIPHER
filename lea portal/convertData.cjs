const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'prediction_output.csv');
const outputPath = path.join(__dirname, 'src', 'data', 'mockData.js');

try {
  const data = fs.readFileSync(csvPath, 'utf8');
  const lines = data.split(/\r?\n/);

  const alerts = [];
  const validAtms = new Set();
  const validZones = new Set();

  const parseLine = (text) => {
    const result = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        result.push(cur);
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur);
    return result;
  };

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const row = parseLine(lines[i]);
    if (row.length < 5) continue;

    const atmId = row[0].trim();
    const atmName = row[1].trim();
    const zone = row[2] ? row[2].replace(/"/g, '').trim() : "Unknown Zone";
    const probability = parseFloat(row[6]);
    const riskClass = row[7];
    const comments = row[12] ? row[12].replace(/"/g, '') : "Suspicious activity detected";

    if (atmId) {
      validAtms.add(JSON.stringify({ id: atmId, name: atmName }));
      if (zone) validZones.add(zone);

      alerts.push({
        id: 'PRED-' + i,
        caseId: 'CASE-' + (2025000 + i),
        atmId: atmId,
        atmName: atmName,
        zone: zone,
        location: zone,
        probability: isNaN(probability) ? 0.5 : probability,
        status: 'Active',
        description: comments,
        riskClass: riskClass
      });
    }
  }

  const uniqueAtmsArray = Array.from(validAtms).map(s => JSON.parse(s));
  const uniqueZonesArray = Array.from(validZones);

  const atmUsers = uniqueAtmsArray.slice(0, 3).map((atm, index) => ({
    id: 'LEA-ATM-00' + (index + 1),
    username: 'officer' + (index + 1),
    password: "password123",
    name: 'Unit Officer ' + atm.id,
    badgeNumber: String(8000 + index),
    atmId: atm.id,
    role: "ATM Officer"
  }));

  const policeUsers = uniqueZonesArray.slice(0, 3).map((zone, index) => ({
    id: 'LEA-POL-00' + (index + 1),
    username: 'police' + (index + 1),
    password: "password123",
    name: 'Insp. ' + zone.split(',')[0],
    badgeNumber: String(9000 + index),
    zone: zone,
    role: "Police Officer"
  }));

  const allUsers = [...atmUsers, ...policeUsers];

  // We are creating a JS module file, not JSON
  const fileContent = `
// 1. Users Database
const defaultUsers = ${JSON.stringify(allUsers, null, 2)};

// Load from LocalStorage if available, otherwise use default
const storedUsers = localStorage.getItem('lea_portal_users');
export const users = storedUsers ? JSON.parse(storedUsers) : defaultUsers;

// 2. Control Layer - Alerts
const potentialSpots = ${JSON.stringify(alerts, null, 2)};

// History Database
let historyLog = [];

// 3. Methods

export const loginUser = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return { success: true, user: { ...user } };
  }
  return { success: false, message: "Invalid credentials" };
};

export const registerUser = (userData) => {
  if (users.find(u => u.username === userData.username)) {
    return { success: false, message: "Username already exists" };
  }
  
  const role = userData.zone ? "Police Officer" : "ATM Officer";
  
  const newUser = {
    id: 'LEA-' + Math.floor(Math.random() * 1000),
    role: userData.role || role,
    ...userData
  };
  users.push(newUser);
  
  // PERSIST TO LOCAL STORAGE
  localStorage.setItem('lea_portal_users', JSON.stringify(users));
  
  return { success: true, user: newUser };
};

export const getAlertsForUser = (user) => {
  if (user.role === 'Police Officer') {
     // Robust Fuzzy Search: Normalize both strings (remove spaces/punctuation, lowercase)
     const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
     const searchZone = normalize(user.zone);
     
     return potentialSpots.filter(spot => 
       normalize(spot.zone).includes(searchZone) && spot.status === 'Active'
     ).sort((a, b) => b.probability - a.probability);
  } else {
     // ATM Officer: strict ID match
     return potentialSpots.filter(spot => String(spot.atmId) === String(user.atmId) && spot.status === 'Active')
        .sort((a, b) => b.probability - a.probability);
  }
};

export const getHistoryForUser = (user) => {
  if (user.role === 'Police Officer') {
     const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
     const searchZone = normalize(user.zone);
     
     return historyLog.filter(h => normalize(h.zone).includes(searchZone))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else {
     return historyLog.filter(h => String(h.atmId) === String(user.atmId))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
};

export const markAlertComplete = (alertId, _) => {
  const alertIndex = potentialSpots.findIndex(p => p.id === alertId);
  if (alertIndex > -1) {
    const alert = potentialSpots[alertIndex];
    alert.status = 'Completed';
    
    historyLog.unshift({
      ...alert,
      id: 'HIST-' + Date.now(),
      originalId: alert.id,
      timestamp: new Date().toISOString(),
      action: "Intervention Completed"
    });
    return true;
  }
  return false;
};

export const getPerformanceData = (id) => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: i + ':00',
      transactions: Math.floor(Math.random() * 200) + 50,
      alerts: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0
    });
  }
  return data;
};
`;

  fs.writeFileSync(outputPath, fileContent);
  console.log('Success: mockData.js generated with Dual Role support.');
  console.log('New Demo Credentials:');
  allUsers.forEach(u => {
    if (u.role === 'Police Officer') console.log('POLICE: ' + u.username + ' | Zone: ' + u.zone);
    else console.log('ATM   : ' + u.username + ' | ATM ID: ' + u.atmId);
  });

} catch (err) {
  console.error("Error:", err);
  process.exit(1);
}
