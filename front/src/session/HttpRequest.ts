import GlobalState from "./GlobalState.ts";
import { deleteCookies, readSessionFromCookies } from "./Session.ts";

export async function post(body: any, url: any) : Promise<any> {

    try {
        const config = {
            method: 'POST',
            credentials: 'include' ,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: body
        }

        let response = null;
        try {
            response = await fetch(url, config);
        } catch (err) {
            throw await ("Eroare server. Contactati administratorul!")
        }
    
        return await handleResponse(response)
 
    } catch (err) {
        console.log(err)
        throw await err
    }
}

export async function get(url: any) : Promise<any> {

    try {
        const config = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }
    
        let response = null;
        try {
            response = await fetch(url, config);
        } catch (err) {
            throw await ("Eroare server. Contactati administratorul!")
        }
    
        return await handleResponse(response)
 
    } catch (err) {
        console.log(err)
        throw await err
    }
}

export async function handleResponse(response: any) {

    readSessionFromCookies();

    if(response.ok) {
        return response.json().then((data) => {
            return data
        }). catch(() => {})

    } else {

        if(response.status === 404) 
            throw await ("Eroare server...")

        if(response.status === 401) 
            throw await ("Username sau parola gresita!")       
            
        if(response.status === 423) 
            throw await ("Cont blocat! Contactati administratorul!")       
        
        if(response.status === 403) {
            if(GlobalState.navigate !== null) {
                deleteCookies();
                GlobalState.navigate("/sign-in")
            }
        }

        if(response.status === 500) {
            let msg = (await response.json()).message;
            throw await msg
        }

        throw await ("Eroare necunoscuta. Contactati administratorul!");
    }
}