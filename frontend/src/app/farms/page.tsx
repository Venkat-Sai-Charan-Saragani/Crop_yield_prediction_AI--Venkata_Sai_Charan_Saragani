"use client";

import FarmForm from "@/components/farms/FarmForm";
import FarmList from "@/components/farms/FarmList";

export default function FarmsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          PAGE BACKGROUND
      ===================================================== */}

      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-lime-100/40 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                  Farm Management
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Manage Your Farms
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Add, monitor, and manage your agricultural land from one
                intelligent workspace.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                <span className="text-lg">🌱</span>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Smart Agriculture
                </p>

                <p className="text-sm font-bold text-slate-800">
                  Farm Intelligence
                </p>
              </div>
            </div>

          </div>


          {/* =================================================
              CREATE FARM
          ================================================= */}

          <FarmForm />


          {/* =================================================
              FARM LIST
          ================================================= */}

          <div className="mt-10">
            <FarmList />
          </div>

        </div>
      </div>
    </main>
  );
}