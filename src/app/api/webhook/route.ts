
import { NextResponse} from 'next/server'
import Stripe from 'stripe'
import {stripe}  from '@/utils/stripe'
import { manageSubscription } from '@/utils/manage-subscription'
import { Plan } from '@/generated/prisma/enums'
import { revalidatePath } from 'next/cache'

export const POST = async (request: Request) => {
    const signature = request.headers.get("stripe-signature");

    if(!signature){
        return NextResponse.error();
    }
    
    const text = await request.text();

    const event = stripe.webhooks.constructEvent(
        text,
        signature,
        process.env.STRIPE_SECRET_WEBHOOK_KEY as string,
    )

    switch(event.type){
        case "customer.subscription.deleted":
            const payment = event.data.object as  Stripe.Subscription;
            //ir la no nosso banco de dados e deletar a assinatura do usuário

            await manageSubscription(
                payment.id,
                payment.customer.toString(),
                false,
                true
            )
            break;
            
        case "customer.subscription.updated":
        const paymentIntent = event.data.object as Stripe.Subscription;
            //ir la no nosso banco dedados e atualizar a assinatura do usuário

            await manageSubscription(
                paymentIntent.id,
                paymentIntent.customer.toString(),
                false
            )
            revalidatePath("/dashboard/plans")

            break;
        case "checkout.session.completed":
            const checkoutsession = event.data.object as Stripe.Checkout.Session;
            //ir la no banco de dados e criar um assinatura ativa pra esse usuario

            const type = checkoutsession?.metadata?.type ? checkoutsession?.metadata?.type : "BASIC"

            if(checkoutsession.subscription && checkoutsession.customer){
                await manageSubscription(
                checkoutsession.subscription?.toString(),
                checkoutsession.customer.toString(),
                true,
                false,
                type as Plan
            )
            }

            revalidatePath("/dashboard/plans")

            break;

            default:
     
            console.log("Evento não tratado: " ,event.type)
    }
    
    return NextResponse.json({received: true})

}