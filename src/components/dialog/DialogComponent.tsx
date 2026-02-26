import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useEffect, useState, type ReactNode } from 'react'

export default function ModalComponent({ children, title, buttonTitle, toggleOpen, onClose } : { children: ReactNode; title: string; buttonTitle: string; toggleOpen?: boolean; onClose?: () => void; }) {
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  }
  
  useEffect(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [toggleOpen]);

  return (
    <>
      <Button
        onClick={open}
        className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
      >
       {buttonTitle}
      </Button>

      <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-black/60 p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                {title}
              </DialogTitle>
              
              <div className="flex flex-col">
                {children}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}