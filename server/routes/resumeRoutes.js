
// server/routes/resumeRoutes.js

const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const puppeteer = require('puppeteer');
const JSON5 = require('json5');

const router = express.Router();

// --- PROMPT: The final, robust version for JSON generation with precise link handling ---
// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

const getAIPrompt_JSON = (resumeText, jobDescription) => {
  return `
    You are a world-class resume designer and data extractor. Your task is to analyze the user's resume text, improve the content based on the job description, and structure the result into a precise JSON object.

    **CONTENT IMPROVEMENT INSTRUCTIONS (MOST IMPORTANT):**
    1.  **Analyze and Rewrite:** Rewrite every project and experience bullet point to be more professional.
    2.  **Use the STAR Method:** For each bullet point, implicitly follow the STAR method (Situation, Task, Action, Result). Describe the action taken and, critically, the positive RESULT.
    3.  **Quantify Everything:** Where possible, add compelling, realistic metrics to demonstrate impact. Examples: "Reduced API response time by 200ms," "Increased user engagement by 15%."
    4.  **Use Powerful Action Verbs:** Start bullet points with verbs like "Architected," "Engineered," "Optimized," "Implemented," "Spearheaded."
    5. keep CGPA in Education section if available, but do not add it if not present in the original resume.

    **CRITICAL DATA & LINK EXTRACTION RULES:**
    1.  **CONTACT & PROFILE LINKS:** Your most important task is to meticulously scan the ENTIRE resume text to find all personal profile links. Create a 'links' object and populate it with any URLs you find for: "github", "linkedin", "leetcode".
    2.  **PROJECT-SPECIFIC LINKS:** If a URL is associated with a specific project, you MUST place that URL in the 'link' key for THAT project object ONLY.
    3.  **PRESERVE CONTACT INFO:** You MUST use the exact name, email, and phone number from the original resume.

    **JSON STRUCTURE INSTRUCTIONS (VERY IMPORTANT):**
    -   Return ONLY a single, raw JSON object. Do not wrap it in markdown.
    -   The root object must have keys: "name", "contact", "links", "summary", "projects", "education", "skills", "achievements".
    -   "contact" must be an object with "email", "phone", "location".
    -   **CRITICAL FOR SKILLS:** "skills" must be an array of objects. Each object MUST have two keys: "category" (e.g., "Programming Languages") and "items" (a single string of comma-separated skills, e.g., "C, C++, JavaScript, Python").
    -   "projects" must be an array of objects, each with "title", "description" (an array of rewritten strings), and an optional "link".
    -   If a section is empty, return an empty array or object for it.

    **Job Description:**
    ---
    ${jobDescription}
    ---

    **Original Resume Text:**
    ---
    ${resumeText}
    ---

    Now, generate the complete, enhanced resume as a single, valid JSON object.
    `;
};
// --- TEMPLATE: The final, professional HTML template with embedded SVG icons ---
// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

