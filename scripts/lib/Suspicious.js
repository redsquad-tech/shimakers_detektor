import request_api from '../utils/request_api.js';
import { sort_by_alphabet } from '../utils/sort.js';

class Suspicious {
    details_rows = [];
    
    constructor(data, username, date) {
        this.data = data;
        this.username = username;
        this.date = date;
    }

    async _set_api_PR_events () {
        let url = `https://api.github.com/users/${this.username}/events`;
            
        try {
            const response = await request_api(url);
            const data = response.data;

            const PR_events = data.filter((event) => event.type === 'PullRequestEvent' && new Date(event.created_at) > this.date);
            
            return PR_events;
        }
        catch (e) {
            console.log(`Suspicious - _set_api_PR_events from ${url} faild:\n${e.message}\n`);
        }
    };

    async _set_api_stars_and_lang_by_repo (url) {
        try {
            const response = await request_api(url);
            const data = response.data;
    
            return {
                stars: data.stargazers_count,
                lang: data.language
            };
        }
        catch (e) {
            console.log(`Suspicious - _set_api_stars_and_lang_by_repo from ${url} faild:\n${e.message}\n`);
        }
    };

    _order_rows(rows) {
        const filtered_rows = rows
        .filter((elem, index) => {
            let isNotDouble = true;
            
            rows.forEach((e, i) => {
                if (index !== i && elem.PR === e.PR)
                    isNotDouble = elem.merged_at !== null
            });

            return isNotDouble;
        });
         
        sort_by_alphabet(filtered_rows, 'PR');
        
        return filtered_rows;
    }

    async _set_details() {
        const unordered_rows = [];

        const PR_events = await this._set_api_PR_events();

        if (!PR_events) return;

        for (let event of PR_events) {
            const stars_and_lang = await this._set_api_stars_and_lang_by_repo(event.repo.url);

            const row = {
                author: this.username,
                PR: event.payload.pull_request.html_url,
                created_at: event.payload.pull_request.created_at,
                merged_at: event.payload.pull_request.merged_at,
                stars: stars_and_lang?.stars,
                lang: stars_and_lang?.lang,
                type: this.data.type,
                link: this.data.link,
                comment: this.data.comment
            };
    
            unordered_rows.push(row);
        }

        this.details_rows = this._order_rows(unordered_rows);
    }

    async get_details() {
        await this._set_details();

        return this.details_rows;
    }
}

export default Suspicious;