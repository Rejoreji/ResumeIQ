const dotenv = require("dotenv")
dotenv.config({path: __dirname+"/.env"})

const express = require("express")
const cors = require("cors")

const { analyzeResume } = require("./resumeAnalyzer")

// load environment variables from .env file


const app = express()
const PORT = process.env.PORT || 5001

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
    // send to Claude and wait for result
    const result = await analyzeResume(resumeText, jobDescription)

    // send result back to React app
    res.json(result)

  } catch (error) {
    console.error("Error analyzing resume:", error)
    res.status(500).json({ error: "Something went wrong. Please try again." })
  }
})


// ── Start Server ────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})