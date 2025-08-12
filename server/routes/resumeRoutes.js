const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const puppeteer = require('puppeteer'); // We are using Puppeteer now

const router = express.Router();
const JSON5 = require('json5');

// --- PROMPT 1: The AI now returns structured JSON, not code ---
const getAIPrompt_JSON = (resumeText, jobDescription) => {
  return `
    You are an expert technical recruiter and resume writer. Your task is to analyze the following resume text in the context of the provided job description.
    Rewrite and improve the content to be professional and impactful.
    Then, structure the entire rewritten resume into a JSON object.

    *CONTENT INSTRUCTIONS:*
    1.  *Analyze Keywords:* Identify keywords from the job description and naturally integrate them.
    2.  *Action Verbs:* Start all experience/project bullet points with strong action verbs.
    3.  *Quantify Achievements:* Add metrics or quantifiable results where possible.
    4.  *Concise and Professional:* Keep the language professional and concise, ensuring it fits on a single page.
    5.  *Preserve Personal Info:* Do not change the person's name, email, or phone number.

    *JSON STRUCTURE INSTRUCTIONS:*
    -   The root object should have keys: "name", "contact", "summary", "experience", "education", "skills", "projects", "achievements", "languages".
    -   "contact" should be an object with "email", "phone", "location", "linkedin", "github", "portfolio".
    -   "experience", "education", "projects", and "achievements" should be arrays of objects.
    -   Each object in "experience" or "projects" should have "title", "company" (or "platform"), "date", and an array of "description" points.
    -   "skills" should be an object with categories like "languages", "technologies", "tools".
    -   If a section is empty in the original resume (e.g., no 'Experience'), return an empty array for it in the JSON.
    -   Return ONLY the raw JSON object. Do not wrap it in markdown or add any commentary.

    *Job Description:*
    ---
    ${jobDescription}
    ---

    *Original Resume Text:*
    ---
    ${resumeText}
    ---

    Now, provide the rewritten resume content as a single, valid JSON object.
    `;
};

