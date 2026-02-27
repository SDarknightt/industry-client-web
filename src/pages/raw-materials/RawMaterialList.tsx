import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteRawMaterial, getRawMaterials } from "../../service/raw-material-service";
import { Button } from "@headlessui/react";
import ButtonOptions from "../../components/button/ButtonOptionsComponent";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButtonComponent";
import { TableComponent } from "../../components/table/TableComponent";

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
            <BackButton title={"Listar Matérias-Primas"} redirectTo={"/"} />

            <div className="flex flex-row justify-end">
                <Button 
                    className="flex flex-row items-center justify-center text-center gap-x-2 font-bold w-full max-w-50 bg-primary text-white hover:brightness-90" 
                    onClick={() => navigate("/materias-primas/novo")}
                >
                    <span className="text-xl">+</span> Cadastrar
                </Button>
            </div>

            <TableComponent
                data={materials ?? []}
                onRowClick={(m) => navigate(`/materias-primas/${m.id}`)}
                columns={[
                    {
                        header: "Nome",
                        objectMap: "name"
                    },
                    {
                        header: "Qtd. Estoque",
                        objectMap: "stockQuantity",
                    },
                    {
                        header: "#",
                        objectMap: "#",
                        reactNode: (m) => (
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
                        )
                    },
                ]}
            />
        </div>
    );
}
