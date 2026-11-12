"use server"

import { Plan } from "@/generated/prisma/enums" 
import { PlanProps } from '@/utils/plans/index'

export interface PlanDetailInfo{
    maxServices:number;
}

const PLANS_LIMITS: PlanProps = {
    BASIC: {
        maxServices:3,
    },
    PROFESSIONAL:{
        maxServices:50
    }
}

export async function getPlan(planId: Plan){
    return PLANS_LIMITS[planId]
}