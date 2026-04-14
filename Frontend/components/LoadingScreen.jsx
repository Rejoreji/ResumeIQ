import React from 'react'

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">

      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

      {/* Text */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-700">Analyzing your resume...</h2>
        <p className="text-gray-400 text-sm mt-1">This usually takes 5 to 10 seconds</p>
      </div>

    </div>
  )
}

export default LoadingScreen
