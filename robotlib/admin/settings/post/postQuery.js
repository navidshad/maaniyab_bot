var uploadSection = function(query,speratedQuery){
    console.log('get attachment');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.settingsItems['post']['name'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.str.editPost['upload'], fn.generateKeyboard({section:fn.str.settingsItems['post']['name']}, true));
}
var description = function(query, speratedQuery){
    console.log('get new title of post');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.str.adminItems['settings']['name'] + '/' + fn.str.settingsItems['post']['name'] + '/' + fn.str.editPost['description'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.str.editPost['description'], fn.generateKeyboard({section:fn.str.settingsItems['post']['name']}, true));
}

var order = function(query, speratedQuery){
    console.log('get new order');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.str.adminItems['settings']['name'] + '/' + fn.str.settingsItems['post']['name'] + '/' + fn.str.editPost['order'] + '/' + speratedQuery[speratedQuery.length-1], false);
    global.robot.bot.sendMessage(query.from.id, fn.str.editPost['order'], fn.generateKeyboard({section:fn.str.settingsItems['post']['back']}, true));
}

var category = function (query, speratedQuery){
    console.log('get new title of post');
    fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.str.adminItems['settings']['name'] + '/' + fn.str.settingsItems['post']['name'] + '/' + fn.str.editPost['category'] + '/' + speratedQuery[speratedQuery.length-1], false);
    var back = fn.str.settingsItems['post']['name'];
    var list = [];
    global.robot.categories.forEach(function(element) { list.push(element.parent + ' - ' + element.name); }, this);
    global.robot.bot.sendMessage(query.from.id, fn.str.editPost['category'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

module.exports = function(query, speratedQuery){
    
        //remove query message
        global.robot.bot.deleteMessage(query.message.chat.id, query.message.message_id);
    
        //choose a type
        if(speratedQuery[1].includes('format')){
            var type = speratedQuery[1].replace('format', '').trim();
            console.log('format query', type);
            fn.post.editpost(speratedQuery[speratedQuery.length-1], {'type': type, 'publish': fn.str['NotPublished']}, query.from.id);
        }

        //edit name
        if(speratedQuery[1] === global.fn.str['queryPostName']){
            console.log('get new title of post');
            fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.str.adminItems['settings']['name'] + '/' + fn.str.settingsItems['post']['name'] + '/' + fn.str.editPost['name'] + '/' + speratedQuery[speratedQuery.length-1], false);
            global.robot.bot.sendMessage(query.from.id, fn.str.editPost['name'], fn.generateKeyboard({section:fn.str.settingsItems['post']['name']}, true));
        }

        //edit description
        else if(speratedQuery[1] === global.fn.str['queryPostDescription']) description(query, speratedQuery);
        //edit category
        else if(speratedQuery[1] === global.fn.str['queryPostCategory']) category(query, speratedQuery);
        //upload
        else if(speratedQuery[1] === global.fn.str['queryUpload']) uploadSection(query,speratedQuery)
        //edit order
        else if(speratedQuery[1] === global.fn.str['queryOrder']) order(query, speratedQuery);
        
//publication
        if(speratedQuery[1] === fn.str['queryPublication']){
            console.log('get resource price');
            fn.db.post.findOne({'_id': speratedQuery[speratedQuery.length-1]}, function(err, itm){
                if(itm){
                    var allow = true;
                    if(!itm.description){
                        allow = false;
                        global.robot.bot.sendMessage(query.from.id, 'لطفا قسمت توضیحاترا کامل کنید.');
                        description(query, speratedQuery);
                    }
                    else{
                        switch (itm.type) {
                            case 'file':
                                if(!itm.fileid){
                                    allow = false;
                                    global.robot.bot.sendMessage(query.from.id, 'ابتدا یک فایل پیوست کنید.');
                                }
                                break;
                    
                            case 'photo':
                                if(!itm.photoid){
                                    allow = false;
                                    global.robot.bot.sendMessage(query.from.id, 'ابتدا یک تصویر پیوست کنید.');
                                }
                                break;
                    
                            case 'audio':
                                if(!itm.audioid){
                                    allow = false;
                                    global.robot.bot.sendMessage(query.from.id, 'ابتدا یک فایل صوتی پیوست کنید.');
                                }
                                break;
                    
                            case 'video':
                                if(!itm.videoid){                            
                                    allow = false;
                                    global.robot.bot.sendMessage(query.from.id, 'ابتدا یک فایل ویدیو پیوست کنید.');
                                }
                                break;
                        }

                        if(!allow) uploadSection(query, speratedQuery);                                        
                        else {
                            //fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.str.adminItems['settings']['name'] + '/' + fn.str.settingsItems['post']['name'] + '/' + fn.str.editPost['publication'] + '/' + speratedQuery[speratedQuery.length-1], false);
                            fn.post.editpost(speratedQuery[speratedQuery.length-1], {'publish': 'switch'}, query.from.id);
                        }
                    }
                }
                else{ console.log('item wasnt found')}
            });
        }
    
        //delete message
        else if(speratedQuery[1] === global.fn.str['queryDelete']){
            fn.db.post.remove({'_id': speratedQuery[speratedQuery.length-1]}, function(err){
                global.robot.bot.sendMessage(query.from.id, fn.str['seccess'])
            });
        }
    
}