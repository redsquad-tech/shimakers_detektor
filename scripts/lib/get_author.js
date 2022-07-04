import { get_path } from './get_path.js';
import { get_author_from_pull_commit, get_author_from_pull, get_author_from_commit } from './GH_API_requests.js';

const get_author = async (url) => {    
    try {
        let author;
        let path;
        
        if (url.includes('issues')) { 
            return;
        } 
      
        /* STEP 3.1: handle type of url */
        if (url.includes('pull')) {
            if (url.includes('commits')) {
                /* STEP 3.2: get path by type */
                const url_data = get_path(url, 'pullCommit');
                /* STEP 3.4: make request to get author */
                author = await get_author_from_pull_commit(url_data.commits, url_data.commitSHA);
            }
            else {
                path = get_path(url, 'pulls');
                author = await get_author_from_pull(path);
            }
        }
        else if (url.includes('commit')) {
            path = get_path(url, 'commits');
            author = await get_author_from_commit(path);
        }
        else {
            author = url.split('/')[3];
        }

        console.log('Author:', author);
        
        return author;
    }
    catch (error) {
        console.log('get_author is failed:', error.message);
    }   
};

export default get_author;