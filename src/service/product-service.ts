import { api } from "./api";

export async function createProduct(data: any) {
    const response = await api.post("/products", data);
    return response.data;
}

export async function updateProduct(data: any) {
    const response = await api.put("/products/"+data.id, data);
    return response.data;
}

export async function deleteProduct(id: number) {
    const response = await api.delete("/products/"+id);
    return response.data;
}

export async function getProducts() {
    const response = await api.get("/products");
    return response.data;
}

export async function getProductById(id: number) {
    const response = await api.get("/products/"+id);
    return response.data;
}