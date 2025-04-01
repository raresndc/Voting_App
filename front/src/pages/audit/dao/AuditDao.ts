export interface AuditRequestDao {
    start: string
    stop: string
    entityName: string
  }

export interface AuditDao {
  id: number 
  date: Date
  acces: string
  event: string
  eventContent: string
  entity: string
  entityIdentifier: string
  username: string
  snIbd: string
  ip: string
} 
