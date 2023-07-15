import { STATUS } from './const'

/**
 * redeableStatus
 * @param status
 * @param male
 * @returns
 */
export function redeableStatus(status: STATUS, male = true): string {
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
    case STATUS.UNKNOWN:
      return male ? 'Desconocido' : 'Desconocida'
    case STATUS.WAITING_PAYMENT:
      return 'Esperando Pago'
    default:
      return male ? 'Cancelado' : 'Cancelada'
  }
}
