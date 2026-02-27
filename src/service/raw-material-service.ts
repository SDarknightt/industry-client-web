import { api } from "./api";

export async function createRawMaterial(data: any) {
    const response = await api.post("/raw-materials", data);
    return response.data;
}

export async function updateRawMaterial(data: any) {
    const response = await api.put("/raw-materials", data);
    return response.data;
}

export async function deleteRawMaterial(id: any) {
    const response = await api.delete("/raw-materials/"+id);
    return response.data;
}

export async function getRawMaterials() {
    const response = await api.get("/raw-materials");
    return response.data;
}