import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../service/product-service";
import { Button } from "@headlessui/react";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: product, isLoading } = useQuery({
        queryKey: ["getProductById", id],
        queryFn: () => getProductById(Number(id)),
        enabled: !!Number(id),
    });

    if (isLoading) {
        return <div className="p-4">Carregando...</div>;
    }

    if (!product) {
        return <div className="p-4 text-red-500">Produto não encontrado.</div>;
    }

    return (
        <div className="flex flex-col w-full gap-y-6">
            <p className="text-2xl font-bold text-gray-800">
                Detalhes do Produto
            </p>

            <div className="flex flex-col gap-y-4 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {product.name}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Preço</p>
                    <p className="text-lg font-semibold text-gray-900">
                        R$ {Number(product.price).toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-y-2">
                <h2 className="font-bold text-lg">
                    Matérias-Primas Constituintes
                </h2>

                {product.rawMaterials?.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-left table-auto">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700">
                                            Nome
                                        </p>
                                    </th>
                                    <th className="p-4 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700">
                                            Quantidade Utilizada
                                        </p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {product.rawMaterials.map((rm: any, index: number) => (
                                    <tr key={rm.id || index} className="hover:bg-gray-50">
                                        <td className="p-4 text-sm text-gray-900">
                                            {rm?.name ?? "-"}
                                        </td>
                                        <td className="p-4 text-sm text-gray-900">
                                            {rm?.materialQuantity ?? 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        Este produto não possui matérias-primas vinculadas.
                    </p>
                )}
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-4">
                <Button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 rounded-md bg-gray-500 px-3 py-1.5 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-gray-600"
                >
                    Voltar
                </Button>

                <Button
                    type="button"
                    onClick={() => navigate(`/produtos/${product.id}/editar`)}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-blue-700"
                >
                    Editar
                </Button>
            </div>
        </div>
    );
}