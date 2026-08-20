"use client";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  ChevronRight,
  Edit3,
  Leaf,
  Loader2,
  MapPin,
  Mountain,
  Ruler,
  Sprout,
  Trash2,
} from "lucide-react";

import {
  getFarms,
  deleteFarm,
} from "@/services/farm";

import EditFarmModal from "./EditFarmModal";


interface Farm {
  id: string;
  farm_name: string;
  area: number;
  area_unit: string;
  soil_type: string;
  latitude: number;
  longitude: number;
}


export default function FarmList() {

  const [farms, setFarms] =
    useState<Farm[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showEdit, setShowEdit] =
    useState(false);

  const [selectedFarm, setSelectedFarm] =
    useState<Farm | null>(null);


  useEffect(() => {
    fetchFarms();
  }, []);


  const fetchFarms = async () => {

    try {

      const data =
        await getFarms();

      setFarms(
        data.farms
      );

    } catch (error) {

      console.log(
        "Fetch Farms Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  const handleDelete =
    async (farmId: string) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this farm?"
        );

      if (!confirmDelete) {
        return;
      }


      try {

        const response =
          await deleteFarm(
            farmId
          );

        alert(
          response.message
        );

        fetchFarms();

      } catch (error: any) {

        console.log(
          error.response?.data
        );

        alert(
          error.response?.data?.message ||
            "Failed to delete farm."
        );

      }

    };


  // ========================================================
  // LOADING
  // ========================================================

  if (loading) {

    return (

      <section
        className="
          overflow-hidden
          rounded-[28px]
          border
          border-slate-200/80
          bg-white
          shadow-[0_16px_50px_rgba(15,23,42,0.06)]
        "
      >

        <div
          className="
            h-1
            w-full
            bg-gradient-to-r
            from-emerald-500
            via-green-500
            to-lime-400
          "
        />

        <div
          className="
            flex
            min-h-[220px]
            flex-col
            items-center
            justify-center
          "
        >

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-emerald-50
              text-emerald-600
            "
          >

            <Loader2
              size={24}
              className="animate-spin"
            />

          </div>

          <p
            className="
              mt-4
              text-sm
              font-bold
              text-slate-700
            "
          >
            Loading your farms...
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            Retrieving your agricultural data
          </p>

        </div>

      </section>

    );

  }


  // ========================================================
  // UI
  // ========================================================

  return (

    <section>

      {/* ====================================================
          SECTION HEADER
      ==================================================== */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >

        <div>

          <div
            className="
              mb-2
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-emerald-50
                text-emerald-600
              "
            >

              <Sprout size={19} />

            </div>

            <span
              className="
                rounded-full
                bg-slate-100
                px-2.5
                py-1
                text-[10px]
                font-bold
                text-slate-500
              "
            >

              {farms.length}{" "}
              {farms.length === 1
                ? "Farm"
                : "Farms"}

            </span>

          </div>


          <h2
            className="
              text-2xl
              font-black
              tracking-tight
              text-slate-950
              sm:text-3xl
            "
          >
            My Farms
          </h2>


          <p
            className="
              mt-1.5
              text-sm
              text-slate-500
            "
          >
            Manage the farms connected to your account.
          </p>

        </div>


        {farms.length > 0 && (

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-emerald-100
              bg-emerald-50
              px-3
              py-2
            "
          >

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-500
              "
            />

            <span
              className="
                text-xs
                font-bold
                text-emerald-700
              "
            >
              Farm data available
            </span>

          </div>

        )}

      </div>


      {/* ====================================================
          EMPTY
      ==================================================== */}

      {farms.length === 0 ? (

        <div
          className="
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200
            bg-white
            shadow-[0_16px_50px_rgba(15,23,42,0.05)]
          "
        >

          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              px-6
              py-16
              text-center
            "
          >

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-emerald-50
                text-emerald-600
              "
            >

              <Leaf size={28} />

            </div>


            <h3
              className="
                mt-5
                text-lg
                font-black
                text-slate-900
              "
            >
              No farms yet
            </h3>


            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-slate-500
              "
            >
              Create your first farm above to start
              organizing your land and agricultural
              information.
            </p>

          </div>

        </div>

      ) : (

        /* ==================================================
           FARM GRID
        ================================================== */

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {farms.map(
            (farm) => (

              <article
                key={farm.id}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-slate-200/80
                  bg-white
                  shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-emerald-200
                  hover:shadow-[0_20px_50px_rgba(15,23,42,0.09)]
                "
              >

                {/* Top accent */}

                <div
                  className="
                    h-1
                    w-full
                    bg-gradient-to-r
                    from-emerald-500
                    to-lime-400
                  "
                />


                <div
                  className="
                    p-5
                    sm:p-6
                  "
                >

                  {/* ========================================
                      CARD HEADER
                  ======================================== */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-emerald-50
                          text-emerald-600
                          transition
                          group-hover:bg-emerald-600
                          group-hover:text-white
                        "
                      >

                        <Sprout size={21} />

                      </div>


                      <div className="min-w-0">

                        <h3
                          className="
                            truncate
                            text-lg
                            font-black
                            text-slate-950
                          "
                        >

                          {farm.farm_name}

                        </h3>


                        <div
                          className="
                            mt-1
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            text-slate-400
                          "
                        >

                          <MapPin size={12} />

                          <span>
                            Agricultural Property
                          </span>

                        </div>

                      </div>

                    </div>


                    <span
                      className="
                        shrink-0
                        rounded-full
                        bg-emerald-50
                        px-2.5
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-wider
                        text-emerald-700
                      "
                    >
                      Active
                    </span>

                  </div>


                  {/* ========================================
                      MAIN FARM METRIC
                  ======================================== */}

                  <div
                    className="
                      mt-6
                      rounded-2xl
                      border
                      border-slate-100
                      bg-slate-50/80
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div>

                        <p
                          className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.12em]
                            text-slate-400
                          "
                        >
                          Farm Area
                        </p>


                        <p
                          className="
                            mt-1
                            text-2xl
                            font-black
                            tracking-tight
                            text-slate-950
                          "
                        >

                          {farm.area}

                          <span
                            className="
                              ml-1
                              text-xs
                              font-bold
                              text-slate-400
                            "
                          >
                            {farm.area_unit}
                          </span>

                        </p>

                      </div>


                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-white
                          text-emerald-600
                          shadow-sm
                        "
                      >

                        <Ruler size={18} />

                      </div>

                    </div>

                  </div>


                  {/* ========================================
                      DETAILS
                  ======================================== */}

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >

                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-100
                        bg-white
                        p-3
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                        "
                      >

                        <Mountain
                          size={13}
                          className="text-amber-500"
                        />

                        <span
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          Soil
                        </span>

                      </div>


                      <p
                        className="
                          mt-1.5
                          truncate
                          text-sm
                          font-bold
                          text-slate-700
                        "
                        title={farm.soil_type}
                      >

                        {farm.soil_type}

                      </p>

                    </div>


                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-100
                        bg-white
                        p-3
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                        "
                      >

                        <MapPin
                          size={13}
                          className="text-emerald-500"
                        />

                        <span
                          className="
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          Location
                        </span>

                      </div>


                      <p
                        className="
                          mt-1.5
                          truncate
                          text-sm
                          font-bold
                          text-slate-700
                        "
                      >

                        {Number(
                          farm.latitude
                        ).toFixed(4)}

                        {" , "}

                        {Number(
                          farm.longitude
                        ).toFixed(4)}

                      </p>

                    </div>

                  </div>


                  {/* ========================================
                      COORDINATES
                  ======================================== */}

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                      border-t
                      border-slate-100
                      pt-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-[11px]
                        text-slate-400
                      "
                    >

                      <CalendarDays size={13} />

                      <span>
                        GPS coordinates saved
                      </span>

                    </div>


                    <ChevronRight
                      size={15}
                      className="
                        text-slate-300
                        transition
                        group-hover:translate-x-1
                        group-hover:text-emerald-500
                      "
                    />

                  </div>


                  {/* ========================================
                      ACTIONS
                  ======================================== */}

                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFarm(farm);
                        setShowEdit(true);
                      }}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-2.5
                        text-xs
                        font-bold
                        text-slate-700
                        transition
                        hover:border-emerald-200
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      "
                    >

                      <Edit3 size={14} />

                      Edit Farm

                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          farm.id
                        )
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-100
                        bg-red-50
                        px-4
                        py-2.5
                        text-xs
                        font-bold
                        text-red-600
                        transition
                        hover:border-red-200
                        hover:bg-red-100
                      "
                    >

                      <Trash2 size={14} />

                      Delete

                    </button>

                  </div>

                </div>

              </article>

            )
          )}

        </div>

      )}


      {/* ====================================================
          EDIT MODAL
      ==================================================== */}

      {showEdit &&
        selectedFarm && (

          <EditFarmModal
            farm={selectedFarm}
            onClose={() =>
              setShowEdit(false)
            }
            onUpdated={fetchFarms}
          />

        )}

    </section>

  );
}