import React from 'react'

const ResultPage = ({ results, onReset }) => {

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600"
        if (score >= 50) return "text-yellow-500"
        return "text-red-500"
  }

    const getScoreBg = (score) => {
        if (score >= 80) return "bg-green-100"
        if (score >= 50) return "bg-yellow-100"
        return "bg-red-100"
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Your Results</h1>
        <p className="text-gray-500 mt-2">Here's what our AI found about your resume</p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-6">

        {/* Score Card */}
        <div className={`rounded-2xl p-6 text-center shadow-md ${getScoreBg(results?.score)}`}>
          <p className="text-gray-600 font-medium mb-1">Overall Score</p>
          <p className={`text-7xl font-bold ${getScoreColor(results?.score)}`}>
            {results?.score ?? "—"}
          </p>
          <p className="text-gray-500 text-sm mt-1">out of 100</p>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-green-600 mb-3">✅ Strengths</h2>
          <ul className="flex flex-col gap-2">
            {results?.strengths?.map((item, index) => (
              <li key={index} className="text-sm text-gray-700 bg-green-50 rounded-lg px-4 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-red-500 mb-3">❌ Weaknesses</h2>
          <ul className="flex flex-col gap-2">
            {results?.weaknesses?.map((item, index) => (
              <li key={index} className="text-sm text-gray-700 bg-red-50 rounded-lg px-4 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">💡 Suggestions</h2>
          <ul className="flex flex-col gap-2">
            {results?.suggestions?.map((item, index) => (
              <li key={index} className="text-sm text-gray-700 bg-blue-50 rounded-lg px-4 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Keywords (if job description was given) */}
        {results?.keywords && results.keywords.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-purple-600 mb-3">🔑 Missing Keywords</h2>
            <div className="flex flex-wrap gap-2">
              {results.keywords.map((word, index) => (
                <span key={index} className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Check Another Resume Button */}
        <button
          onClick={onReset}
          className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold py-3 rounded-xl transition duration-200"
        >
          Check Another Resume
        </button>

      </div>
    </div>

  )
}

export default ResultPage
