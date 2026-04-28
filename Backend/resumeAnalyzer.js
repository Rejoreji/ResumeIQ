const { GoogleGenerativeAI } = require("@google/generative-ai")
//console.log("API KEY:", process.env.GEMINI_API_KEY) 

// initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const analyzeResume = async (resumeText, jobDescription) => {

  // pick the model

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  // the prompt we send to Gemini
const prompt = `You are an expert resume reviewer and career coach with years of 
experience in HR and recruitment. Use this as reference for evaluating dates on the resume. 
Your job is to analyze resumes and provide 
detailed, actionable feedback.

You must ALWAYS respond with a valid JSON object only.
No extra text, no markdown, no explanation outside the JSON.

The JSON must follow this exact structure:
{
  "score": <number between 0 and 100>,
  "strengths": [<list of strength strings>],
  "weaknesses": [<list of weakness strings>],
  "suggestions": [<list of actionable suggestion strings>],
  "keywords": [<list of missing keywords if job description was provided, otherwise empty array>]
}

${jobDescription
  ? `Please analyze this resume against the job description provided.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`
  : `Please analyze this resume.

RESUME:
${resumeText}`
}` 

  // send the request to Gemini
  const result = await model.generateContent(prompt)
  const response = await result.response
  let rawText = response.text()

  // Gemini sometimes wraps response in ```json ... ``` so we clean it
  rawText = rawText.replace(/```json|```/g, "").trim()

  // convert JSON string into JavaScript object
  const parsed = JSON.parse(rawText)

  return parsed
}

module.exports = { analyzeResume }