const dotenv = require("dotenv")
dotenv.config({path: __dirname+"/.env"})

const express = require("express")
const cors = require("cors")
const multer = require("multer")
const pdfParse = require("pdf-parse")

const { analyzeResume } = require("./resumeAnalyzer")


const app = express()
const PORT = process.env.PORT || 5001

// store uploaded file in memory (not on disk)
const upload = multer({ storage: multer.memoryStorage() })

// ── Middleware ──────────────────────────────────────────
// allows your React app (localhost:5173) to talk to this server
app.use(cors({
  origin: "http://localhost:5173"
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

  // check if file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No PDF file uploaded" })
  }

  // check if it's actually a PDF
  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({ error: "Only PDF files are allowed" })
  }

  try {
    // extract text from the PDF buffer
    const pdfData = await pdfParse(req.file.buffer)
    const resumeText = pdfData.text

    if (!resumeText || resumeText.trim() === "") {
      return res.status(400).json({ error: "Could not extract text from PDF" })
    }

    const jobDescription = req.body.jobDescription || ""

    // send extracted text to Gemini
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