import IndustrySvg  from '../../assets/industry-svgrepo.svg?react';

export default function Header() {
  return (
        <header className="flex flex-row items-center px-6 bg-primary h-17.5">
          <div className="flex flex-row gap-x-2 justify-start" onClick={() => window.location.replace("/")}>
            <span className="font-bold"><IndustrySvg className='h-10'/> Produz Mais</span>
          </div>
        </header>
    );
}