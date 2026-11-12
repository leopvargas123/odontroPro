
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { stripe} from '@/utils/stripe'
import { Plan } from "@/generated/prisma/enums";
import { sub } from "date-fns";
import { revalidatePath } from "next/cache";

/**
 * Salvar, atualizar ou deletar informações das assinaturas (subscription) no banco de dados, sincronizando com a stripe.
 * 
 * @async
 * @function manageSubscription
 * @param { string } subscriptionId - O id da assinatura gerenciada.
 * @param {string} customerId - o Id do cliente associado à assinatura.
 * @param { boolean} createAction - Indica se uma nova assinatura deve ser criada.
 * @param {boolean} deleteAction - Indica se uma assinatura deve ser deletada.
 * @param {Plan} [type] - O plano associado à assinatura.
 * @returns {Promise<Response|void>}
 */

export async function manageSubscription (
    subscriptionId: string,
    customerId: string,
    createAction = false,
    deleteAction = false,
    type?: Plan
){
    //Buscar do banco o usuario com esse customerId
    //salvar os dados da assinatuar feita no banco.

    const findeUser = await prisma.user.findFirst({
        where:{
            stripe_customer_id: customerId
        }
    })

    if(!findeUser){
        return Response.json({error:"Falha ao realizar assinatura"}, {status:400})
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    const subscriptionData = {
        id: subscription.id,
        userId: findeUser.id,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id, 
        plan: type ?? "BASIC"   
    }

    if(subscriptionId && deleteAction){
        await prisma.subscription.delete({
            where:{
                id:subscriptionId
            }
        })

       

        return;
    }
    if(createAction){
        try{
            await prisma.subscription.create({
                data: subscriptionData
            })
        }catch(err){
            console.log(err)
        }
        
    }else{
        try{
               const findSubscription = await prisma.subscription.findFirst({
                where: { id: subscriptionId}
               }) 

               if(!findSubscription) return;

               await prisma.subscription.update({
                where:{
                    id: findSubscription.id
                },
                data:{
                    status: subscription.status,
                    priceId: subscription.items.data[0].price.id,
                    
                }
               })

        }catch(err){

        }
       
    }

}