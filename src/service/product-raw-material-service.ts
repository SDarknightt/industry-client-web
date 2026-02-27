import { api } from "./api";


export async function createProductRawMaterialRelationship(data: { productId: number; materialId: number; materialQuantity: number; }) {
    const response = await api.post("/product/"+data?.productId+"/materials/"+data?.materialId, data);
    return response.data;
}

export async function updateProductRawMaterialRelationship(data: { productId: number; materialId: number; materialQuantity: number; }) {
    const response = await api.put("/product/" + data?.productId + "/materials/" + data?.materialId, data);
    return response.data;
}

export async function deleteProductRawMaterialRelationship(data: { productId: number; materialId: number; }) {
    const response = await api.delete("/product/" + data?.productId +"/materials/" + data?.materialId);
    return response.data;
}

export async function getRawMaterials() {
    const response = await api.get("/raw-materials");
    return response.data;
}