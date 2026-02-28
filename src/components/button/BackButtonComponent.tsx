import { useNavigate } from "react-router-dom";
import ArrowSvg  from '../../assets/arrow-svgrepo.svg?react';

export default function BackButton({ title, redirectTo } : { redirectTo: string; title: string; }) {
    const navigate = useNavigate();
    return (
        <div className="flex flex-row items-center gap-x-3 hover:brightness-80 my-3 cursor-pointer" onClick={() => navigate(redirectTo)}>
            <ArrowSvg className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
            <p className="text-2xl sm:text-4xl font-bold text-gray-800">
                {title}
            </p>
        </div>
    );
};