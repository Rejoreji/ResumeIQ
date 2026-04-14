import { useState } from "react"

function UploadPage({ onAnalyze }) {
  const [activeTab, setActiveTab] = useState("paste")  // "paste" or "upload"
  const [resumeText, setResumeText] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [pdfFile, setPdfFile] = useState(null)
  const [error, setError] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  // handle PDF file selection
  const handleFileChange = (file) => {
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
      setError("")
    } else {
      setError("Please upload a PDF file only")
      setPdfFile(null)
    }
  }

  // drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFileChange(file)
  }

  const handleSubmit = async () => {
    setError("")

    // --- PDF upload flow ---
    if (activeTab === "upload") {
      if (!pdfFile) {
        setError("Please upload a PDF file")
        return
      }

      // create form data to send file
      const formData = new FormData()
      formData.append("resume", pdfFile)
      formData.append("jobDescription", jobDescription)

      onAnalyze(null, jobDescription, formData) // pass formData
      return
    }

    // --- Paste text flow ---
    if (!resumeText.trim()) {
      setError("Please paste your resume before analyzing")
      return
    }

    onAnalyze(resumeText, jobDescription, null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10 ">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Check your Resume now</h1>
        <p className="text-gray-500 mt-2">Get instant AI-powered feedback on your resume</p>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-5xl flex flex-col gap-6">

        {/* Tabs */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              activeTab === "paste"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              activeTab === "upload"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Upload PDF
          </button>
        </div>

        {/* Paste Text Tab */}
        {activeTab === "paste" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Resume <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full h-90 border border-gray-300 rounded-xl p-4 text-[13px] text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </div>
        )}

        {/* Upload PDF Tab */}
        {activeTab === "upload" && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : pdfFile
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
            onClick={() => document.getElementById("pdf-input").click()}
          >
            <input
              id="pdf-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />

            {pdfFile ? (
              <>
                <p className="text-green-600 text-2xl mb-2">✅</p>
                <p className="text-green-700 font-semibold">{pdfFile.name}</p>
                <p className="text-gray-400 text-sm mt-1">Click to change file</p>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-4xl mb-3">📄</p>
                <p className="text-gray-600 font-semibold">
                  Drag & drop your PDF here
                </p>
                <p className="text-gray-400 text-sm mt-1">or click to browse</p>
              </>
            )}
          </div>
        )}

        {/* Job Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Description{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            className="w-full h-36 border border-gray-300 rounded-xl p-4 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the job description here for tailored feedback..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200"
        >
          Analyze My Resume
        </button>

      </div>
    </div>
  )
}

export default UploadPage