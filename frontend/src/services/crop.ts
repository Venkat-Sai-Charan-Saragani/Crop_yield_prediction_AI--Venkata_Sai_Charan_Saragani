import api from "./api";

export const createCrop = async (data: any) => {
  const response = await api.post("/crops", data);
  return response.data;
};

export const getCrops = async () => {
  const response = await api.get("/crops");
  return response.data;
};

export const updateCrop = async (
  cropId: string,
  data: any
) => {
  const response = await api.put(
    `/crops/${cropId}`,
    data
  );

  return response.data;
};

export const deleteCrop = async (
  cropId: string
) => {
  const response = await api.delete(
    `/crops/${cropId}`
  );

  return response.data;
};