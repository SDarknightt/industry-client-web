import { useQuery } from "@tanstack/react-query";
import { getProductionRecommendation } from "../service/product-service";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const { data: products } = useQuery({
        queryKey: ['getProductionRecommendation'],
        queryFn: () => getProductionRecommendation(),
    });
    
    return (
        <div className="flex flex-col w-full gap-y-6">
            <h1 className="text-2xl font-bold text-black">Recomendações de Produção</h1>

            <div className="flex flex-row gap-4">
                <button 
                    onClick={() => navigate("/produtos")}
                    className="flex flex-row items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 font-medium"
                >
                    Ver Produtos
                </button>
                <button 
                    onClick={() => navigate("/materias-primas")}
                    className="flex flex-row items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:brightness-90 font-medium"
                >
                    Ver Matérias Primas
                </button>
            </div>

            <div className="overflow-x-auto border border-light-green rounded-lg">
                <table className="w-full text-left table-auto">
                    <thead className="bg-primary text-white uppercase">
                        <tr>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold">Produto</p>
                            </th>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold">Qtd. Produzível</p>
                            </th>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold">Valor Unit.</p>
                            </th>
                            <th className="p-4 border-b">
                                <p className="text-sm font-semibold">Valor Total</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-graphite">
                        {(products ?? []).map((p: any, index: number) => (
                            <tr key={p.id || index} className="hover:bg-gray-50 border-y-2 border-[#E9ECE9]">
                                <td className="p-4 text-sm text-gray-900">
                                    {p?.name ?? "-"}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    {p?.maxProductionQuantity ?? "-"}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    R$ {p?.price?.toFixed(2) ?? "-"}
                                </td>
                                <td className="p-4 text-sm text-gray-900">
                                    R$ {p?.totalPrice?.toFixed(2) ?? "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}