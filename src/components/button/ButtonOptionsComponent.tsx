import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import OptionsSvg  from '../../assets/menu-svgrepo.svg?react';
import type { ReactNode } from "react";

export default function ButtonOptions({ title, buttons }: { title?: string; buttons: { title: string; icon?: ReactNode; onClick: () => void }[]; }) {
    return (
        <Menu>
            <MenuButton className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 hover:brightness-90">
                {title ?? <OptionsSvg className="h-6 text-white"/>}
            </MenuButton>

            <MenuItems
                transition
                anchor="bottom end"
                className="flex flex-col gap-y-2 w-52 bg-primary/75 backdrop-blur-2xl  origin-top-right rounded-xl border border-white/5  p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
            >
                {(buttons ?? []).map((button) => (
                    <MenuItem key={button.title}>
                        <button
                            onClick={button.onClick} 
                            className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                            {button.title}
                        </button>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}