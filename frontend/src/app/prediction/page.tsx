import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import PredictionForm from "@/components/prediction/PredictionForm";

export default function PredictionPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <main className="p-8">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-green-700">
              Crop Yield Prediction
            </h1>

            <p className="text-gray-600 mt-2">
              Predict crop production using our AI model.
            </p>
          </div>

          <PredictionForm />

        </main>

      </div>

    </div>
  );
}