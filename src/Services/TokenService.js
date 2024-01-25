
/* this class contains token releted functionality like add token in localstorage and remove token from 
localStorage */
class TokenService{
    // set token in localstorage
    static setToken=(token)=>{
        localStorage.setItem("helix_token",'Bearer '+token)
    }
    // get token from localstorage
    static getToken=()=>{
        let token=localStorage.getItem("helix_token");
        return token;
    }
    // remove user token from localstorage
    static removeToken=()=>{
        localStorage.removeItem("helix_token")
    }
}


export default TokenService;