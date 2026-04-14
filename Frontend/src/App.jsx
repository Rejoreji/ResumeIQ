import React, { useState } from 'react'
import UploadPage from '../components/UploadPage'
import ResultPage from '../components/ResultPage'
import LoadingScreen from '../components/LoadingScreen'

const App = () => {
  const [step, setStep] = useState("upload")   // controls which screen to show
  const [results, setResults] = useState(null) // stores the AI analysis result

  const handleAnalyze = async (resumeText, jobDescription) => {
    setStep("analyzing") // show loading screen

    try {
      const response = await fetch("http://localhost:5001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      })

      const data = await response.json()
      setResults(data)
      setStep("results") // show results screen

    } catch (error) {
      console.error("Error analyzing resume:", error)
      setStep("upload") // go back if something fails
    }
  }

  const handleReset = () => {
    setResults(null)
    setStep("upload") // go back to start
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {step === "upload"    && <UploadPage onAnalyze={handleAnalyze} />}
      {step === "analyzing" && <LoadingScreen />}
      {step === "results"   && <ResultPage results={results} onReset={handleReset} />}
    </div>
  )
}

export default App
