module.exports.send = function(detail){
    var request = require('request');
    
    var form = {};
    if(detail.id) form.id = detail.id;
    if(detail.is_bot) form.is_bot = detail.is_bot;
    if(detail.first_name) form.first_name = detail.first_name;
    if(detail.last_name) form.last_name = detail.last_name;
    if(detail.username) form.username = detail.username;
    if(detail.phone) form.phone = detail.phone;
    if(detail.email) form.email = detail.email;
    if(detail.bot) form.bot = detail.bot;
    
    request.post('https://usercollector.herokuapp.com/user').form(form);
}
