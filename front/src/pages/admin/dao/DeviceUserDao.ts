import { DeviceDao } from "pages/devices/dao/DeviceDao"

  export interface AddDeviceUserDao {
    username: String
    elDevice: DeviceDao
  }

  export interface DeleteDeviceUserDao {
    device: DeviceDao
    username: String
  }
  
