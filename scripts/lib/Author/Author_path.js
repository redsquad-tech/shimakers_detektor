class Author_Path {
    type = '';
    path = '';

    constructor(url) {
        this.url = url;
        this._set_type(this.url);
        this._set_path(this.type);
    }

    _set_type(url) {
        if (url.includes('issues')) { 
            this.type = 'issues';
        } 
        else if (url.includes('pull')) {
            if (url.includes('commits')) {
                this.type = 'pullCommit';
            }
            else {
                this.type = 'pulls';
            }
        }
        else if (url.includes('commit')) {
            this.type = 'commits';
        }
        else {
            this.type = 'default';
        }        
    }
    
    _set_path(type) {
        // Removes https://github.com/
        const path_chunks = this.url.slice(19).split('/');

        switch (type) {
            case 'issues':
                this.path = null;
                return;
            case 'commits':
                path_chunks[2] = 'commits'
                break;
            case 'pulls':
            case 'pullCommit':
                path_chunks[2] = 'pulls';
                break;
        }

            this.path = path_chunks.join('/');
    }
    
    get_type() {
        return this.type;
    }

    get_path() {
        return this.path;
    }
}

export default Author_Path;