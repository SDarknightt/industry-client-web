import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getRawMaterialById, updateRawMaterial } from "../../service/raw-material-service";
import { Fieldset, Field, Label, Input, Button } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import BackButton from "../../components/button/BackButtonComponent";
import type { RawMaterialUpdateType } from "../../types/RawMaterialTypes";

export default function RawMaterialUpdate() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams();

    const {
        reset,
        handleSubmit,
        register,
        formState: {
            errors
        }
    } = useForm<RawMaterialUpdateType>({
        defaultValues: {
            name: "",
            stockQuantity: ""
        }
    });

    const { data: rawMaterial } = useQuery({
        queryKey: ['getRawMaterialById', id],
        queryFn: () => getRawMaterialById(Number(id)),
        enabled: !!Number(id),
    });

    const { mutate: update } = useMutation({
        mutationFn: updateRawMaterial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getRawMaterials"] });
            navigate("/materias-primas");
            alert("Matéria-prima editada com sucesso!");
        }
    });

    useEffect(() => {
        if (rawMaterial) {
            reset({
                id: rawMaterial?.id,
                name: rawMaterial?.name,
                stockQuantity: rawMaterial?.stockQuantity
            });
        }
    }, [rawMaterial]);

    const onSubmit = (values: RawMaterialUpdateType) => update(values);

    return (
        <div className="flex flex-col w-full gap-y-3">
            <BackButton title={rawMaterial?.name ?? "Editar Matéria-Prima"} redirectTo={"/materias-primas"}/>

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
                                <Label className="">Quantidade em Estoque</Label>
                                <Input 
                                    type="number"
                                    {...register("stockQuantity", {
                                        required: "A quantidade é obrigatória.",
                                        validate: (value) => parseFloat(value) >= 0 || "A quantidade deve ser zero ou maior.",
                                    })}
                                    className={"block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"}
                                />
                                {errors.stockQuantity && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.stockQuantity.message}
                                    </p>
                                )}
                            </Field>
                        </Fieldset>

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
