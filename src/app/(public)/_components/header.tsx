'use client'

import { 
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    }
    from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, Menu } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { handleRegister } from "../_actions/login";

export function Header() {
  const { data: session, status} = useSession()
  const [isOpen, setIsOpen] = useState(false);
  

  const navItems = [
    {href: "#profissionais", label: "Profissionais"},
    {href: "#servicos", label: "Serviços"},
    
  ]

  async function handleLogin(){
   await handleRegister ("google") 
  }


  const NavLinks = () => (
    <>
    {navItems.map((item) => (
      <Button 
      onClick={() => setIsOpen(false)}
      key={item.href}  
      className="bg-transparent hover:bg-transparent text-black shadow-none"
      >
      <Link href={item.href} className="text-base ">
        {item.label}
      </Link>
      </Button>
    ))}

    {status === 'loading' ? (<></>) : session ? (
      <Link href="/dashboard"
      className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-1 rounded-md px-4" >
        Acessar Clinica
      </Link>
    ) : (

     <Button onClick={handleLogin}>
      <LogIn className="mr-2 h-4 w-4" />
      Portal da clinica</Button>
    )}

    </>
  )



  return (
    <header className="fixed top-0 left-0 right-0 z-999 py-4 px-6 bg-white">
      <div className="container mx-auto flex  items-center justify-between">
        <Link 
        className="text-3xl font-bold text-zinc-900 "
        href="/">
         Odonto<span className="text-emerald-500">PRO</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
            <NavLinks />
        </nav>
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="md:hidden" render={
         <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>
      }
      />
      <SheetContent side="right" className="w-60px sm:w-75px z-9999 flex flex-col gap-4">
          <SheetTitle className="text-lg font-semibold p-4">Menu</SheetTitle>
          <SheetHeader></SheetHeader>
          <SheetDescription className="text-sm text-muted-foreground p-4">
            Veja nossos links
          </SheetDescription>

        <nav className="flex flex-col space-y-4 mt-6">
          <NavLinks />
        </nav>


      </SheetContent>
    </Sheet>
      </div>
    </header>
  );
}