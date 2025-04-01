import { StringLiteral } from "typescript"

export interface UserDao {
    username: string
    lastTimeLogged: any
    failedLoginCount: number
    phoneNumberString: any
    name:String
    prenume: String
    gender: String
    age: String
    birthday: String
    cetatenie:String
    cnp: any
    email: any
    adresa: String
    grupaSanguina: String
    height: any
    judet: String
    localitate: String
    tara: String
    weight: any
    boliCronice: boolean
    notificationSms: boolean
    passChanged: boolean
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
    name?:String
    prenume?: String
    gender?: String
    age?: String
    birthday?: String
    cetatenie?:String
    cnp?: any
    email?: any
    adresa?: any
    grupaSanguina?: String
    height?: any
    judet?: any
    localitate?: any
    tara?: any
    weight?: any
    boliCronice?: boolean
    notificationSms: boolean
  }

  export interface CreateMailDao {
    to?: string
    subject?: string
    body?: string
  }

  export interface RoleDao {
    name: string
    permissions: any[]
  }
  