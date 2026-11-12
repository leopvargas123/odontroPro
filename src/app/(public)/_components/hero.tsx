import { Button } from "@base-ui/react";
import Image from "next/image";
import doctorImg from '../../../../public/doctor-hero.png'

export function Hero(){
    return(
        <section className="bg-white">
           <div className="container mx-auto px-4 pt-20 pb-4 sm:pb-0 sm:px-6 lg:px-8">

            <main className="flex items-center justify-center">
                <article className="flex-2 space-y-8 max-w-3xl flex flex-col">
                    <h1 className="text-4xl lg:text-5xl font-bold max-w-2xl tracking-tight">
                    Encontre os melhores profissionais em un único local!
                    </h1>
                    <p className="text-base md:text-lg text-gray-600">
                    Nós somos uma poaltaforma para profissionais de saspude com foco em agilizar
                    seu atendimento de forma simplificada e orfanizada.
                    </p>
                    <Button className="bg-emerald-500 hover:bg-emerald-400 rounded p-2 text-white w-fit font-semibold px-6">
                        Encontre uma clínica
                    </Button>
                </article>

            <div className="hidden lg:block">
                <Image
                priority
                quality={100}
                width={340}
                height={400}
                className="object-contain"
                src={doctorImg}
                alt="Foto ilustrativa profissional da saúde"
                
                />
            </div>

            </main>

           </div>
        </section>
    )
}