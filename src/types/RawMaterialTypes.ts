export type RawMaterialCreateType = {
    name: string;
    stockQuantity: string;
};

export type RawMaterialDetailsType = {
    id: number;
    name: string;
    stockQuantity: string;
};

export type RawMaterialUpdateType = {
    id: number;
    name: string;
    stockQuantity: string;
};

export type RawMaterialQuantityDetailsType = {
    id: number;   
    name: string;
    stockQuantity: number;
    materialQuantity: number;
}