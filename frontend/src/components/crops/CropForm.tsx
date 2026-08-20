"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Leaf,
  Loader2,
  MapPinned,
  Sprout,
  Wheat,
} from "lucide-react";

import api from "@/services/api";
import { createCrop } from "@/services/crop";

interface Farm {
  id: string;
  farm_name: string;
}

export default function CropForm() {

  const router = useRouter();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [farmId, setFarmId] = useState("");
  const [cropName, setCropName] = useState("");
  const [cropType, setCropType] = useState("");
  const [season, setSeason] = useState("");
  const [sowingDate, setSowingDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [status, setStatus] = useState("Growing");

  const [loading, setLoading] = useState(false);
  const [farmsLoading, setFarmsLoading] = useState(true);

  useEffect(() => {

    (async () => {

      try {

        const res = await api.get("/farms");

        const farmData =
          Array.isArray(res.data?.farms)
            ? res.data.farms
            : [];

        setFarms(farmData);

        if (farmData.length) {
          setFarmId(farmData[0].id);
        }

      } catch (e) {

        console.error(e);

      } finally {

        setFarmsLoading(false);

      }

    })();

  }, []);


  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!farmId) {
      alert("Please create or select a farm first.");
      return;
    }

    if (!cropName.trim()) {
      alert("Please enter a crop name.");
      return;
    }

    if (!cropType.trim()) {
      alert("Please enter the crop type.");
      return;
    }

    if (!season.trim()) {
      alert("Please enter the growing season.");
      return;
    }

    if (
      sowingDate &&
      harvestDate &&
      harvestDate < sowingDate
    ) {
      alert(
        "Expected harvest date cannot be before the sowing date."
      );
      return;
    }

    setLoading(true);

    try {

      await createCrop({

        farm_id: farmId,

        crop_name:
          cropName.trim(),

        crop_type:
          cropType.trim(),

        season:
          season.trim(),

        sowing_date:
          sowingDate,

        expected_harvest_date:
          harvestDate,

        status,

      });

      alert("Crop created successfully");

      setCropName("");
      setCropType("");
      setSeason("");
      setSowingDate("");
      setHarvestDate("");
      setStatus("Growing");

      router.refresh();

    } catch (err: any) {

      console.error(
        "Create Crop Error:",
        err?.response?.data || err
      );

      alert(
        err?.response?.data?.message ??
        "Failed to create crop"
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <section
      className="
        overflow-hidden
        rounded-[30px]
        border
        border-slate-200/80
        bg-white
        shadow-[0_20px_60px_rgba(15,23,42,0.07)]
      "
    >

      {/* =====================================================
          TOP ACCENT
      ===================================================== */}

      <div
        className="
          h-1.5
          w-full
          bg-gradient-to-r
          from-emerald-500
          via-green-500
          to-lime-400
        "
      />


      <div
        className="
          grid
          lg:grid-cols-[0.9fr_1.1fr]
        "
      >

        {/* =================================================
            LEFT VISUAL
        ================================================= */}

        <div
          className="
            relative
            hidden
            min-h-[700px]
            overflow-hidden
            lg:block
          "
        >

          <Image
            src="/images/crop.jpg"
            alt="Crop field"
            fill
            className="object-cover"
            priority
          />

          {/* Image overlay */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-slate-950/85
              via-slate-950/20
              to-transparent
            "
          />

          {/* Visual content */}

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              p-9
              text-white
            "
          >

            <div
              className="
                mb-5
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-white/15
                backdrop-blur-md
              "
            >

              <Sprout
                size={25}
              />

            </div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-emerald-200
              "
            >
              Smart Agriculture
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-black
                tracking-tight
              "
            >
              Build your crop
              <br />
              intelligence.
            </h2>

            <p
              className="
                mt-4
                max-w-md
                text-sm
                leading-6
                text-white/70
              "
            >
              Organize your crops with accurate seasons,
              sowing schedules and expected harvest dates.
            </p>

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-2
              "
            >

              <span
                className="
                  rounded-full
                  border
                  border-white/10
                  bg-white/10
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  backdrop-blur-sm
                "
              >
                🌱 Crop Tracking
              </span>

              <span
                className="
                  rounded-full
                  border
                  border-white/10
                  bg-white/10
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  backdrop-blur-sm
                "
              >
                📅 Season Planning
              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT FORM
        ================================================= */}

        <div
          className="
            p-5
            sm:p-8
            lg:p-10
            xl:p-12
          "
        >

          {/* HEADER */}

          <div className="mb-8">

            <div
              className="
                mb-4
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-emerald-50
                text-emerald-600
              "
            >

              <Wheat
                size={23}
              />

            </div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.15em]
                text-emerald-600
              "
            >
              Crop Registration
            </p>

            <h2
              className="
                mt-1
                text-3xl
                font-black
                tracking-tight
                text-slate-950
              "
            >
              Create a Crop
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-slate-500
              "
            >
              Add crop information to keep your farm
              records organized and ready for prediction.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* =================================================
                FARM
            ================================================= */}

            <div>

              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-600
                "
              >

                <MapPinned
                  size={14}
                  className="text-emerald-600"
                />

                Select Farm

              </label>

              <div className="relative">

                <select
                  value={farmId}
                  onChange={(e) =>
                    setFarmId(e.target.value)
                  }
                  disabled={
                    farmsLoading ||
                    farms.length === 0
                  }
                  className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3.5
                    pr-10
                    text-sm
                    font-semibold
                    text-slate-800
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >

                  {farms.length === 0 ? (

                    <option value="">
                      No farms available
                    </option>

                  ) : (

                    farms.map((f) => (

                      <option
                        key={f.id}
                        value={f.id}
                      >
                        {f.farm_name}
                      </option>

                    ))

                  )}

                </select>

                <ChevronDown
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

              </div>

              {farms.length === 0 &&
                !farmsLoading && (

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-amber-50
                      px-3
                      py-2.5
                      text-xs
                      font-medium
                      text-amber-700
                    "
                  >

                    <CircleAlert
                      size={14}
                    />

                    Create a farm before adding a crop.

                  </div>

                )}

            </div>


            {/* =================================================
                CROP DETAILS
            ================================================= */}

            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
              "
            >

              {/* Crop Name */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-600
                  "
                >
                  Crop Name
                </label>

                <div className="relative">

                  <Leaf
                    size={17}
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    type="text"
                    placeholder="e.g. Rice"
                    value={cropName}
                    onChange={(e) =>
                      setCropName(e.target.value)
                    }
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-slate-50
                      py-3.5
                      pl-11
                      pr-4
                      text-sm
                      font-medium
                      text-slate-800
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-emerald-500
                      focus:bg-white
                      focus:ring-4
                      focus:ring-emerald-500/10
                    "
                    required
                  />

                </div>

              </div>


              {/* Crop Type */}

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-600
                  "
                >
                  Crop Type
                </label>

                <input
                  type="text"
                  placeholder="e.g. Cereal"
                  value={cropType}
                  onChange={(e) =>
                    setCropType(e.target.value)
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3.5
                    text-sm
                    font-medium
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10
                  "
                  required
                />

              </div>

            </div>


            {/* =================================================
                SEASON
            ================================================= */}

            <div>

              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-600
                "
              >
                Growing Season
              </label>

              <input
                type="text"
                placeholder="e.g. Kharif, Rabi, Summer"
                value={season}
                onChange={(e) =>
                  setSeason(e.target.value)
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  px-4
                  py-3.5
                  text-sm
                  font-medium
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-emerald-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-emerald-500/10
                "
                required
              />

            </div>


            {/* =================================================
                DATES
            ================================================= */}

            <div
              className="
                grid
                gap-5
                sm:grid-cols-2
              "
            >

              <div>

                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-600
                  "
                >

                  <CalendarDays
                    size={14}
                    className="text-emerald-600"
                  />

                  Sowing Date

                </label>

                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) =>
                    setSowingDate(e.target.value)
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3.5
                    text-sm
                    font-medium
                    text-slate-700
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10
                  "
                  required
                />

              </div>


              <div>

                <label
                  className="
                    mb-2
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    text-slate-600
                  "
                >

                  <CalendarDays
                    size={14}
                    className="text-emerald-600"
                  />

                  Expected Harvest

                </label>

                <input
                  type="date"
                  value={harvestDate}
                  min={sowingDate || undefined}
                  onChange={(e) =>
                    setHarvestDate(e.target.value)
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3.5
                    text-sm
                    font-medium
                    text-slate-700
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:bg-white
                    focus:ring-4
                    focus:ring-emerald-500/10
                  "
                  required
                />

              </div>

            </div>


            {/* =================================================
                STATUS
            ================================================= */}

            <div>

              <label
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-slate-600
                "
              >

                <CheckCircle2
                  size={14}
                  className="text-emerald-600"
                />

                Crop Status

              </label>

              <div
                className="
                  grid
                  grid-cols-3
                  gap-2
                "
              >

                {[
                  "Growing",
                  "Harvested",
                  "Completed",
                ].map((item) => (

                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setStatus(item)
                    }
                    className={`
                      rounded-xl
                      border
                      px-2
                      py-3
                      text-xs
                      font-bold
                      transition
                      ${
                        status === item
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/50"
                      }
                    `}
                  >

                    {item}

                  </button>

                ))}

              </div>

            </div>


            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={
                loading ||
                farms.length === 0
              }
              className="
                group
                flex
                w-full
                items-center
                justify-center
                gap-2.5
                rounded-xl
                bg-slate-950
                px-5
                py-4
                text-sm
                font-bold
                text-white
                shadow-lg
                shadow-slate-950/10
                transition
                hover:bg-emerald-700
                hover:shadow-emerald-700/20
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {loading ? (

                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Creating crop...

                </>

              ) : (

                <>
                  <Sprout
                    size={18}
                    className="transition-transform group-hover:-translate-y-0.5"
                  />

                  Create Crop

                </>

              )}

            </button>


            <p
              className="
                text-center
                text-[11px]
                leading-5
                text-slate-400
              "
            >
              Your crop information will be used across
              your farm management and AI prediction features.
            </p>

          </form>

        </div>

      </div>

    </section>

  );
}