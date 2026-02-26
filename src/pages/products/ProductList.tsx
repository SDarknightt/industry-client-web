import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteProduct, getProducts } from "../../service/product-service";
import { Button } from "@headlessui/react";
import ButtonOptions from "../../components/button-options/ButtonOptionsComponent";
import { useNavigate } from "react-router-dom";

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
        <div className="flex flex-col w-full gap-y-3">
            <h1>
                Listar Produtos
            </h1>

            <div className="flex flex-row justify-end">
                <Button className="text-white" onClick={() => navigate(`/produtos/novo`)}>+ Cadastrar</Button>
            </div>

            <div
                className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
                <table className="w-full text-left table-auto min-w-max">
                    <thead>
                        <tr>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                    Nome
                                </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                    Preço
                                </p>
                            </th>
                            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                                    #
                                </p>
                            </th>                    
                        </tr>
                    </thead>
                    <tbody>
                        {(products ?? []).map((p: any, index: number) => (
                            <tr key={p.name + index} onClick={() => navigate(`/produtos/${p.id}`)}>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        {p?.name ?? "-"}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50">
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        R$ {p?.price ?? "-"}
                                    </p>
                                </td>
                                <td className="p-4 border-b border-blue-gray-50" onClick={(e) => e.stopPropagation()}>
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                                        <ButtonOptions   
                                            title="Opções"
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
                                    </p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}