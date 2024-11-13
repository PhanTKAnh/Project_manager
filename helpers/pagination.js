module.exports = (objectPagination,query, countProducts ) =>{
    if(query.page){
        objectPagination.currentPage=parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) *objectPagination.litmitItems;
    
    const totalPage = Math.ceil(countProducts/objectPagination.litmitItems);
    objectPagination.totalPage = totalPage;
    return objectPagination;
}