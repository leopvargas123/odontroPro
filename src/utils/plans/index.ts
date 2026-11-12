export type PlanDetailsProps = {
    maxServices: number
}

export type PlanProps = {
    BASIC: PlanDetailsProps,
    PROFESSIONAL: PlanDetailsProps
}


export const PLANS: PlanProps = {
    BASIC: {
        maxServices:3
    },
    PROFESSIONAL:{
        maxServices:50
    }
}

export const subscriptionPlans = [
{
    id: 'BASIC',
    name: 'Basic',
    description: 'Perfeito para clínicas menores',
    oldPrice: "R$ 97,90",
    price: "R$ 27,90",
    features: [
        `Até ${PLANS["BASIC"].maxServices} serviços`,
        'Agendamentos ilimitados',
        'Suporte',
        'Acesso a relatórios básicos'
    ]
},
{
    id: 'PROFESSIONAL',
    name: 'Professional',
    description: 'Ideal para clínicas maiores',
    oldPrice: "R$ 197,90",
    price: "R$ 97,90",
    features: [
        `Até ${PLANS["PROFESSIONAL"].maxServices} serviços`,
        'Agendamentos ilimitados',
        'Suporte prioritário',
        'Acesso a relatórios avançados'
    ]
}
]
