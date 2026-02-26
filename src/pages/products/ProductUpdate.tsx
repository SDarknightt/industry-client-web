import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getProductById, updateProduct } from "../../service/product-service";
import { Fieldset, Field, Label, Input, Button } from "@headlessui/react";
import { clsx } from "clsx";
import { getRawMaterials } from "../../service/raw-material-service";
import { useNavigate, useParams } from "react-router-dom";
import ModalComponent from "../../components/dialog/DialogComponent";
import { useEffect, useState } from "react";
import { createProductRawMaterialRelationship, deleteProductRawMaterialRelationship } from "../../service/product-raw-material-service";

type ProductUpdate = {
    name: string;
    price: string;
};

type RawMaterialQuantity = {
    id: number;
    quantity: number;
    name: string;
};

export default function CreateProduct() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formulationQuantity, setFormulationQuantity] = useState<number | null>(null);

    const { id } = useParams();

    const {
        reset,
        handleSubmit,
        register,
        formState: {
            errors
        }
    } = useForm<ProductUpdate>({
        defaultValues: {
            name: "",
            price: ""
        }
    });

    const { data: rawMaterials, refetch: refetchMaterials } = useQuery({
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

    useEffect(() => {
        if (product) {
            reset({
            name: product?.name,
            price: product?.price
        });
        }
    }, [product]);

    const onSubmit = (values: ProductUpdate) => update({id, ...values});

    const saveFormulation = (data: { productId: number; materialId: number; materialQuantity: number; }) => {
        createRelationship({ productId: data?.productId, materialId: data?.materialId, materialQuantity: data.materialQuantity })
    };

    const removeFormulation = (data: { productId: number; materialId: number; }) => {
        removeRelationship({ productId: data?.productId, materialId: data?.materialId })
    };

    return (
        <div className="flex flex-col w-full gap-y-3">
            <p className="text-2xl font-bold text-gray-800">
                {product?.name ?? "Editar Produto"}
            </p>

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
                                    className={clsx(
                                        'mt-3 block w-full rounded-lg border-none bg-black/10 px-3 py-1.5 text-sm/6',
                                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                                    )}
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
                                    className={clsx(
                                        'mt-3 block w-full rounded-lg border-none bg-black/10 px-3 py-1.5 text-sm/6',
                                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                                    )}
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.price.message}
                                    </p>
                                )}
                            </Field>
                        </Fieldset>

                        <div className="flex flex-col gap-y-2">
                            <h2 className="font-bold text-lg">
                                Matérias-Primas Constituintes
                            </h2>

                            {(product?.rawMaterials?? []).length > 0 ? (
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full text-left table-auto">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-4 border-b border-gray-200">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        Nome
                                                    </p>
                                                </th>
                                                <th className="p-4 border-b border-gray-200">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        Quantidade Utilizada
                                                    </p>
                                                </th>
                                                <th className="p-4 border-b border-gray-200">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        Remover
                                                    </p>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {product.rawMaterials.map((rm: any, index: number) => (
                                                <tr key={rm.id || index} className="hover:bg-gray-50">
                                                    <td className="p-4 text-sm text-gray-900">
                                                        {rm?.name ?? "-"}
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-900">
                                                        {rm?.materialQuantity ?? 0}
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-900">
                                                        <button type="button" onClick={() => removeFormulation({ productId: product?.id, materialId: rm?.id })}>Remover</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Este produto não possui matérias-primas vinculadas.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-y-2">
                            <h2 className="font-bold text-lg">Matérias-Primas</h2>
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full text-left table-auto">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-4 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-700">Nome</p>
                                            </th>
                                            <th className="p-4 border-b border-gray-200">
                                                <p className="text-sm font-semibold text-gray-700">Quantidade</p>
                                            </th>
                                            <th className="p-4 border-b border-gray-200 text-center">
                                                <p className="text-sm font-semibold text-gray-700">#</p>
                                            </th>                    
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(rawMaterials ?? []).map((rm: any, index: number) => (
                                            <tr key={rm.id || index} className="hover:bg-gray-50">
                                                <td className="p-4 text-sm text-gray-900">{rm?.name ?? "-"}</td>
                                                <td className="p-4 text-sm text-gray-900">{rm?.stockQuantity ?? "-"}</td>
                                                <td className="p-4 text-center">
                                                    <ModalComponent 
                                                        title="Informe a quantidade da formulação"
                                                        buttonTitle="Adicionar"
                                                        onClose={() => setFormulationQuantity(null)}
                                                    > 
                                                        <div className="flex flex-col gap-y-3">
                                                            <Input
                                                                type="number" 
                                                                value={formulationQuantity?.toString() ?? ""} 
                                                                onChange={(e) => {console.log(Number(e.target.value))
                                                                    setFormulationQuantity(Number(e.target.value) || null)
                                                                }}
                                                                className={clsx(
                                                                    'mt-3 block w-full rounded-lg border-none bg-black/10 px-3 py-1.5 text-sm/6',
                                                                    'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                                                                )}
                                                            />
                                                            <button 
                                                                disabled={!formulationQuantity} 
                                                                onClick={() => formulationQuantity && saveFormulation({ productId: product?.id, materialId: rm?.id, materialQuantity: formulationQuantity })}
                                                            >
                                                                Salvar
                                                            </button>
                                                        </div>
                                                    </ModalComponent>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <Button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                            type="submit"
                        >
                            Salvar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
