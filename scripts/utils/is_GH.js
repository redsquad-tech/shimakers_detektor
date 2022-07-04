const is_GH = (link) => {
    const is_GH_link = link && link.includes('github.com');
    
    return is_GH_link;
}

export default is_GH;