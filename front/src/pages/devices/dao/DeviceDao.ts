import { DeviceTypeDao } from "pages/devices-type/dao/DeviceTypeDao"
import { RouterDao } from "pages/routers/dao/RouterDao"
import { UserDao } from "session/dao/Dao"

  export interface DeviceDao {
    id: number
    deviceMsisdn: string
    devicePhone: string
    deviceDetails: string
    deviceLocation: string
    deviceName: string
    masterActivated: boolean
    userActivated: boolean
    elRouter: RouterDao
    elDeviceType: DeviceTypeDao
    masterRouter: RouterDao
    users: UserDao[]
  }

  export interface DevicePasswordDao {
    device: DeviceDao
    password: string
    oldPassword: string
  }
  
