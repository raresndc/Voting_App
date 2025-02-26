export interface UserDao {
    username: string
    lastTimeLogged: any
    failedLoginCount: number
    phoneNumberString: any
    notificationSms: boolean
    sic: any
    password: any
    enabled: boolean
    accountNonLocked: boolean
    accountNonExpired: boolean
    credentialsNonExpired: boolean
    roles: Role[]
    authorities: Authority[]
  }
  
  export interface Role {
    name: string
    permissions: any[]
  }
  
  export interface Authority {
    authority: string
  }
  
  export interface CreateUserDao {
    username?: string
    newPassword?: string
    oldPassword?: string
    role?: string
    phoneNumberString?: string
    notificationSms: boolean
  }

  export interface RoleDao {
    name: string
    permissions: any[]
  }
  