//additional
var showCategoryDir = function(userid,catname, speratedSection){
    fn.getMenuItems(catname, (items, des, noitem) => {
        //parent
        var parent = speratedSection[speratedSection.length-2];
        var back = (parent === fn.str['mainMenu']) ? fn.str['backToMenu'] : fn.str['backtoParent'] + ' از "' + catname + '" به ' + ' - ' + parent;
        if(!noitem){
            fn.userOper.setSection(userid, catname, true);
            global.robot.bot.sendMessage(userid, des, 
            fn.generateKeyboard({'custom': true, 'grid':true, 'list': items, 'back':back}, false));        
        }
        else global.robot.bot.sendMessage(userid, 'این بخش هنوز خالی است.');
    });
}


//routting
module.exports = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;

    //back to a category
    if(text.includes(fn.str['back']) && text.split(' - ')[1]){
        console.log('back to category', text);
        var catname = text.split(' - ')[1];
        speratedSection.splice(last, 1);
        fn.userOper.setSection(message.from.id, catname, true);
        showCategoryDir(message.from.id, catname, speratedSection);
    }

    //go to category
    else if(fn.category.checkInValidCat(text)){
        console.log('go to category', text);
        speratedSection.push(text);
        showCategoryDir(message.from.id, text, speratedSection);
    }

    //contct with admin
    else if (text === fn.str.moduleButtons['contact'].name || speratedSection[1] === fn.str.moduleButtons['contact'].name){
        console.log('contact with admin');
        fn.sendMessToAdmin(message, speratedSection);
    }

    //go to a post  
    else{
        console.log('this is a post');
        fn.db.post.findOne({'name': text}).exec((e, post) =>{
            if(post){
                var description = post.description + '\n @' +  global.robot.username;
                switch (post.type) {
                    case fn.str.postTypes['text'].name:
                        global.robot.bot.sendMessage(message.from.id, description);
                        break;
                    case fn.str.postTypes['file'].name:
                        global.robot.bot.sendDocument(message.chat.id, post.fileid, {caption : description});                
                        break;
            
                    case fn.str.postTypes['photo'].name:
                        global.robot.bot.sendPhoto(message.chat.id,post.photoid, {caption : description});
                        break;
            
                    case fn.str.postTypes['sound'].name:
                        global.robot.bot.sendAudio(message.chat.id,post.audioid, {caption : description});        
                        break;
            
                    case fn.str.postTypes['video'].name:
                        global.robot.bot.sendVideo(message.chat.id,post.videoid, {caption : description});                
                        break;
                        
                    case fn.str.postTypes['ticket'].name:
                        break;
                }
            }
            else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
        });
    }
}