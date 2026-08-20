"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardPenLine,
  Compass,
  Droplets,
  MapPin,
  Mountain,
  Ruler,
  Sprout,
  Waves,
} from "lucide-react";

import api from "@/services/api";

export default function FarmForm() {
  const router = useRouter();

  const [farmName, setFarmName] = useState("");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("acres");
  const [soilType, setSoilType] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("/farms", {
        farm_name: farmName,
        area: Number(area),
        area_unit: areaUnit,
        soil_type: soilType,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

      alert("Farm created successfully");

      router.push("/dashboard");
    } catch (error: any) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
          "Farm creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.07)]">

      {/* =====================================================
          TOP ACCENT
      ===================================================== */}

      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-400" />


      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

        {/* ===================================================
            LEFT VISUAL
        =================================================== */}

        <div className="relative min-h-[520px] overflow-hidden bg-slate-950 lg:min-h-[700px]">

          <Image
            src="/images/farm.jpg"
            alt="Agricultural farm"
            fill
            priority
            className="object-cover"
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">

            {/* Badge */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">

              <Sprout
                size={14}
                className="text-emerald-300"
              />

              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                Smart Farm Management
              </span>

            </div>


            <h2 className="max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
              Build your farm profile for smarter predictions.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-200">
              Add accurate farm information so Crop Yield Prediction AI
              can organize your agricultural data and support better
              decision-making.
            </p>


            {/* Benefits */}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Mountain size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    Land Details
                  </p>

                  <p className="text-[10px] text-slate-300">
                    Area & soil information
                  </p>
                </div>

              </div>


              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Compass size={17} />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    Location
                  </p>

                  <p className="text-[10px] text-slate-300">
                    Precise farm coordinates
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            RIGHT FORM
        =================================================== */}

        <div className="p-6 sm:p-8 lg:p-10 xl:p-12">

          {/* Form heading */}

          <div className="mb-8">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ClipboardPenLine size={23} />
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Create a New Farm
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter your farm information below to add it to your
              agricultural workspace.
            </p>

          </div>


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* FARM NAME */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Sprout size={13} />
                Farm Name
              </label>

              <input
                type="text"
                placeholder="e.g. Sai Green Farms"
                value={farmName}
                onChange={(e) =>
                  setFarmName(e.target.value)
                }
                className="
                  w-full rounded-2xl border border-slate-200
                  bg-slate-50 px-4 py-3.5 text-sm
                  font-medium text-slate-900 outline-none
                  transition
                  placeholder:text-slate-400
                  hover:border-slate-300
                  focus:border-emerald-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-emerald-500/10
                "
                required
              />
            </div>


            {/* AREA */}

            <div>

              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Ruler size={13} />
                Farm Area
              </label>

              <div className="grid grid-cols-[1fr_auto] gap-3">

                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Enter area"
                  value={area}
                  onChange={(e) =>
                    setArea(e.target.value)
                  }
                  className="
                    w-full rounded-2xl border border-slate-200
                    bg-slate-50 px-4 py-3.5 text-sm
                    font-medium text-slate-900 outline-none
                    transition
                    placeholder:text-slate-400
                    hover:border-slate-300
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10
                  "
                  required
                />

                <select
                  value={areaUnit}
                  onChange={(e) =>
                    setAreaUnit(e.target.value)
                  }
                  className="
                    rounded-2xl border border-slate-200
                    bg-slate-50 px-4 py-3.5 text-sm
                    font-bold text-slate-700 outline-none
                    transition
                    hover:border-slate-300
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10
                  "
                >
                  <option value="acres">
                    Acres
                  </option>

                  <option value="hectares">
                    Hectares
                  </option>
                </select>

              </div>

            </div>


            {/* SOIL TYPE */}

            <div>

              <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Droplets size={13} />
                Soil Type
              </label>

              <input
                type="text"
                placeholder="e.g. Black soil"
                value={soilType}
                onChange={(e) =>
                  setSoilType(e.target.value)
                }
                className="
                  w-full rounded-2xl border border-slate-200
                  bg-slate-50 px-4 py-3.5 text-sm
                  font-medium text-slate-900 outline-none
                  transition
                  placeholder:text-slate-400
                  hover:border-slate-300
                  focus:border-emerald-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-emerald-500/10
                "
                required
              />

            </div>


            {/* LOCATION */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <MapPin size={13} />
                  Farm Location
                </label>

                <span className="text-[10px] font-semibold text-slate-400">
                  GPS coordinates
                </span>

              </div>


              <div className="grid gap-3 sm:grid-cols-2">

                <div className="relative">

                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) =>
                      setLatitude(e.target.value)
                    }
                    className="
                      w-full rounded-2xl border border-slate-200
                      bg-slate-50 px-4 py-3.5 text-sm
                      font-medium text-slate-900 outline-none
                      transition
                      placeholder:text-slate-400
                      hover:border-slate-300
                      focus:border-emerald-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-emerald-500/10
                    "
                    required
                  />

                </div>


                <div className="relative">

                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) =>
                      setLongitude(e.target.value)
                    }
                    className="
                      w-full rounded-2xl border border-slate-200
                      bg-slate-50 px-4 py-3.5 text-sm
                      font-medium text-slate-900 outline-none
                      transition
                      placeholder:text-slate-400
                      hover:border-slate-300
                      focus:border-emerald-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-emerald-500/10
                    "
                    required
                  />

                </div>

              </div>

            </div>


            {/* INFO */}

            <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">

              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <div>

                <p className="text-xs font-bold text-emerald-800">
                  Why accurate information matters
                </p>

                <p className="mt-1 text-[11px] leading-5 text-emerald-700/80">
                  Accurate farm area, soil, and location information
                  helps keep your agricultural data organized.
                </p>

              </div>

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-slate-950
                px-5
                py-4
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-slate-950/10
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-emerald-700
                hover:shadow-emerald-700/20
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Farm...
                </>
              ) : (
                <>
                  Create Farm

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}

            </button>

          </form>


          {/* Footer */}

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-medium text-slate-400">
            <Waves size={12} />
            Your farm data is managed through Crop Yield Prediction AI
          </div>

        </div>

      </div>

    </section>
  );
}