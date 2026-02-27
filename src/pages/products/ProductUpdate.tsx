import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getProductById, updateProduct } from "../../service/product-service";
import { Fieldset, Field, Label, Input, Button } from "@headlessui/react";
import { getRawMaterials } from "../../service/raw-material-service";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createProductRawMaterialRelationship, deleteProductRawMaterialRelationship, updateProductRawMaterialRelationship } from "../../service/product-raw-material-service";
import BackButton from "../../components/button/BackButtonComponent";
import type { ProductUpdateType } from "../../types/ProductTypes";

export default function ProductUpdate() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingQuantity, setEditingQuantity] = useState<{ materialId: number; quantity: number } | null>(null);

    const { id } = useParams();

    const {
        reset,
        handleSubmit,
        register,
        formState: {
            errors
        }
    } = useForm<ProductUpdateType>({
        defaultValues: {
            name: "",
            price: ""
        }
    });

    const { data: rawMaterials } = useQuery({
        queryKey: ['getRawMaterials'],
        queryFn: () => getRawMaterials(),
    });

    const { data: product, refetch: refetchProduct } = useQuery({
        queryKey: ['getProductById', id],
        queryFn: () => getProductById(Number(id)),
        enabled: !!Number(id),
    });

    const { mutate: update } = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            // Invalidate cache to fetch again
            queryClient.invalidateQueries({ queryKey: ["getProducts"] });
            navigate("/produtos");
            alert("Produto editado com sucesso!");
        }
    });

    const { mutate: createRelationship } = useMutation({
        mutationFn: createProductRawMaterialRelationship,
        onSuccess: () => {
            // Invalidate cache to fetch again
            queryClient.invalidateQueries({ queryKey: ["getRawMaterials"] });
            refetchProduct();
            alert("Matéria-prima adicionada com sucesso!");
        }
    });

    const { mutate: removeRelationship } = useMutation({
            mutationFn: deleteProductRawMaterialRelationship,
            onSuccess: () => {
                refetchProduct();
                alert("Matéria prima removida com sucesso!");
            }
        });

    const { mutate: updateRelationship } = useMutation({
        mutationFn: updateProductRawMaterialRelationship,
        onSuccess: () => {
            refetchProduct();
            setEditingQuantity(null);
            alert("Quantidade atualizada com sucesso!");
        }
    });

    useEffect(() => {
        if (product) {
            reset({
                id: product?.id,
                name: product?.name,
                price: product?.price?.toString()
            });
        }
    }, [product]);

    const onSubmit = (values: ProductUpdateType) => update(values);

    const saveFormulation = (data: { productId: number; materialId: number; materialQuantity: number; }) => {
        createRelationship({ productId: data?.productId, materialId: data?.materialId, materialQuantity: data.materialQuantity })
    };

    const removeFormulation = (data: { productId: number; materialId: number; }) => {
        removeRelationship({ productId: data?.productId, materialId: data?.materialId })
    };

    const saveQuantity = (materialId: number, quantity: number) => {
        updateRelationship({ productId: Number(id), materialId, materialQuantity: quantity });
    };

    const linkedMaterialIds = new Set((product?.rawMaterials ?? []).map((rm) => rm.id));
    const availableMaterials = (rawMaterials ?? []).filter(
        (rm) => !linkedMaterialIds.has(rm.id) && 
        rm.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col w-full gap-y-3">
            <BackButton title={product?.name ?? "Editar Produto"} redirectTo={"/produtos"}/>
            
            <div className="flex flex-col">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-y-6">
                        <Fieldset>
                            <Field>
                                <Label className="">Nome</Label>
                                <Input
                                    {...register("name", {
                                        required: "O nome é obrigatório."
                                    })}
                                    className={"block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </Field>
                            <Field>
                                <Label className="">Preço</Label>
                                <Input 
                                    {...register("price", {
                                        required: "O preço é obrigatório.",
                                        validate: (value) => parseFloat(value) > 0 || "O preço deve ser maior que zero.",
                                    })}
                                    className={"block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"}
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.price.message}
                                    </p>
                                )}
                            </Field>
                        </Fieldset>

                        <div className="flex flex-col gap-y-3">
                            <h2 className="font-bold text-lg">
                                Matérias-Primas Constituintes
                            </h2>

                            {(product?.rawMaterials ?? []).length > 0 ? (
                                <div className="flex flex-col gap-y-2">
                                    {product?.rawMaterials.map((rm) => (
                                        <div 
                                            key={rm.id}
                                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-medium text-gray-900">{rm.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {editingQuantity && editingQuantity.materialId === rm.id ? (
                                                    <>
                                                        <input
                                                            type="number"
                                                            defaultValue={editingQuantity.quantity}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    const value = Number((e.target as HTMLInputElement).value);
                                                                    if (value > 0) {
                                                                        saveQuantity(rm.id, value);
                                                                    }
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                const value = Number(e.target.value);
                                                                if (value > 0) {
                                                                    saveQuantity(rm.id, value);
                                                                } else {
                                                                    setEditingQuantity(null);
                                                                }
                                                            }}
                                                            className="rounded-md border border-primary bg-blue-50 px-3 py-1.5 text-sm text-center focus:ring-2 focus:ring-primary focus:border-primary outline-none min-w-[150px]"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingQuantity({ materialId: rm.id, quantity: rm.materialQuantity })}
                                                            className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors min-w-[150px]"
                                                        >
                                                            <span className="font-medium">{rm.materialQuantity}</span>
                                                            <span className="text-xs text-gray-500">unidades</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            <button 
                                                type="button" 
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                onClick={() => product?.id && removeFormulation({ productId: product.id, materialId: rm.id })}
                                                title="Remover"
                                            >
                                                <p className="text-xl">
                                                    X
                                                </p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <p className="text-sm text-gray-500">
                                        Este produto não possui matérias-primas vinculadas.
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Adicione matérias-primas abaixo.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-y-3">
                            <h2 className="font-bold text-lg">Adicionar Matérias-Primas</h2>
                            
                            <Input
                                type="text"
                                placeholder="Buscar matéria-prima..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={"block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"}
                            />
                            {availableMaterials.length > 0 && (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {availableMaterials.map((rm) => (
                                            <div 
                                                key={rm.id} 
                                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">{rm.name}</span>
                                                    <span className="text-xs text-gray-500">Estoque: {rm.stockQuantity ?? 0}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="ml-2 px-3 py-1.5 text-xs font-medium text-primary border-primary rounded-md border-2 ring-2 hover:bg-primary hover:text-white transition-colors"
                                                    onClick={() => {
                                                        const quantity = prompt(`Informe a quantidade de "${rm.name}" para este produto:`);
                                                        if (quantity && Number(quantity) > 0 && product?.id && rm?.id) {
                                                            saveFormulation({ productId: product.id, materialId: rm.id, materialQuantity: Number(quantity) });
                                                        }
                                                    }}
                                                >
                                                    + Adicionar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {availableMaterials.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    {searchTerm ? "Nenhuma matéria-prima encontrada" : "Todas as matérias-primas já foram vinculadas"}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-row justify-end">
                            <Button
                                className="w-full max-w-50 bg-primary text-white hover:brightness-90"
                                type="submit"
                            >
                                Salvar
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
