module.exports = function(message, speratedSection){

    //ask to send massage to admin
    if (message.text === fn.str.moduleButtons['contact'].name){
        console.log('getting message');
        fn.userOper.setSection(message.from.id, fn.str.moduleButtons['contact'].name, true);        
        global.robot.bot.sendMessage(message.from.id, fn.str['contactWadminMess'], fn.generateKeyboard({section:fn.str['backToMenu']}, true));
    }
    else if(speratedSection[1] === fn.str.moduleButtons['contact'].name){
        console.log('send user message to admin');
        var userMessage = 'شما از طرف ' + message.from.username + ' یک پیام دریافت کرده اید.' + '\n' +
        'ــــــــــــــــــــ' + '\n' +  message.text;

        fn.db.user.findOne({'userId': message.from.id}, function(err, user){
            if(user){
                //time
                var time = fn.time.gettime();

                //save to inbox
                var newInboxMess = new global.fn.db.inbox({
                    'readed'      : false,
                    'messId'      : message.message_id,
                    'date'        : time,
                    'userId'      : user.userId,
                    'username'    : user.username,
                    'message'     : message.text
                });
                newInboxMess.save();
                fn.userOper.setSection(message.from.id, fn.str['mainMenu'], true);        
                global.robot.bot.sendMessage(message.from.id, fn.str['seccess']);
                fn.commands.backToMainMenu(message, user.isAdmin, user.isCompelet);
            }
        });
    }
}