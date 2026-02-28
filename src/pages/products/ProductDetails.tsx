import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProductById } from "../../service/product-service";
import BackButton from '../../components/button/BackButtonComponent';
import { TableComponent } from "../../components/table/TableComponent";

export default function ProductDetails() {
    const { id } = useParams();

    const { data: product } = useQuery({
        queryKey: ["getProductById", id],
        queryFn: () => getProductById(Number(id)),
        enabled: !!Number(id),
    });

    if (!product) {
        return <div className="p-4 text-red-500">Produto não encontrado.</div>;
    }

    return (
        <div className="flex flex-col w-full gap-y-6">
            <BackButton title={product?.name ?? "Detalhes do Produto"} redirectTo={"/produtos"}/>

            <div className="flex flex-col gap-y-4 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {product.name}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Valor Unitário</p>
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
                    <TableComponent
                        data={product.rawMaterials ?? []}
                        columns={[
                            {
                                header: "Nome",
                                objectMap: "name"
                            },
                            {
                                header: "Qtd. Utilizada",
                                objectMap: "materialQuantity"
                            }
                        ]}
                    />
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-sm text-gray-500">
                            Este produto não possui matérias-primas vinculadas.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}