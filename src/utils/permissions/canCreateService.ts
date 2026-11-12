'use server'

import { Subscription } from "@/generated/prisma/client";
import prisma from '@/lib/prisma';
import { Session } from 'next-auth'
import { getPlan } from "./get-plans";
import { PLANS } from "../plans";
import { checkSubscriptionExpired } from "./checkSubscriptionExpired";
import { ResultPermissionProps } from "./canPermission";

 export async function canCreateService(subscription:Subscription | null, session:Session):Promise<ResultPermissionProps>{
    try{
        const serviceCount = await prisma.service.count({
            where:{
                userId:session?.user?.id
            }
        })

        if(subscription && subscription.status === 'active'){
            const plan = subscription.plan
            const planlimits = await getPlan(plan)

             return{
            hasPermission:planlimits.maxServices === null || serviceCount <= planlimits.maxServices,
            planId: subscription.plan,
            expired:false,
            plan: PLANS[subscription.plan]
         }
        }

        const checkUserimit = await checkSubscriptionExpired(session)

        return checkUserimit

    }catch(err){
         return{
            hasPermission:false,
            planId:"EXPIRED",
            expired:true,
            plan:null,
        }
    }
 }