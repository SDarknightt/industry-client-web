import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getRawMaterialById } from "../../service/raw-material-service";
import BackButton from '../../components/button/BackButtonComponent';

export default function RawMaterialDetails() {
    const { id } = useParams();

    const { data: material, isLoading } = useQuery({
        queryKey: ["getRawMaterialById", id],
        queryFn: () => getRawMaterialById(Number(id)),
        enabled: !!Number(id),
    });

    if (isLoading) {
        return <div className="p-4">Carregando...</div>;
    }

    if (!material) {
        return <div className="p-4 text-red-500">Matéria-prima não encontrada.</div>;
    }

    return (
        <div className="flex flex-col w-full gap-y-6">
            <BackButton title={material?.name ?? "Detalhes da Matéria-Prima"} redirectTo={"/materias-primas"}/>

            <div className="flex flex-col gap-y-4 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {material.name}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">Quantidade em Estoque</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {material.stockQuantity}
                    </p>
                </div>
            </div>
        </div>
    );
}
