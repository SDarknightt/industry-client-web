import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteProduct, getProducts } from "../../service/product-service";
import { Button } from "@headlessui/react";
import ButtonOptions from "../../components/button/ButtonOptionsComponent";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButtonComponent";
import { TableComponent } from "../../components/table/TableComponent";
import { toast } from "react-toastify";
import TrashSvg  from '../../assets/trash-svgrepo.svg?react';
import PenSvg  from '../../assets/pen-svgrepo.svg?react';
import PlusSvg  from '../../assets/plus-svgrepo.svg?react';

export default function ListProduct() {

    const navigate = useNavigate();

    const { data: products, refetch } = useQuery({
        queryKey: ['getProducts'],
        queryFn: () => getProducts(),
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            refetch();
            toast.success("Produto deletado com sucesso!");
        },
        onError: () => {
            toast.error("Erro ao deletar o produto!");
        }
    });

    return (
        <div className="flex flex-col w-full gap-y-3 h-auto">
            <BackButton title={"Listar Produtos"} redirectTo={"/"}/>

            <div className="flex flex-row justify-end">
                <Button 
                    className="flex flex-row items-center justify-center text-center gap-x-1 font-bold w-full max-w-50 bg-primary text-white hover:brightness-90" 
                    onClick={() => navigate("/produtos/novo")}
                >
                    <PlusSvg className="h-8 w-8"/> Cadastrar
                </Button>
            </div>

            <TableComponent
                data={products ?? []}
                onRowClick={(p) => navigate(`/produtos/${p.id}`)}
                columns={[
                    {
                        header: "Nome",
                        objectMap: "name"
                    },
                    {
                        header: "Valor Unit.",
                        objectMap: "price",
                        reactNode: (p) => <span>{p?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    },
                    {
                        header: "#",
                        objectMap: "#",
                        disableClick: true,
                        reactNode: (p) => (
                            <ButtonOptions   
                                buttons={[
                                    {
                                        title: "Editar",
                                        onClick: () => navigate(`/produtos/${p.id}/editar`),
                                        icon: <PenSvg className="h-8 w-8 text-blue-500"/>
                                    },
                                    {
                                        title: "Deletar",
                                        onClick: () => remove(p?.id),
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