// --- TEMPLATE 2: A professional HTML/CSS template to render the JSON data ---
const getResumeHTML = (data) => {
  const { name, contact, summary, experience, education, skills, projects, achievements, languages } = data;
  
  // Helper to generate list items from an array
  const createList = (items) => items.map(item => `<li> ${item} </li>` ).join('');
  
  // The complete HTML with embedded CSS
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${name}'s Resume</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
            body {
                font-family: 'Lato', sans-serif;
                font-size: 11pt;
                line-height: 1.5;
                background: #fff;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .page {
                width: 8.5in;
                height: 11in;
                box-sizing: border-box;
                padding: 0.7in;
            }
            h1 {
                font-size: 24pt;
                text-align: center;
                margin: 0;
                padding-bottom: 5px;
                border-bottom: 2px solid #333;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            .contact-info {
                text-align: center;
                margin-top: 10px;
                font-size: 10pt;
            }
            .contact-info a {
                color: #0073b1;
                text-decoration: none;
            }
            .contact-info span {
                margin: 0 10px;
            }
            section {
                margin-top: 20px;
            }
            h2 {
                font-size: 14pt;
                text-transform: uppercase;
                letter-spacing: 1px;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
                margin-bottom: 10px;
            }
            .entry {
                margin-bottom: 12px;
            }
            .entry-header {
                display: flex;
                justify-content: space-between;
                font-weight: 700;
            }
            .entry-header .title { font-size: 12pt; }
            .entry-header .date { font-style: italic; }
            .company { font-weight: 700; font-style: italic; }
            ul {
                padding-left: 20px;
                margin-top: 5px;
            }
            li { margin-bottom: 4px; }
            .skills-list {
                list-style-type: none;
                padding-left: 0;
            }
            .skills-list li {
                margin-bottom: 5px;
            }
        </style>
    </head>
    <body>
        <div class="page">
            <h1>${name || ''}</h1>
            <div class="contact-info">
                ${contact.location ? `<span>${contact.location}</span>` : ''}
                ${contact.phone ? `<span>${contact.phone}</span> `: ''}
                ${contact.email ? `<span><a href="mailto:${contact.email}">${contact.email}</a></span>` : ''}
                ${contact.github ? `<span><a href="${contact.github}">GitHub</a></span>` : ''}
                ${contact.linkedin ? `<span><a href="${contact.linkedin}">LinkedIn</a></span>` : ''}
            </div>
            
            ${summary ? `<section><h2>Summary</h2><p>${summary}</p></section>` : ''}

            ${projects && projects.length > 0 ? `
            <section>
                <h2>Projects</h2>
                ${projects.map(p => `
                <div class="entry">
                    <div class="entry-header">
                        <span class="title">${p.title}</span>
                        <span class="date">${p.date}</span>
                    </div>
                    ${p.platform ? `<div class="company">${p.platform}</div>` : ''}
                    <ul>${createList(p.description)}</ul>
                </div>`).join('')}
            </section>` : ''}

            ${skills ? `
            <section>
                <h2>Technical Skills</h2>
                <ul class="skills-list">
                    ${Object.entries(skills).map(([category, list]) => `
                        <li><strong>${category}:</strong> ${Array.isArray(list) ? list.join(', ') : list}</li>
                    `).join('')}
                </ul>
            </section>` : ''}
            
            ${education && education.length > 0 ? `
            <section>
                <h2>Education</h2>
                ${education.map(e => `
                <div class="entry">
                    <div class="entry-header">
                        <span class="title">${e.degree}</span>
                        <span class="date">${e.date}</span>
                    </div>
                    <div class="company">${e.university}</div>
                    ${e.gpa ? `<div>GPA: ${e.gpa}</div>` : ''}
                </div>`).join('')}
            </section>` : ''}

            ${achievements && achievements.length > 0 ? `
            <section>
                <h2>Achievements</h2>
                <ul>${createList(achievements.map(a => a.description))}</ul>
            </section>` : ''}

        </div>
    </body>
    </html>`;
};

// --- ROUTE 3: The Express route now uses Puppeteer ---
const upload = multer({ dest: 'uploads/' });
router.post('/analyze', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No resume file uploaded.' });
  }

  const tempFilePath = req.file.path;

  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    const dataBuffer = fs.readFileSync(tempFilePath);
    const data = await pdf(dataBuffer);
    const resumeText = data.text;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const prompt = getAIPrompt_JSON(resumeText, jobDescription);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawTextFromAI = response.text();

    // --- START: THE DEFINITIVE, ROBUST FIX ---
    let resumeData;
    try {
        // 1. Find the start and end of the JSON object within the raw text.
        const firstBraceIndex = rawTextFromAI.indexOf('{');
        const lastBraceIndex = rawTextFromAI.lastIndexOf('}');

        if (firstBraceIndex === -1 || lastBraceIndex === -1 || lastBraceIndex < firstBraceIndex) {
            console.error("Could not find a valid JSON object in the AI's response.");
            throw new Error("Invalid structure in AI response.");
        }

        // 2. Extract the JSON object substring.
        const jsonSubstring = rawTextFromAI.substring(firstBraceIndex, lastBraceIndex + 1);

        // 3. Parse only the extracted, clean substring.
        resumeData = JSON5.parse(jsonSubstring);

    } catch(e) {
        console.error("Failed to extract or parse JSON from AI response:", rawTextFromAI);
        throw new Error("The AI returned an unrecoverable data format.");
    }
    // --- END: THE DEFINITIVE, ROBUST FIX ---
    
    console.log("Successfully parsed resume data from AI.");

    // Generate PDF using Puppeteer
    console.log("Launching Puppeteer to generate PDF...");
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    const htmlContent = getResumeHTML(resumeData);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();
    console.log("PDF generated successfully.");

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=revised-resume.pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error during resume analysis:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'An error occurred during analysis.' });
    }
  } finally {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log(`Cleaned up temporary file: ${tempFilePath}`);
    }
  }
});

module.exports = router;