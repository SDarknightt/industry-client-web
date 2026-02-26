import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteProduct, getProducts } from "../../service/product-service";
import { Button } from "@headlessui/react";
import ButtonOptions from "../../components/button/ButtonOptionsComponent";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/button/BackButtonComponent";

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
            alert("Produto deletado com sucesso!");
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

            <div className="overflow-x-auto border border-light-green rounded-lg">
                <table className="w-full text-left table-auto">
                    <thead className="bg-primary text-white uppercase">
                        <tr>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold ">
                                    Nome
                                </p>
                            </th>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold">
                                    Preço
                                </p>
                            </th>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold ">
                                    #
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-graphite">
                        {(products ?? []).map((p: any, index: number) => (
                            <tr key={p.id || index} className="hover:bg-gray-50 border-y-2 border-[#E9ECE9]" onClick={() => navigate(`/produtos/${p.id}`)}>
                                <td className="p-4 text-sm text-gray-900">
                                    {p?.name ?? "-"}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    R$ {p?.price ?? "-"}
                                </td>
                                <td className="p-4 text-sm text-gray-900" onClick={(e) => e.stopPropagation()}>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}