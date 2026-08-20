"use client";

import { useState } from "react";
import { updateFarm } from "@/services/farm";

interface Farm {
  id: string;
  farm_name: string;
  area: number;
  area_unit: string;
  soil_type: string;
  latitude: number;
  longitude: number;
}

interface Props {
  farm: Farm;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditFarmModal({
  farm,
  onClose,
  onUpdated,
}: Props) {

  const [farmName, setFarmName] = useState(farm.farm_name);
  const [area, setArea] = useState(farm.area);
  const [areaUnit, setAreaUnit] = useState(farm.area_unit);
  const [soilType, setSoilType] = useState(farm.soil_type);
  const [latitude, setLatitude] = useState(farm.latitude);
  const [longitude, setLongitude] = useState(farm.longitude);

  const [loading, setLoading] = useState(false);

  const handleUpdate = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setLoading(true);

    try {

      await updateFarm(farm.id, {

        farm_name: farmName,
        area: Number(area),
        area_unit: areaUnit,
        soil_type: soilType,
        latitude: Number(latitude),
        longitude: Number(longitude),

      });

      alert("Farm updated successfully");

      onUpdated();

      onClose();

    } catch (error) {

      console.log(error);

      alert("Failed to update farm");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl p-8 w-full max-w-xl">

        <h2 className="text-3xl font-bold text-green-700 mb-6">
          ✏ Edit Farm
        </h2>

        <form
          onSubmit={handleUpdate}
          className="space-y-4"
        >

          <input
            className="border p-3 rounded-lg w-full"
            value={farmName}
            onChange={(e)=>setFarmName(e.target.value)}
            placeholder="Farm Name"
          />

          <input
            type="number"
            className="border p-3 rounded-lg w-full"
            value={area}
            onChange={(e)=>setArea(Number(e.target.value))}
            placeholder="Area"
          />

          <select
            className="border p-3 rounded-lg w-full"
            value={areaUnit}
            onChange={(e)=>setAreaUnit(e.target.value)}
          >
            <option>acres</option>
            <option>hectares</option>
          </select>

          <input
            className="border p-3 rounded-lg w-full"
            value={soilType}
            onChange={(e)=>setSoilType(e.target.value)}
            placeholder="Soil Type"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              type="number"
              step="any"
              className="border p-3 rounded-lg"
              value={latitude}
              onChange={(e)=>setLatitude(Number(e.target.value))}
              placeholder="Latitude"
            />

            <input
              type="number"
              step="any"
              className="border p-3 rounded-lg"
              value={longitude}
              onChange={(e)=>setLongitude(Number(e.target.value))}
              placeholder="Longitude"
            />

          </div>

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-green-700 text-white"
            >
              {
                loading
                ? "Updating..."
                : "Update Farm"
              }
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}