import type { ProductCreateType, ProductDetailsType, ProductListType, ProductProductionType, ProductUpdateType } from "../types/ProductTypes";
import { api } from "./api";

export async function createProduct(data: ProductCreateType) {
    const response = await api.post("/products", data);
    return response.data;
}

export async function updateProduct(data: ProductUpdateType) {
    const response = await api.put("/products/"+data.id, data);
    return response.data;
}

export async function deleteProduct(id: number) {
    const response = await api.delete("/products/"+id);
    return response.data;
}

export async function getProducts(): Promise<ProductListType[]> {
    const response = await api.get("/products");
    return response.data;
}

export async function getProductById(id: number): Promise<ProductDetailsType> {
    const response = await api.get("/products/"+id);
    return response.data;
}

export async function getProductionRecommendation(): Promise<ProductProductionType[]> {
    const response = await api.get("/products/production");
    return response.data;
}