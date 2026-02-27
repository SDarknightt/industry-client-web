import type { RawMaterialQuantityDetailsType } from "./RawMaterialTypes";

export type ProductCreateType = {
    name: string;
    price: string;
    rawMaterials?: RawMaterialQuantity[];
};

export type RawMaterialQuantity = {
    id: number;
    name?: string;
    quantity: number;
};

export type ProductUpdateType = {
    id: number;
    name: string;
    price: string;
};

export type RawMaterialForProductUpdate = {
    id: number;
    quantity: number;
    name: string;
    stockQuantity: number;
};


export type ProductDetailsType = {
    id: number;
    name: string;
    price: number;
    rawMaterials: RawMaterialQuantityDetailsType[];
};

export type ProductListType = {
    id: number;
    name: string;
    price: number;
};

export type ProductProductionType = {
    id: number;
    name: string;
    price: number;
    totalPrice: number;
    maxProductionQuantity: number;
    materials: RawMaterialQuantityDetailsType[];
};