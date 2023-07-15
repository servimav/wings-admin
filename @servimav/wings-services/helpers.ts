import { STATUS } from './const'

/**
 * readableStatus
 * @param status
 * @param male
 * @returns
 */
export function readableStatus(status: STATUS, male = true): string {
  switch (status) {
    case STATUS.ACCEPTED:
      return male ? 'Aceptado' : 'Aceptada'
    case STATUS.COMPLETED:
      return male ? 'Completado' : 'Completada'
    case STATUS.CREATED:
      return male ? 'Creado' : 'Creada'
    case STATUS.ONPROGRESS:
      return 'En Progereso'
    case STATUS.ONWAY:
      return 'En Camino'
    case STATUS.PARTIAL_PAYED:
      return male ? 'Pagado Parcialmente' : 'Pagada Parcialmente'
    case STATUS.PAYED:
      return male ? 'Pagado' : 'Pagada'
    case STATUS.PAYED_BACK:
      return male ? 'Reembolsado' : 'Reembolsada'
    case STATUS.CANCELED_BY_CLIENT:
      return male ? 'Cancelado Cliente' : 'Cancelada Cliente'
    case STATUS.CANCELED_BY_PROVIDER:
      return male ? 'Cancelado Tienda' : 'Cancelada Tienda'
    case STATUS.WAITING_PAYMENT:
      return 'Esperando Pago'
    default:
      return male ? 'Desconocido' : 'Desconocida'
  }
}
