import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteRawMaterial, getRawMaterials } from "../../service/raw-material-service";
import { Button } from "@headlessui/react";
import ButtonOptions from "../../components/button/ButtonOptionsComponent";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButtonComponent";
import { TableComponent } from "../../components/table/TableComponent";
import { toast } from "react-toastify";
import TrashSvg  from '../../assets/trash-svgrepo.svg?react';
import PenSvg  from '../../assets/pen-svgrepo.svg?react';
import PlusSvg  from '../../assets/plus-svgrepo.svg?react';

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
            toast.success("Matéria-prima deletada com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao deletar a matéria-prima!");
        }
    });

    return (
        <div className="flex flex-col w-full gap-y-3 h-auto">
            <BackButton title={"Listar Matérias-Primas"} redirectTo={"/"} />

            <div className="flex flex-row justify-end">
                <Button 
                    className="flex flex-row items-center justify-center text-center gap-x-1 font-bold w-full max-w-50 bg-primary text-white hover:brightness-90" 
                    onClick={() => navigate("/materias-primas/novo")}
                >
                    <PlusSvg className="h-8 w-8"/> Cadastrar    
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
                        disableClick: true,
                        reactNode: (m) => (
                            <ButtonOptions   
                                buttons={[
                                    {
                                        title: "Editar",
                                        onClick: () => navigate(`/materias-primas/${m.id}/editar`),
                                        icon: <PenSvg className="h-8 w-8 text-blue-500"/>
                                    },
                                    {
                                        title: "Deletar",
                                        onClick: () => remove(m?.id),
                                        icon: <TrashSvg className="h-8 w-8 text-red-500"/>
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
