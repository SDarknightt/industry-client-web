import { useQuery } from "@tanstack/react-query";
import { getProductionRecommendation } from "../service/product-service";
import { useNavigate } from "react-router-dom";
import { TableComponent } from "../components/table/TableComponent";

export default function Home() {
    const navigate = useNavigate();

    const { data: products } = useQuery({
        queryKey: ['getProductionRecommendation'],
        queryFn: () => getProductionRecommendation(),
    });
    
    return (
        <div className="flex flex-col w-full gap-y-6">
            <p className="text-3xl sm:text-4xl font-bold text-black">Recomendações de Produção</p>

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

            <TableComponent
                onRowClick={(p) => navigate("/produtos/"+p.id)}
                data={products ?? []}
                columns={[
                    {
                        header: "Produto",
                        objectMap: "name"
                    },
                    {
                        header: "Qtd. Produzível",
                        objectMap: "maxProductionQuantity"
                    },
                    {
                        header: "Valor Unit.",
                        objectMap: "price",
                        reactNode: (p) => <span>{p?.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    },
                    {
                        header: "Valor Total",
                        objectMap: "totalPrice",
                        reactNode: (p) => <span>{p?.totalPrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    },
                ]}
            />
        </div>
    );
}