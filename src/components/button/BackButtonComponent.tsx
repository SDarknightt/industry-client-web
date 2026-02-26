import { useNavigate } from "react-router-dom";
import ArrowSvg  from '../../assets/arrow-svgrepo.svg?react';

export default function BackButton({ title, redirectTo } : { redirectTo: string; title: string; }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-row gap-x-3 hover:brightness-90" onClick={() => navigate(redirectTo)}>
            <ArrowSvg className="h-8 w-8 text-primary" />
            <p className="text-2xl font-bold text-gray-800">
                {title}
            </p>
        </div>
    );
};