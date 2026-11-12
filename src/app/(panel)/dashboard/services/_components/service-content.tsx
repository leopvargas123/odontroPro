import { LabelSubscription } from "@/components/ui/label-subscription";
import { getAllServices } from "../data-acess/get-all-services";
import { ServicesList } from "./services-list";
import { canPermission } from "@/utils/permissions/canPermission";

interface ServicesContentProps {
    userId: string;
}

export async function ServicesContent({ userId }: ServicesContentProps) {

    const services = await getAllServices({userId:userId})
    const permissions = await canPermission({type:'service'})
    return (
     <>
     {!permissions.hasPermission && (
        <LabelSubscription expired={permissions.expired}/>
     )}
     <ServicesList services={services.data || []} permission={permissions}/>
     </>
    )
}