import React, { useState } from 'react'
import UploadPage from '../components/UploadPage'
import ResultPage from '../components/ResultPage'
import LoadingScreen from '../components/LoadingScreen'


const App = () => {
  const [step, setStep] = useState("upload")   // controls which screen to show
  const [results, setResults] = useState(null) // stores the AI analysis result

const handleAnalyze = async (resumeText, jobDescription, formData) => {
    setStep("analyzing")

    try {
      let response

      if (formData) {
        // PDF upload — send as multipart form
        response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
          method: "POST",
          body: formData, // no Content-Type header needed for FormData
        })
      } else {
        // plain text — send as JSON
        response = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText, jobDescription }),
        })
      }

      const data = await response.json()
      setResults(data)
      setStep("results")

    } catch (error) {
      console.error("Error analyzing resume:", error)
      setStep("upload")
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
