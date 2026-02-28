import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getProductById, updateProduct } from "../../service/product-service";
import { Fieldset, Field, Label, Input, Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { getRawMaterials } from "../../service/raw-material-service";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createProductRawMaterialRelationship, deleteProductRawMaterialRelationship, updateProductRawMaterialRelationship } from "../../service/product-raw-material-service";
import BackButton from "../../components/button/BackButtonComponent";
import type { ProductUpdateType } from "../../types/ProductTypes";
import { toast } from "react-toastify";
import CloseSvg  from '../../assets/close-svgrepo.svg?react';
import PlusSvg  from '../../assets/plus-svgrepo.svg?react';

export default function ProductUpdate() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingQuantity, setEditingQuantity] = useState<{ materialId: number; quantity: number } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<{ id: number; name: string } | null>(null);
    const [modalQuantity, setModalQuantity] = useState("");

    const { id } = useParams();

    const {
        watch,
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

    const name = watch("name");
    const price = watch("price");

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
            toast.success("Produto editado com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao editar o produto!");
        }
    });

    const { mutate: createRelationship } = useMutation({
        mutationFn: createProductRawMaterialRelationship,
        onSuccess: () => {
            // Invalidate cache to fetch again
            queryClient.invalidateQueries({ queryKey: ["getRawMaterials"] });
            refetchProduct();
            toast.success("Matéria-prima adicionada com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao adicionar a matéria-prima!");
        }
    });

    const { mutate: removeRelationship } = useMutation({
            mutationFn: deleteProductRawMaterialRelationship,
            onSuccess: () => {
                refetchProduct();
                toast.success("Matéria-prima removida com sucesso!");
            },
            onError: () => {
                toast.error("Erro ao remover a matéria-prima!");
            }
        });

    const { mutate: updateRelationship } = useMutation({
        mutationFn: updateProductRawMaterialRelationship,
        onSuccess: () => {
            refetchProduct();
            setEditingQuantity(null);
            toast.success("Quantidade atualizada com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao atualizar a quantidade!");
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
                                <Label className="">Valor Unitário</Label>
                                <Input 
                                    {...register("price", {
                                        required: "O valor é obrigatório.",
                                        validate: (value) => parseFloat(value) > 0 || "O valor deve ser maior que zero.",
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
                                        <div key={rm.id} className="flex flex-col gap-x-2">
                                            <div className="flex flex-col items-end gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                                <div className="flex flex-row w-full items-center justify-between flex-1">
                                                    <p className="text-md font-medium text-gray-900">{rm.name}</p>
                                                    <button 
                                                        type="button" 
                                                        className="!p-2 max-w-15 h-full text-red-600 hover:bg-red-50 rounded-md transition-colors w-full sm:w-auto"
                                                        onClick={() => product?.id && removeFormulation({ productId: product.id, materialId: rm.id })}
                                                        title="Remover"
                                                    >
                                                        <CloseSvg className="h-7"/>
                                                    </button>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-end w-full sm:w-auto">
                                                    <div className="flex flex-col rounded border border-gray-300 bg-gray-50 px-2 sm:px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary outline-none w-full sm:max-w-[120px] sm:min-w-[150px] gap-1 justify-center items-center">
                                                        {editingQuantity && editingQuantity.materialId === rm.id ? (
                                                            <>
                                                                <input
                                                                    type="number"                                                                
                                                                    className="w-full text-center sm:text-left px-1 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
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
                                                                />
                                                                <span className="text-xs text-gray-500 sm:w-full text-center sm:text-left">unidades</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditingQuantity({ materialId: rm.id, quantity: rm.materialQuantity })}
                                                                    className="flex items-center gap-1 h-full text-sm rounded-md transition-colors w-full"
                                                                >
                                                                    <span className="font-medium">{rm.materialQuantity}</span>
                                                                    <span className="text-xs text-gray-500">unidades</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>                                                    
                                            </div>
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
                                                    className="flex flex-row items-center justify-center px-3 py-1.5 text-xs font-medium text-primary border-primary rounded-md border-2 ring-2 hover:bg-primary hover:text-white transition-colors"
                                                    onClick={() => {
                                                        setSelectedMaterial({ id: rm.id, name: rm.name });
                                                        setModalQuantity("");
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <PlusSvg className="h-6"/> <p>Adicionar</p>
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
                                disabled={name?.trim() == product?.name && price?.trim() == product?.price?.toString()}
                                className="w-full max-w-50 bg-primary text-white hover:brightness-90 disabled:bg-gray-400 disabled:brightness-100"
                                type="submit"
                            >
                                Salvar
                            </Button>
                        </div>

                        <Dialog open={isModalOpen} as="div" className="relative z-50 focus:outline-none" onClose={() => setIsModalOpen(false)}>
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4">
                                    <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                                        <DialogTitle as="h3" className="text-lg font-medium text-gray-900">
                                            Adicionar Matéria-Prima
                                        </DialogTitle>
                                        
                                        <div className="flex flex-col mt-4 gap-y-4">
                                            <p className="text-sm text-gray-600">
                                                Informe a quantidade de <span className="font-medium">{selectedMaterial?.name}</span> para este produto:
                                            </p>
                                            
                                            <Input
                                                type="number"
                                                value={modalQuantity}
                                                onChange={(e) => setModalQuantity(e.target.value)}
                                                placeholder="Quantidade"
                                                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                                                autoFocus
                                            />

                                            <div className="flex flex-row gap-3 justify-end mt-2">
                                                <Button
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                                    onClick={() => setIsModalOpen(false)}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:brightness-90"
                                                    onClick={() => {
                                                        if (modalQuantity && Number(modalQuantity) > 0 && product?.id && selectedMaterial?.id) {
                                                            saveFormulation({ productId: product.id, materialId: selectedMaterial.id, materialQuantity: Number(modalQuantity) });
                                                            setIsModalOpen(false);
                                                        }
                                                    }}
                                                >
                                                    Adicionar
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogPanel>
                                </div>
                            </div>
                        </Dialog>
                    </div>
                </form>
            </div>
        </div>
    );
}
