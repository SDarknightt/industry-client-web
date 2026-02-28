import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { createProduct } from "../../service/product-service";
import { Fieldset, Field, Label, Input, Button } from "@headlessui/react";
import { getRawMaterials } from "../../service/raw-material-service";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "../../components/button/BackButtonComponent";
import type { ProductCreateType, RawMaterialQuantity } from "../../types/ProductTypes";
import { toast } from "react-toastify";
import PlusSvg  from '../../assets/plus-svgrepo.svg?react';
import CloseSvg  from '../../assets/close-svgrepo.svg?react';

export default function CreateProduct() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const {
        control,
        handleSubmit,
        register,
        formState: {
            errors
        }
    } = useForm<ProductCreateType>({
        defaultValues: {
            name: "",
            price: "",
            rawMaterials: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rawMaterials",
        keyName: "fieldId"
    });

    const { data: rawMaterials } = useQuery({
        queryKey: ['getRawMaterials'],
        queryFn: () => getRawMaterials(),
    });

    const addedIds = new Set(fields.map(f => f.id));
    const availableMaterials = (rawMaterials ?? []).filter(
        (rm: any) => !addedIds.has(rm.id) && 
        rm.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { mutate: create } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            // Invalidate cache to fetch again
            queryClient.invalidateQueries({ queryKey: ["getProducts"] });
            navigate("/produtos");
            toast.success('Produto criado com sucesso!');
        },
        onError: () => {
            toast.error("Erro ao criar o produto!");
        }
    });

    const addToFieldArray = (data: RawMaterialQuantity) => {
        if (fields.some((f) => f.id == data.id)) return;
        append({ id: data?.id, name: data?.name, quantity: data?.quantity });
    };

    const onSubmit = (values: ProductCreateType) => create(values);

    return (
        <div className="flex flex-col w-full gap-y-3">
            <BackButton title={"Novo Produto"} redirectTo={"/produtos"}/>

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
                                <Label>Valor Unitário</Label>
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
                            <h2 className="font-bold text-lg">Adicionar Matérias-Primas</h2>
                            
                            <Input
                                type="text"
                                placeholder="Buscar matéria-prima..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={"block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"}
                            />

                            {availableMaterials.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {availableMaterials.map((rm: any) => (
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
                                                className="flex flex-row items-center justify-center px-3 py-1.5 text-xs font-medium text-primary border-[1px] border-primary rounded-md border-2 ring-2 hover:bg-primary hover:text-white transition-colors"
                                                onClick={() => addToFieldArray({ id: rm.id, name: rm.name, quantity: 1 })}
                                            >
                                                <PlusSvg className="h-6"/> <p>Adicionar</p>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {searchTerm ? "Nenhuma matéria-prima encontrada" : "Todas as matérias-primas já foram adicionadas"}
                                </div>
                            )}
                        </div>

                        {fields?.length > 0 && (
                            <div className="flex flex-col gap-y-3 mt-4">
                                <h2 className="font-bold text-lg">Matérias-Primas Constituintes</h2>
                                <p className="text-sm text-gray-600">Informe a quantidade utilizada de cada matéria prima.</p>
                                <div className="space-y-2">
                                    {fields.map((field, index) => (
                                        <div key={field.fieldId} className="flex flex-col gap-x-2">
                                            <div className="flex flex-col items-end gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                                <div className="flex flex-row w-full items-center justify-between flex-1">
                                                    <p className="text-md font-medium text-gray-900">{field.name}</p>
                                                    <button 
                                                        type="button" 
                                                        className="!p-2 max-w-15 h-full text-red-600 hover:bg-red-50 rounded-md transition-colors w-full sm:w-auto"
                                                        onClick={() => remove(index)}
                                                        title="Remover"
                                                    >
                                                        <CloseSvg className="h-7"/>
                                                    </button>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-end gap-2 w-full sm:w-auto">
                                                    <div className="flex flex-col rounded border border-gray-300 bg-gray-50 px-2 sm:px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary outline-none w-full sm:max-w-[120px] sm:min-w-[150px] gap-1 justify-center items-center">
                                                        <input
                                                            type="number"
                                                            {...register(`rawMaterials.${index}.quantity` as const, { 
                                                            valueAsNumber: true, 
                                                            validate: (value) => value && value > 0 || "O valor deve ser maior que zero." 
                                                            })}
                                                            className="w-full text-center sm:text-left px-1 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                                            placeholder="0"
                                                        />
                                                        <span className="text-xs text-gray-500 sm:w-full text-center sm:text-left">unidades</span>
                                                    </div>
                                                </div>                                                    
                                            </div>
                                            <div>
                                                {errors.rawMaterials?.[index]?.quantity && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.rawMaterials[index].quantity?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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