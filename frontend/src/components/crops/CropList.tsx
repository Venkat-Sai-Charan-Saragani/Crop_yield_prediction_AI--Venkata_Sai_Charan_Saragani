"use client";

import { useEffect, useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Leaf,
  Loader2,
  Sprout,
  Trash2,
  Wheat,
  X,
} from "lucide-react";

import {
  getCrops,
  deleteCrop,
  updateCrop,
} from "@/services/crop";

interface Crop {
  id: string;
  crop_name: string;
  crop_type: string;
  season: string;
  sowing_date: string;
  expected_harvest_date: string;
  status: string;
}

export default function CropList() {

  const [crops, setCrops] =
    useState<Crop[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [editingId, setEditingId] =
    useState("");

  const [editData, setEditData] =
    useState<any>({});

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState("");


  useEffect(() => {

    fetchCrops();

  }, []);


  const fetchCrops = async () => {

    try {

      const data =
        await getCrops();

      setCrops(
        Array.isArray(data?.crops)
          ? data.crops
          : []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };


  const handleDelete =
    async (id: string) => {

      if (!confirm("Delete this crop?"))
        return;

      setDeletingId(id);

      try {

        await deleteCrop(id);

        fetchCrops();

      } catch {

        alert("Delete failed");

      } finally {

        setDeletingId("");

      }

    };


  const startEdit =
    (crop: Crop) => {

      setEditingId(crop.id);

      setEditData({

        crop_name:
          crop.crop_name,

        crop_type:
          crop.crop_type,

        season:
          crop.season,

        sowing_date:
          crop.sowing_date
            ? crop.sowing_date.slice(0, 10)
            : "",

        expected_harvest_date:
          crop.expected_harvest_date
            ? crop.expected_harvest_date.slice(0, 10)
            : "",

        status:
          crop.status,

      });

    };


  const saveEdit =
    async () => {

      if (
        editData.sowing_date &&
        editData.expected_harvest_date &&
        editData.expected_harvest_date <
          editData.sowing_date
      ) {

        alert(
          "Expected harvest date cannot be before the sowing date."
        );

        return;

      }

      setSaving(true);

      try {

        await updateCrop(
          editingId,
          editData
        );

        setEditingId("");

        fetchCrops();

      } catch {

        alert("Update failed");

      } finally {

        setSaving(false);

      }

    };


  const formatDate =
    (date: string) => {

      if (!date) return "-";

      try {

        return new Date(
          date
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

      } catch {

        return "-";

      }

    };


  const getStatusStyle =
    (status: string) => {

      const value =
        status.toLowerCase();

      if (value === "growing") {

        return {
          wrapper:
            "bg-emerald-50 text-emerald-700 border-emerald-100",
          dot:
            "bg-emerald-500",
        };

      }

      if (value === "harvested") {

        return {
          wrapper:
            "bg-amber-50 text-amber-700 border-amber-100",
          dot:
            "bg-amber-500",
        };

      }

      return {
        wrapper:
          "bg-blue-50 text-blue-700 border-blue-100",
        dot:
          "bg-blue-500",
      };

    };


  if (loading) {

    return (

      <section
        className="
          mt-10
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
            min-h-[220px]
            flex-col
            items-center
            justify-center
          "
        >

          <div
            className="
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

            <Loader2
              size={22}
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
            Loading your crops...
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            Retrieving crop records
          </p>

        </div>

      </section>

    );

  }


  return (

    <section className="mt-10">

      {/* =====================================================
          HEADER
      ===================================================== */}

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
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-emerald-50
                text-emerald-600
              "
            >

              <Wheat
                size={21}
              />

            </div>

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <h2
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-slate-950
                  "
                >
                  My Crops
                </h2>

                <span
                  className="
                    rounded-full
                    bg-emerald-50
                    px-2.5
                    py-1
                    text-[10px]
                    font-black
                    text-emerald-700
                  "
                >
                  {crops.length}
                </span>

              </div>

              <p
                className="
                  mt-1
                  text-sm
                  text-slate-500
                "
              >
                Monitor and manage your registered crops.
              </p>

            </div>

          </div>

        </div>

        {crops.length > 0 && (

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-xs
              font-semibold
              text-slate-500
              shadow-sm
            "
          >

            <Sprout
              size={14}
              className="text-emerald-600"
            />

            {crops.length} registered crop
            {crops.length !== 1 ? "s" : ""}

          </div>

        )}

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {crops.length === 0 ? (

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
                text-emerald-500
              "
            >

              <Leaf
                size={29}
              />

            </div>

            <h3
              className="
                mt-5
                text-lg
                font-black
                text-slate-900
              "
            >
              No crops registered yet
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
              Add your first crop above to begin
              managing your agricultural records.
            </p>

          </div>

        </div>

      ) : (

        /* ===================================================
           CROP GRID
        =================================================== */

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {crops.map((crop) => {

            const statusStyle =
              getStatusStyle(
                crop.status
              );

            const isEditing =
              editingId === crop.id;

            return (

              <article
                key={crop.id}
                className="
                  group
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-slate-200/80
                  bg-white
                  shadow-[0_12px_40px_rgba(15,23,42,0.05)]
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_20px_50px_rgba(15,23,42,0.09)]
                "
              >

                {/* CARD TOP */}

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


                {isEditing ? (

                  /* =================================================
                     EDIT MODE
                  ================================================= */

                  <div className="p-6">

                    <div
                      className="
                        mb-6
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div>

                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.14em]
                            text-emerald-600
                          "
                        >
                          Edit Crop
                        </p>

                        <h3
                          className="
                            mt-1
                            text-xl
                            font-black
                            text-slate-950
                          "
                        >
                          Update details
                        </h3>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingId("")
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          bg-slate-100
                          text-slate-500
                          transition
                          hover:bg-slate-200
                          hover:text-slate-800
                        "
                      >

                        <X
                          size={17}
                        />

                      </button>

                    </div>


                    <div className="space-y-4">

                      <div>

                        <label className="mb-1.5 block text-xs font-bold text-slate-600">
                          Crop Name
                        </label>

                        <input
                          className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-3.5
                            py-3
                            text-sm
                            font-medium
                            outline-none
                            transition
                            focus:border-emerald-500
                            focus:bg-white
                            focus:ring-4
                            focus:ring-emerald-500/10
                          "
                          value={
                            editData.crop_name
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              crop_name:
                                e.target.value,
                            })
                          }
                        />

                      </div>


                      <div>

                        <label className="mb-1.5 block text-xs font-bold text-slate-600">
                          Crop Type
                        </label>

                        <input
                          className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-3.5
                            py-3
                            text-sm
                            font-medium
                            outline-none
                            transition
                            focus:border-emerald-500
                            focus:bg-white
                            focus:ring-4
                            focus:ring-emerald-500/10
                          "
                          value={
                            editData.crop_type
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              crop_type:
                                e.target.value,
                            })
                          }
                        />

                      </div>


                      <div>

                        <label className="mb-1.5 block text-xs font-bold text-slate-600">
                          Season
                        </label>

                        <input
                          className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-3.5
                            py-3
                            text-sm
                            font-medium
                            outline-none
                            transition
                            focus:border-emerald-500
                            focus:bg-white
                            focus:ring-4
                            focus:ring-emerald-500/10
                          "
                          value={
                            editData.season
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              season:
                                e.target.value,
                            })
                          }
                        />

                      </div>


                      <div
                        className="
                          grid
                          gap-3
                          sm:grid-cols-2
                        "
                      >

                        <div>

                          <label className="mb-1.5 block text-xs font-bold text-slate-600">
                            Sowing
                          </label>

                          <input
                            type="date"
                            className="
                              w-full
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50
                              px-3
                              py-3
                              text-sm
                              outline-none
                              focus:border-emerald-500
                            "
                            value={
                              editData.sowing_date
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                sowing_date:
                                  e.target.value,
                              })
                            }
                          />

                        </div>


                        <div>

                          <label className="mb-1.5 block text-xs font-bold text-slate-600">
                            Harvest
                          </label>

                          <input
                            type="date"
                            min={
                              editData.sowing_date ||
                              undefined
                            }
                            className="
                              w-full
                              rounded-xl
                              border
                              border-slate-200
                              bg-slate-50
                              px-3
                              py-3
                              text-sm
                              outline-none
                              focus:border-emerald-500
                            "
                            value={
                              editData.expected_harvest_date
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                expected_harvest_date:
                                  e.target.value,
                              })
                            }
                          />

                        </div>

                      </div>


                      <div>

                        <label className="mb-1.5 block text-xs font-bold text-slate-600">
                          Status
                        </label>

                        <select
                          className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-3.5
                            py-3
                            text-sm
                            font-semibold
                            outline-none
                            focus:border-emerald-500
                          "
                          value={
                            editData.status
                          }
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              status:
                                e.target.value,
                            })
                          }
                        >

                          <option>
                            Growing
                          </option>

                          <option>
                            Harvested
                          </option>

                          <option>
                            Completed
                          </option>

                        </select>

                      </div>

                    </div>


                    <div
                      className="
                        mt-6
                        flex
                        gap-2
                      "
                    >

                      <button
                        type="button"
                        onClick={saveEdit}
                        disabled={saving}
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-emerald-600
                          px-4
                          py-3
                          text-sm
                          font-bold
                          text-white
                          transition
                          hover:bg-emerald-700
                          disabled:opacity-50
                        "
                      >

                        {saving && (
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                        )}

                        {saving
                          ? "Saving..."
                          : "Save Changes"}

                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingId("")
                        }
                        className="
                          rounded-xl
                          border
                          border-slate-200
                          bg-white
                          px-4
                          py-3
                          text-sm
                          font-bold
                          text-slate-600
                          transition
                          hover:bg-slate-50
                        "
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                ) : (

                  /* =================================================
                     NORMAL MODE
                  ================================================= */

                  <>

                    <div className="p-6">

                      {/* HEADER */}

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
                              group-hover:bg-emerald-100
                            "
                          >

                            <Leaf
                              size={22}
                            />

                          </div>

                          <div>

                            <h3
                              className="
                                text-lg
                                font-black
                                tracking-tight
                                text-slate-950
                              "
                            >
                              {crop.crop_name}
                            </h3>

                            <p
                              className="
                                mt-0.5
                                text-xs
                                font-medium
                                text-slate-400
                              "
                            >
                              {crop.crop_type}
                            </p>

                          </div>

                        </div>


                        {/* STATUS */}

                        <span
                          className={`
                            inline-flex
                            shrink-0
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-black
                            ${statusStyle.wrapper}
                          `}
                        >

                          <span
                            className={`
                              h-1.5
                              w-1.5
                              rounded-full
                              ${statusStyle.dot}
                            `}
                          />

                          {crop.status}

                        </span>

                      </div>


                      {/* SEASON */}

                      <div
                        className="
                          mt-6
                          rounded-2xl
                          bg-slate-50
                          p-4
                        "
                      >

                        <p
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-slate-400
                          "
                        >
                          Growing Season
                        </p>

                        <p
                          className="
                            mt-1
                            text-sm
                            font-bold
                            text-slate-800
                          "
                        >
                          {crop.season}
                        </p>

                      </div>


                      {/* DETAILS */}

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

                            <CalendarDays
                              size={13}
                              className="text-emerald-600"
                            />

                            <span
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                              "
                            >
                              Sowing
                            </span>

                          </div>

                          <p
                            className="
                              mt-1.5
                              text-xs
                              font-bold
                              text-slate-700
                            "
                          >
                            {formatDate(
                              crop.sowing_date
                            )}
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

                            <Clock3
                              size={13}
                              className="text-emerald-600"
                            />

                            <span
                              className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-wide
                                text-slate-400
                              "
                            >
                              Harvest
                            </span>

                          </div>

                          <p
                            className="
                              mt-1.5
                              text-xs
                              font-bold
                              text-slate-700
                            "
                          >
                            {formatDate(
                              crop.expected_harvest_date
                            )}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        border-t
                        border-slate-100
                        bg-slate-50/70
                        p-4
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          startEdit(crop)
                        }
                        className="
                          flex
                          flex-1
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
                          shadow-sm
                          transition
                          hover:border-emerald-200
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >

                        <Edit3
                          size={14}
                        />

                        Edit

                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(crop.id)
                        }
                        disabled={
                          deletingId === crop.id
                        }
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-red-100
                          bg-white
                          px-4
                          py-2.5
                          text-xs
                          font-bold
                          text-red-600
                          transition
                          hover:bg-red-50
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >

                        {deletingId === crop.id ? (

                          <Loader2
                            size={14}
                            className="animate-spin"
                          />

                        ) : (

                          <Trash2
                            size={14}
                          />

                        )}

                        {deletingId === crop.id
                          ? "Deleting..."
                          : "Delete"}

                      </button>

                    </div>

                  </>

                )}

              </article>

            );

          })}

        </div>

      )}

    </section>

  );

}