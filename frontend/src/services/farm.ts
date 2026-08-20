import api from "./api";

export const getFarms = async () => {
  const response = await api.get("/farms");
  return response.data;
};

export const deleteFarm = async (farmId: string) => {
  const response = await api.delete(`/farms/${farmId}`);
  return response.data;
};

export const updateFarm = async (
  farmId: string,
  data: any
) => {
  const response = await api.put(
    `/farms/${farmId}`,
    data
  );

  return response.data;
};