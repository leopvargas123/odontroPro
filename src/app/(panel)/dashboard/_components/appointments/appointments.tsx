import { getTimesClinic } from "../../data-access/get-times-clinic"
import { AppointmenstList } from "./appointments-list"

export async function Appointments({ userId }: { userId: string }) {

  const { times } = await getTimesClinic({ userId: userId })


  return (
    <AppointmenstList times={times} />
  )
}