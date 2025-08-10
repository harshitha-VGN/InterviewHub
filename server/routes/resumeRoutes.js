// server/routes/resumeRoutes.js

const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
const latex = require('node-latex');

const router = express.Router();

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

// In server/routes/resumeRoutes.js

const getAIPrompt_LaTeX = (resumeText, jobDescription) => {
  return `
    You are a world-class resume designer and technical writer who specializes in creating modern, one-page resumes for software engineers using LaTeX.
    Your task is to take the user's resume text, analyze it against the job description, and generate a visually stunning, ATS-friendly, one-page resume in LaTeX code.
    You must use a robust, conflict-free setup that relies on universal Unicode characters instead of external icon packages.

    **CONTENT INSTRUCTIONS:**
    1.  **Concise and Impactful:** Rewrite content to be powerful and to the point. The final resume MUST fit on a single page.
    2.  **Keywords & Action Verbs:** Integrate keywords from the job description and start bullet points with strong action verbs.
    3.  **Preserve Personal Info:** Do not change the user's name, email, phone, or university.

    **LATEX STYLING & FORMATTING INSTRUCTIONS (VERY IMPORTANT):**
    1.  **One-Page Limit:** This is a strict requirement.
    2.  **Required Packages (Minimal & Robust):** You MUST include the following core packages. DO NOT include 'fontawesome5'.
        - \`\\usepackage[a4paper,margin=0.7in]{geometry}\`
        - \`\\usepackage{fontspec}\`
        - \`\\usepackage[colorlinks=true, urlcolor=blue, linkcolor=blue]{hyperref}\`
        - \`\\usepackage{titlesec}\`
        - \`\\usepackage{enumitem}\`
        - \`\\pagestyle{empty}\`
    3.  **Font Setup:** DO NOT use \\setmainfont. Immediately after \\begin{document}, you MUST add the command \`\\sffamily\` to switch the entire document to the default, universally available sans-serif font.
    4.  **Header (Name & Contact):**
        - User's name at the top, centered, and large (\`\\Huge\`).
        - Below, use \`{\\large ...}\` to group the contact info line.
        - Use simple Unicode symbols for icons: 📍 for location, 📞 for phone, 📧 for email.
        - For GitHub and LeetCode, just use the hyperlinked text, which is cleaner and more ATS-friendly. Example: \`\\href{...}{GitHub}\`.
    5.  **Section Titles:**
        - Use 'titlesec' to create un-numbered sections. The command \`\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]\` is perfect for this.
    6.  **Lists:** For all bulleted lists, use \`\\begin{itemize}[leftmargin=*, noitemsep, nolistsep]\` to make them clean and compact.
    7.  **Education/Experience Entries Layout:**
        - Use the structure: \`\\textbf{Title on Left} \\hfill \\textit{Location/Date on Right}\`.

    **FINAL OUTPUT:**
    Return ONLY the raw, complete, and valid LaTeX code.

    **Job Description:**
    ---
    ${jobDescription}
    ---

    **Original Resume Text:**
    ---
    ${resumeText}
    ---

    Now, generate the complete, one-page LaTeX code.
    `;
};

// Configure Multer for file upload
const upload = multer({ dest: 'uploads/' });

// POST /api/resume/analyze
// server/routes/resumeRoutes.js

// POST /api/resume/analyze
router.post('/analyze', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No resume file uploaded.' });
  }
  const { jobDescription } = req.body;
  if (!jobDescription) {
    return res.status(400).json({ error: 'Job description is required.' });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdf(dataBuffer);
    const resumeText = data.text;
    fs.unlinkSync(req.file.path);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ],
    });
    
    const prompt = getAIPrompt_LaTeX(resumeText, jobDescription);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let revisedResumeLaTeX = response.text();

    revisedResumeLaTeX = revisedResumeLaTeX.replace(/^```latex/, '').replace(/```$/, '').trim();

    console.log("--- START: Cleaned Gemini API Response ---");
    console.log(revisedResumeLaTeX);
    console.log("--- END: Cleaned Gemini API Response ---");

    if (!revisedResumeLaTeX || revisedResumeLaTeX.trim() === '') {
        console.error("The AI returned an empty or invalid response.");
        return res.status(500).json({ error: "The AI failed to generate a resume. This might be due to content restrictions." });
    }

    // Ensure we are using the xelatex compiler for font/icon support
    const pdfStream = latex(revisedResumeLaTeX, {
        cmd: '/Library/TeX/texbin/xelatex', // Use the full path you got from `which xelatex`
        errorLogs: 'latex_error.log'
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=revised-resume.pdf');
    
    pdfStream.pipe(res);

    pdfStream.on('error', err => {
      console.error("LaTeX Compilation Error:", err.message);
      const logFilePath = 'latex_error.log';
      if (fs.existsSync(logFilePath)) {
          const errorLog = fs.readFileSync(logFilePath, 'utf8');
          console.error("--- LaTeX Error Log --- \n", errorLog);
      } else {
          console.error("--- No LaTeX log file was generated. ---");
      }
    });

  } catch (error) {
    console.error('Error during resume analysis:', error);
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }
    if (!res.headersSent) {
      res.status(500).json({ error: 'An error occurred during analysis.' });
    }
  }
});
module.exports = router;