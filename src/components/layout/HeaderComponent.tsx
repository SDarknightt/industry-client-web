import IndustrySvg  from '../../assets/industry-svgrepo.svg?react';

export default function Header() {
    return (
        <header className="flex flex-row justify-between items-center px-6 bg-primary h-17.5">
          <div>
            Menu
          </div>
          <div>
            <IndustrySvg className='h-10'/>
          </div>
        </header>
    );
}