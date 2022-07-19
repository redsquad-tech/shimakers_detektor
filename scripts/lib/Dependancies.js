import request_api from '../utils/request_api.js';

class Dependancies {
    details_row = {};
    
    constructor(username) {
        this.username = username;
    }

    _set_api_organisations = async (username) => {
        try {
            let url =`https://api.github.com/users/${username}/orgs`;
    
            const response = await request_api(url);
            const data = response.data;
    
            const orgs = data.map((org) => org.login)
    
            return orgs;
        }
        
        catch (e) {console.log(`Dependancies - _set_api_organisations is failed:\n${e.message}\n`)};
    }

    _set_api_followers = async (username) => {
        try {
            let url =`https://api.github.com/users/${username}/followers`;
    
            const response = await request_api(url);
            const data = response.data;
    
            const friends = data.map((friend) => friend.login)
    
            return friends;
        }
        
        catch (e) {console.log(`Dependancies - _set_api_followers is failed:\n${e.message}\n`)};
    }

    async _set_full_details() {
        const orgs = await this._set_api_organisations(this.username);
        const followers =  await this._set_api_followers(this.username);

        this.details_row = orgs?.length > 0 && {
            author: this.username,
            organizations: orgs,
            friends: followers,
        };
    }

    async get_details() {
        await this._set_full_details();

        return this.details_row;
    }
   
    async get_friends() {
        const friends = await this._set_api_followers(this.username);

        return friends;
    }
    
    async get_orgs() {
        const orgs = await this._set_api_organisations(this.username);

        return orgs;
    }
}

export default Dependancies;