
import  getSession  from "@/lib/getSession";
import { redirect } from "next/navigation";
import { ServicesContent } from "./_components/service-content";
import { Suspense } from "react";

export default async function Servies(){
    const session = await getSession()

    if(!session){
        redirect('/login')
    }


    return(
        <Suspense fallback={<div>Carregando...</div>}>
            <ServicesContent userId= {session.user.id}/>
        </Suspense>
       
    )
}

    
