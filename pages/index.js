import { useState } from "react"
import { motion } from "framer-motion"

export default function Home() {
  const [step, setStep] = useState("home")

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-10 max-w-xl w-full text-center"
      >
        {step === "home" && (
          <>
            <h1 className="text-3xl font-bold mb-4">✨ AstraMate ✨</h1>
            <p className="mb-6 text-gray-600">Aligning the Stars and the Soul</p>
            <button
              onClick={() => setStep("quiz")}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
            >
              Start Compatibility Quiz
            </button>
          </>
        )}

        {step === "quiz" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Personality & Horoscope Quiz</h2>
            <p className="mb-4">Answer a few questions to get your best match</p>
            <button
              onClick={() => setStep("results")}
              className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
            >
              See Results
            </button>
          </>
        )}

        {step === "results" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Your Compatibility Report</h2>
            <p className="mb-4">✨ You are 82% compatible with potential matches ✨</p>
            <button
              onClick={() => setStep("matches")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              View Matches
            </button>
          </>
        )}

        {step === "matches" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Recommended Matches</h2>
            <ul className="text-left mb-6">
              <li>🌸 Priya – 90% match</li>
              <li>🌙 Aarav – 87% match</li>
              <li>🔥 Zoya – 84% match</li>
            </ul>
            <button
              onClick={() => setStep("pricing")}
              className="px-6 py-3 bg-pink-600 text-white rounded-xl shadow hover:bg-pink-700 transition"
            >
              Unlock Premium
            </button>
          </>
        )}

        {step === "pricing" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Upgrade to Premium</h2>
            <p className="mb-6">Full compatibility reports + expert consultations</p>
            <button
              onClick={() => setStep("about")}
              className="px-6 py-3 bg-yellow-600 text-white rounded-xl shadow hover:bg-yellow-700 transition"
            >
              Learn About Us
            </button>
          </>
        )}

        {step === "about" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">About AstraMate</h2>
            <p className="mb-6 text-gray-600">
              We blend Vedic Astrology and modern psychology to help you find
              meaningful connections.
            </p>
            <button
              onClick={() => setStep("home")}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
            >
              Back to Home
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}
