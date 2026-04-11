const fs = require('fs');
const pdf = require('pdf-parse');
async function run() {
  try {
    const dataBuffer = fs.readFileSync('package.json'); // Just to test if pdf-parse rejects non-pdf
    await pdf(dataBuffer);
    console.log("Parsed!");
  } catch(e) { console.error("Error:", e.message); }
}
run();
