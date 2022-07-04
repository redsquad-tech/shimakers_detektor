const get_commits_path = (path) => {
    path[2] = 'commits'
    
    return path.join('/');
}

const get_pulls_path = (path) => {
    path[2] = 'pulls';
    
    return path.join('/');
}

const get_pull_commit_path = (path) => {
    path[2] = 'pulls';

    const urlData = {
        commits: path.slice(0, 5).join('/'), 
        commitSHA: path.slice(-1).join('/')
    }
    
    return urlData;
}

export const get_path = (url, url_type) => {
    const path = url.slice(19).split('/');

    switch (url_type) {
        case 'commits':
            return get_commits_path(path);
        case 'pulls':
            return get_pulls_path(path);
        case 'pullCommit':
            return get_pull_commit_path(path);
    }
}