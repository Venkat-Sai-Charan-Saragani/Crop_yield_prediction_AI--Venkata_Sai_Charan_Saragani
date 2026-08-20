"use client";

import CropForm from "@/components/crops/CropForm";
import CropList from "@/components/crops/CropList";

export default function CropsPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          PAGE BACKGROUND
      ===================================================== */}

      <div className="relative overflow-hidden">

        {/* Decorative background */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-green-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-8">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 shadow-sm">

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm">
                    🌱
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Crop Management
                  </span>

                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Manage Your Crops
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Add, monitor, update and manage the crops connected to
                  your agricultural farms from one place.
                </p>

              </div>

              <div className="hidden rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm sm:block">

                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Smart Agriculture
                </p>

                <p className="mt-1 text-sm font-bold text-emerald-700">
                  Crop Intelligence
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              CREATE CROP
          ================================================= */}

          <CropForm />


          {/* =================================================
              CROP LIST
          ================================================= */}

          <CropList />

        </div>

      </div>

    </div>
  );
}