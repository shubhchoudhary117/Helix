

class TokenService{
    static setToken=(token)=>{
        localStorage.setItem("helix_token",'Bearer '+token)
    }

    static getToken=()=>{
        let token=localStorage.getItem("helix_token");
        return token;
    }

    static removeToken=()=>{
        localStorage.removeItem("helix_token")
    }
}


export default TokenService;