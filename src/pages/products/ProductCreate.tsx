import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { createProduct } from "../../service/product-service";
import { Fieldset, Field, Label, Input, Button } from "@headlessui/react";
import { clsx } from "clsx";
import { getRawMaterials } from "../../service/raw-material-service";
import { useNavigate } from "react-router-dom";

type ProductCreate = {
    name: string;
    price: string;
    rawMaterials?: RawMaterialQuantity[];
};

type RawMaterialQuantity = {
    id: number;
    quantity: number;
    name: string;
};

export default function CreateProduct() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        register,
        formState: {
            errors
        }
    } = useForm<ProductCreate>({
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

    const { mutate: create } = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            // Invalidate cache to fetch again
            queryClient.invalidateQueries({ queryKey: ["getProducts"] });
            navigate("/produtos");
            alert("Produto criado com sucesso!");
        }
    });

    const addToFieldArray = (data: RawMaterialQuantity) => {
        if (fields.some((f) => f.id == data.id)) return;
        append({ id: data?.id, name: data?.name, quantity: data?.quantity });
    };

    const onSubmit = (values: ProductCreate) => create(values);

    return (
        <div className="flex flex-col w-full gap-y-3">
            <p className="text-2xl font-bold text-gray-800">
                Novo Produto
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
                                                    <button
                                                        type="button"
                                                        className="text-blue-600 hover:underline font-medium"
                                                        onClick={() => addToFieldArray({ id: rm?.id, name: rm?.name, quantity: 1 })}
                                                    >
                                                        Adicionar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {fields?.length > 0 && (
                            <div className="flex flex-col gap-y-2 mt-4">
                                <h2 className="font-bold text-lg">Matérias-Primas Constituintes</h2>
                                <p className="text-sm text-gray-600">Informe a quantidade utilizada de cada matéria prima.</p>
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full text-left table-auto">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-4 border-b border-gray-200"><p className="text-sm font-semibold text-gray-700">Nome</p></th>
                                                <th className="p-4 border-b border-gray-200"><p className="text-sm font-semibold text-gray-700">Quantidade Utilizada</p></th>
                                                <th className="p-4 border-b border-gray-200 text-center"><p className="text-sm font-semibold text-gray-700">#</p></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {fields.map((field, index) => (
                                                <tr key={field.fieldId}>
                                                    <td className="p-4 text-sm text-gray-900">{field?.name ?? "-"}</td>
                                                    <td className="p-4">
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            {...register(`rawMaterials.${index}.quantity` as const, { valueAsNumber: true })}
                                                            className="w-full rounded-md border-gray-300 bg-gray-50 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                            placeholder="0"
                                                        />
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <button 
                                                            type="button" 
                                                            className="text-red-600 hover:underline font-medium"
                                                            onClick={() => remove(index)}
                                                        >
                                                            Remover
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

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