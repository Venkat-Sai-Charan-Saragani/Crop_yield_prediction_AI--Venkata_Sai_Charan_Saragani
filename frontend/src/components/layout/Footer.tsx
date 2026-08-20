export default function Footer(){
    return (
        <footer className="bg-green-700 text-white py-8">
        <div className="text-center">
        <h2 className="text-2xl font-bold">
        Crop_Yield_prediction-AI 🌱
        </h2>

        <p className="mt-3">
        AI-powered crop yield prediction and smart farming solutions.
        </p>

        <div className="mt-5 text-sm">
        @ {new Date().getFullYear()} Crop_Yeild_prediction-AI. All rights reserved.
        </div>

        </div>
        </footer>
    )
}