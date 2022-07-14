import request_api from '../../utils/request_api.js';
import Author_Path from './Author_path.js';

class Author {
    author = '';

    constructor(url) {
        this.url = url;
    }

    _set_api_author_from_commits = async (req_path) => {
        const url =`https://api.github.com/repos/${req_path}`;

        try {
            const response = await request_api(url);
            const data = response.data;
            let author = data?.author?.login ? data?.author?.login : data?.commit?.author?.name;
    
            return author;
        }
        
        catch (e) {console.log(`Author - _set_api_author_from_commits from ${url} is failed:\n${e.message}\n`)};
    };
    
    _set_api_author_from_pulls = async (req_path) => {
        const url =`https://api.github.com/repos/${req_path}`;

        try {    
            const response = await request_api(url);
            const data = response.data;
            
            return data.user.login;
        }
        
        catch (e) {console.log(`Author - _set_api_author_from_pulls from ${url} is failed:\n${e.message}\n`)};
    };
    
    _set_api_author_from_pullCommit = async (req_path) => {
        try {
            const req_path_chunks = req_path.split('/');
            const commit_SHA = req_path_chunks.pop();

            const url =`https://api.github.com/repos/${req_path_chunks.join('/')}`;

            const response = await request_api(url);
            const data = response.data;
    
            const commit = data.filter((commit) => commit.sha === commit_SHA)[0];
    
            return commit.author.login;
        }
        
        catch (e) {console.log(`Author - _set_api_author_from_pullCommit from https://api.github.com/repos/${req_path} is failed:\n${e.message}\n`)};
    };

    async _set_author(url) {
        const author_req = new Author_Path(url);
        const author_req_type = author_req.get_type();
        const author_req_path = author_req.get_path();

        switch (author_req_type) {
            case 'issues':
                this.author = null;
                break;
            case 'default':
                this.author = url.split('/')[3];
                break;
            default:
                this.author = await this[`_set_api_author_from_${author_req_type}`](author_req_path);
                break;
        }
    }

    async get_author() {
        await this._set_author(this.url);
        
        console.log('Author is:', this.author);

        return this.author;
    }
}

export default Author;