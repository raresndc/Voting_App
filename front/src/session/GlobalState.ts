import { action, makeAutoObservable } from "mobx"


class GlobalState {

    username: string
    role: string
    navigate: any
    location: any

    constructor() {
        makeAutoObservable(this)
    }

    setUsername = action((username)=> {
        this.username = username;
    })

    setRole = action((role)=> {
        this.role = role;
    })

    setNavigate = action((navigate)=> {
        this.navigate = navigate;
    })

    setLocation = action((location)=> {
        this.location = location;
    })
}

export default new GlobalState();