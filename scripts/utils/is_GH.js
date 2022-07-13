const is_gh = (link) => {
    const is_GH_link = link && link.includes('github.com');
    
    return is_GH_link;
}

export default is_gh;