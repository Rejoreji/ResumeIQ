const dotenv = require("dotenv")
dotenv.config({path: __dirname+"/.env"})

const express = require("express")
const cors = require("cors")
const multer = require("multer")
// ✅ Use direct path instead
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs")
//pdfjs-dist/legacy/build/pdf.js
console.log("pdf-parse type:", typeof pdfjsLib)

const { analyzeResume } = require("./resumeAnalyzer")


const app = express()
const PORT = process.env.PORT || 5001

// store uploaded file in memory (not on disk)
const upload = multer({ storage: multer.memoryStorage() })

// ── Helper — extract text from PDF buffer ──────────────
const extractTextFromPDF = async (buffer) => {
  const uint8Array = new Uint8Array(buffer)
  const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise

  let fullText = ""

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => item.str).join(" ")
    fullText += pageText + "\n"
  }

  return fullText
}

// ── Middleware ──────────────────────────────────────────
// allows your React app (localhost:5173) to talk to this server
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://resume-iq-rouge.vercel.app"  
  ]
}))

// allows the server to understand JSON in request bodies
app.use(express.json())


// ── Routes ──────────────────────────────────────────────

// health check — visit http://localhost:5000 to confirm server is running
app.get("/", (req, res) => {
  res.json({ message: "Resume Analyzer API is running!" })
})

// main route — React app sends resume here
app.post("/analyze", async (req, res) => {

  const { resumeText, jobDescription } = req.body

  // basic validation
  if (!resumeText || resumeText.trim() === "") {
    return res.status(400).json({ error: "Resume text is required" })
  }

  try {
    // send to gemini and wait for result
    const result = await analyzeResume(resumeText, jobDescription)

    // send result back to React app
    res.json(result)

  } catch (error) {
    console.error("Error analyzing resume:", error)
    res.status(500).json({ error: "Something went wrong. Please try again." })
  }
})

app.post("/upload-pdf", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No PDF file uploaded" })
  }

  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({ error: "Only PDF files are allowed" })
  }

  try {
    const resumeText = await extractTextFromPDF(req.file.buffer)

    console.log("Extracted text preview:", resumeText.slice(0, 200))

    if (!resumeText || resumeText.trim() === "") {
      return res.status(400).json({ error: "Could not extract text from PDF" })
    }

    const jobDescription = req.body.jobDescription || ""
    const result = await analyzeResume(resumeText, jobDescription)
    res.json(result)

  } catch (error) {
    console.error("Error processing PDF:", error)
    res.status(500).json({ error: "Failed to process PDF. Please try again." })
  }
})


// ── Start Server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})