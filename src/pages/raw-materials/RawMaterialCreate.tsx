import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createRawMaterial } from "../../service/raw-material-service";
import { Fieldset, Field, Label, Input, Button } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButtonComponent";
import type { RawMaterialCreateType } from "../../types/RawMaterialTypes";

export default function RawMaterialCreate() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        handleSubmit,
        register,
        formState: {
            errors
        }
    } = useForm<RawMaterialCreateType>({
        defaultValues: {
            name: "",
            stockQuantity: ""
        }
    });

    const { mutate: create } = useMutation({
        mutationFn: createRawMaterial,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getRawMaterials"] });
            navigate("/materias-primas");
            alert("Matéria-prima criada com sucesso!");
        }
    });

    const onSubmit = (values: RawMaterialCreateType) => create(values);

    return (
        <div className="flex flex-col w-full gap-y-3">
            <BackButton title={"Nova Matéria-Prima"} redirectTo={"/materias-primas"}/>

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
                                    className={"w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"}
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
                                    className={"w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"}
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