const getResumeHTML = (data) => {
  const { name, contact = {}, links = {}, summary, projects = [], education = [], skills = [], achievements = [] } = data;

  const icons = {
    location: `<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: -0.125em; margin-right: 0.3em;"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>`,
    phone: `<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: -0.125em; margin-right: 0.3em;"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163l2.292 1.757c.36.276.527.739.432 1.18l-.38.963a.636.636 0 0 0 .124.634l3.018 3.018a.636.636 0 0 0 .634.124l.963-.38a1.125 1.125 0 0 1 1.18.432l1.757 2.292a1.745 1.745 0 0 1 .163 2.612l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.363-1.031-.038-2.137.703-2.877L1.885.513z"/></svg>`,
    email: `<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: -0.125em; margin-right: 0.3em;"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"/></svg>`,
    github: `<svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: -0.125em; margin-right: 0.3em;"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
  };

  const createList = (items) => (items || []).map(item => `<li>${item}</li>`).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${name}'s Resume</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
            body { font-family: 'Lato', sans-serif; font-size: 11pt; line-height: 1.5; color: #333333; }
            .page { width: 8.5in; height: 11in; box-sizing: border-box; padding: 0.8in; }
            a { color: #0073b1; text-decoration: none; }
            a:hover { text-decoration: underline; }
            .header { text-align: center; margin-bottom: 25px; }
            h1 { font-size: 32pt; margin: 0; font-weight: 700; }
            .contact-info { margin-top: 10px; font-size: 10pt; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 5px 20px; color: #555555; }
            .contact-item { display: inline-flex; align-items: center; }
            section { margin-bottom: 20px; }
            h2 { font-size: 14pt; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1.5px solid #333333; padding-bottom: 5px; margin-bottom: 10px; }
            .entry { margin-bottom: 15px; }
            .entry-header { display: flex; justify-content: space-between; align-items: baseline; font-weight: 700; margin-bottom: 2px; }
            .title { font-size: 12pt; }
            .date { font-style: italic; color: #555555; }
            .sub-header { font-weight: 400; font-style: italic; color: #555555; }
            ul { padding-left: 18px; margin-top: 8px; }
            li { margin-bottom: 5px; }
            .skills-list { list-style-type: none; padding-left: 0; }
            .skills-list li { display: flex; margin-bottom: 5px; }
            .skills-list strong { font-weight: 700; min-width: 150px; }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="header">
                <h1>${name || ''}</h1>
                <div class="contact-info">
                    ${contact.location ? `<span class="contact-item">${icons.location}${contact.location}</span>` : ''}
                    ${contact.phone ? `<span class="contact-item">${icons.phone}${contact.phone}</span>` : ''}
                    ${contact.email ? `<a class="contact-item" href="mailto:${contact.email}">${icons.email}${contact.email}</a>` : ''}
                    ${links.github ? `<a class="contact-item" href="${links.github}" target="_blank">${icons.github}GitHub</a>` : ''}
                </div>
            </div>
            
            ${summary ? `<section><h2>Summary</h2><p>${summary}</p></section>` : ''}
            
            ${education.length > 0 ? `
            <section>
                <h2>Education</h2>
                ${education.map(e => `
                <div class="entry">
                    <div class="entry-header">
                        <span class="title">${e.university || ''}</span>
                        <span class="date">${e.date || ''}</span>
                    </div>
                    <div class="sub-header">${e.degree || ''}</div>
                    ${e.gpa ? `<div>${e.gpa}</div>` : ''}
                </div>`).join('')}
            </section>` : ''}

            ${projects.length > 0 ? `
            <section>
                <h2>Projects</h2>
                ${projects.map(p => `
                <div class="entry">
                    <div class="entry-header">
                        <span class="title">${p.title || ''}</span>
                        <span class="date">
                            ${p.link ? `<a href="${p.link}" target="_blank">${icons.github} GitHub Link</a>` : ''}
                        </span>
                    </div>
                    ${p.tech ? `<div class="sub-header">${p.tech}</div>` : ''}
                    <ul>${createList(p.description)}</ul>
                </div>`).join('')}
            </section>` : ''}

            ${skills.length > 0 ? `
            <section>
                <h2>Skills</h2>
                <ul class="skills-list">
                    ${skills.map(s => `<li><strong>${s.category || ''}:</strong> <span>${s.items || ''}</span></li>`).join('')}
                </ul>
            </section>` : ''}
            
            ${achievements.length > 0 ? `
            <section>
                <h2>Achievements</h2>
                <ul>${createList(achievements.map(a => (typeof a === 'string' ? a : a.description)))}</ul>
            </section>` : ''}
        </div>
    </body>
    </html>`;
};
// --- ROUTE: The final, robust server logic ---
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

    let resumeData;
    try {
        const firstBraceIndex = rawTextFromAI.indexOf('{');
        const lastBraceIndex = rawTextFromAI.lastIndexOf('}');
        if (firstBraceIndex === -1 || lastBraceIndex === -1) {
            throw new Error("No JSON object found in AI response.");
        }
        const jsonSubstring = rawTextFromAI.substring(firstBraceIndex, lastBraceIndex + 1);
        resumeData = JSON5.parse(jsonSubstring);
    } catch(e) {
        console.error("Failed to extract or parse JSON from AI response:", rawTextFromAI);
        throw new Error("The AI returned an unrecoverable data format.");
    }
    
    console.log("Successfully parsed resume data from AI.");

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

