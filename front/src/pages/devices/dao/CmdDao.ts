import { DeviceTypeDao } from "pages/devices-type/dao/DeviceTypeDao"
import { DeviceDao } from "./DeviceDao"
import { UserDao } from "session/dao/Dao"
import { Timestamp } from "rxjs"

export interface SendSmsDao {
    id: number
    importDate: Date
    receiverDevice: DeviceDao
    senderUser: UserDao
    command: CmdDao
}

export interface ReceivedSmsDao {
    id: number
    statusMsg: string
    content: string
    importDate: string
    msgDate: string
    elDevice: DeviceDao
}

export interface CmdDao {
    id: number
    cmdName: string
    cmdSyntax: string
    elDevice: DeviceTypeDao
    elSmsSend: SendSmsDao[]
  }

  export interface TemperatureIntervalDao {
    tMin: number
    tMax: number
    warmingCoolingMode: boolean
  }

  export interface SendCommandDao {
    elDevice: DeviceDao
    elCmd: CmdDao
    temperatureInterval: TemperatureIntervalDao
  }