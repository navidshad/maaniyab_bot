var description = function(query, speratedQuery){
    console.log('get new description of post');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.str.adminItems['settings']['name'] + '/' + fn.str.settingsItems['categories']['name'] + '/' + fn.str.maincategory + '/' + fn.str.editCategory['description'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.str.editCategory['description'], fn.generateKeyboard({section:fn.str.settingsItems['categories']['back']}, true));
}

var order = function(query, speratedQuery){
    console.log('get new order');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.str.adminItems['settings']['name'] + '/' + fn.str.settingsItems['categories']['name'] + '/' + fn.str.maincategory + '/' + fn.str.editCategory['order'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.str.editCategory['order'], fn.generateKeyboard({section:fn.str.settingsItems['categories']['back']}, true));
}

var parent = function (query, speratedQuery){
    console.log('get new parent of post');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.str.adminItems['settings']['name'] + '/' + fn.str.settingsItems['categories']['name'] + '/' + fn.str.maincategory + '/' + fn.str.editCategory['parent'] + '/' + speratedQuery[speratedQuery.length-1], false);
    var back = fn.str.settingsItems['categories']['back'];
    var list = [];
    global.robot.categories.forEach(function(element) { list.push(element.parent + ' - ' + element.name); }, this);
    global.robot.bot.sendMessage(query.from.id, fn.str.editCategory['parent'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

module.exports = function(query, speratedQuery){
    
        //remove query message
        global.robot.bot.deleteMessage(query.message.chat.id, query.message.message_id);

        //edit name
        if(speratedQuery[1] === global.fn.str['queryPostName']){
            console.log('get new title of post');
            fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.str.adminItems['settings']['name'] + '/' + fn.str.settingsItems['categories']['name'] + '/' + fn.str.maincategory + '/'  + fn.str.editCategory['name'] + '/' + speratedQuery[speratedQuery.length-1], false);
            global.robot.bot.sendMessage(query.from.id, fn.str.editCategory['name'], fn.generateKeyboard({section:fn.str.settingsItems['categories']['back']}, true));
        }

        //edit description
        else if(speratedQuery[1] === global.fn.str['queryCategoryDescription']) description(query, speratedQuery);
        //edit parent
        else if(speratedQuery[1] === global.fn.str['queryCategoryParent']) parent(query, speratedQuery);
        //edit order
        else if(speratedQuery[1] === global.fn.str['queryOrder']) order(query, speratedQuery);

        //delete message
        else if(speratedQuery[1] === global.fn.str['queryDelete']){
            fn.db.category.remove({'_id': speratedQuery[speratedQuery.length-1]}, function(err){
                global.robot.bot.sendMessage(query.from.id, fn.str['seccess']);
                global.fn.category.get();
            });
        }
    
}