fn = global.fn;
var postQuery       = require('../admin/settings/post/postQuery.js');
var queryCategory       = require('../admin/settings/category/categoryQuery.js');
var sendboxQuery    = require('../admin/sendbox/sendboxQuery.js');

var analyze = function(query){
    var speratedQuery = query.data.split('-');
    
    //if post
    if(speratedQuery[0] === fn.str['queryPost']) postQuery(query, speratedQuery);
    //if category
    else if(speratedQuery[0] === fn.str['queryCategory']) queryCategory(query, speratedQuery);
    //if admin sendbox query
    else if(speratedQuery[0] === fn.str['queryAdminSndMess']) sendboxQuery(query, speratedQuery);

}

module.exports = {
    analyze
}