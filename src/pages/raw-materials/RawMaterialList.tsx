import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteRawMaterial, getRawMaterials } from "../../service/raw-material-service";
import { Button } from "@headlessui/react";
import ButtonOptions from "../../components/button/ButtonOptionsComponent";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButtonComponent";

export default function RawMaterialList() {
    const navigate = useNavigate();

    const { data: materials, refetch } = useQuery({
        queryKey: ['getRawMaterials'],
        queryFn: () => getRawMaterials(),
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteRawMaterial,
        onSuccess: () => {
            refetch();
            alert("Matéria-prima deletada com sucesso!");
        }
    });

    return (
        <div className="flex flex-col w-full gap-y-3 h-auto">
            <BackButton title={"Listar Matérias Primas"} redirectTo={"/"} />

            <div className="flex flex-row justify-end">
                <Button 
                    className="flex flex-row items-center justify-center text-center gap-x-2 font-bold w-full max-w-50 bg-primary text-white hover:brightness-90" 
                    onClick={() => navigate("/materias-primas/novo")}
                >
                    <span className="text-xl">+</span> Cadastrar
                </Button>
            </div>

            <div className="overflow-x-auto border border-light-green rounded-lg">
                <table className="w-full text-left table-auto">
                    <thead className="bg-primary text-white uppercase">
                        <tr>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold">
                                    Nome
                                </p>
                            </th>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold">
                                    Quantidade em Estoque
                                </p>
                            </th>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold">
                                    #
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-graphite">
                        {(materials ?? []).map((m, index: number) => (
                            <tr key={m.id || index} className="hover:bg-gray-50 border-y-2 border-[#E9ECE9]">
                                <td className="p-4 text-sm text-gray-900">
                                    {m?.name ?? "-"}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    {m?.stockQuantity ?? "-"}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    <ButtonOptions   
                                        buttons={[
                                            {
                                                title: "Editar",
                                                onClick: () => navigate(`/materias-primas/${m.id}/editar`)
                                            },
                                            {
                                                title: "Deletar",
                                                onClick: () => remove(m?.id)    
                                            }
                                        ]}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
