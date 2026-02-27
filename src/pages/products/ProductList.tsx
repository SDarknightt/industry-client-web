import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteProduct, getProducts } from "../../service/product-service";
import { Button } from "@headlessui/react";
import ButtonOptions from "../../components/button/ButtonOptionsComponent";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButtonComponent";
import { TableComponent } from "../../components/table/TableComponent";
import { toast } from "react-toastify";

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
                    className="flex flex-row items-center justify-center text-center gap-x-2 font-bold w-full max-w-50 bg-primary text-white hover:brightness-90" 
                    onClick={() => navigate("/produtos/novo")}
                >
                    <span className="text-xl">+</span> Cadastrar
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
                        header: "Preço",
                        objectMap: "price"
                    },
                    {
                        header: "#",
                        objectMap: "#",
                        reactNode: (p) => (
                            <ButtonOptions   
                                buttons={[
                                    {
                                        title: "Editar",
                                        onClick: () => navigate(`/produtos/${p.id}/editar`)
                                    },
                                    {
                                        title: "Deletar",
                                        onClick: () => remove(p?.id)    
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