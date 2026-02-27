import type { RawMaterialCreateType, RawMaterialDetailsType, RawMaterialUpdateType } from "../types/RawMaterialTypes";
import { api } from "./api";

export async function createRawMaterial(data: RawMaterialCreateType) {
    const response = await api.post("/raw-materials", data);
    return response.data;
}

export async function updateRawMaterial(data: RawMaterialUpdateType) {
    const response = await api.put("/raw-materials/"+data?.id, data);
    return response.data;
}

export async function deleteRawMaterial(id: number) {
    const response = await api.delete("/raw-materials/"+id);
    return response.data;
}

export async function getRawMaterials(): Promise<RawMaterialDetailsType[]> {
    const response = await api.get("/raw-materials");
    return response.data;
}

export async function getRawMaterialById(id: number): Promise<RawMaterialDetailsType> {
    const response = await api.get("/raw-materials/" + id);
    return response.data;
}