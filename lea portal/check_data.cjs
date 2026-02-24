const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data', 'mockData.js');
try {
    const data = fs.readFileSync(dataPath, 'utf8');
    if (data.includes('Pune')) {
        console.log("FOUND PUNE! showing context:");
        const index = data.indexOf('Pune');
        console.log(data.substring(index - 50, index + 50));
    } else {
        console.log("NO PUNE FOUND IN THE DATASET.");

        // Show available zones
        console.log("\nSome available zones found in data:");
        const matches = data.match(/"zone": "(.*?)"/g);
        if (matches) {
            const zones = [...new Set(matches.map(m => m.replace('"zone": "', '').replace('"', '')))];
            console.log(zones.slice(0, 10).join('\n'));
        }
    }
} catch (e) {
    console.error(e);
}
