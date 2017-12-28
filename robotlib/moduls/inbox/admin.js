var show = function(message){
    console.log('got to inbox section');
    //get message list
    fn.db.inbox.find({}, function(err, items){
        var titles = [[
            fn.mstr.inbox['inboxDeleteAll'],
            fn.mstr.inbox['settings']
        ]];
        
        if(items.length > 0){
            items.forEach(function(item) {
                var readedSym = fn.mstr.inbox.readSym[0];
                if(item.readed)  readedSym = fn.mstr.inbox.readSym[1];
                var title = 'ـ ' + readedSym + ' ' + item.username + ' | ' + item.date;
                titles.push(title);
            }, this);
        }
        //show list
        fn.userOper.setSection(message.from.id, fn.mstr['inbox'].name, true);        
        global.robot.bot.sendMessage(message.from.id, fn.mstr['inbox'].name, fn.generateKeyboard({custom:true, list: titles, back:fn.str.goToAdmin['back']}, false));
    });
}

var showMessage = function(message){
        //get date from message
        seperateText = message.text.split('|');
        date = seperateText[1];
        date = (date) ? date.trim() : '';

        //find message
        fn.db.inbox.findOne({'date':date}, function(ee, item){
            if(item){
                inboxMess = 'پیام از طرف ' + '@' + item.username +
                '\n' + 'ــــــــــــــــــــ' + '\n' + item.message + '\n \n @' + global.robot.username;
                global.robot.bot.sendMessage(message.from.id, inboxMess);
            }
            else{
                global.robot.bot.sendMessage(message.from.id, 'این پیام دیگر موجود نیست');
            }
        });
}

var deleteAll = function(message){
    fn.db.inbox.remove({}, function(er){ show(message) });
}

var setting = require('./setting');
var user = require('./user');

var routting = function(message, speratedSection){
    //go to inbox
    if(message.text === fn.mstr['inbox'].name || message.text === fn.mstr['inbox'].back)
        show(message);
    
    //delet all message
    else if(message.text === fn.mstr.inbox['inboxDeleteAll']) deleteAll(message);
    
    //setting
    else if(message.text === fn.mstr['inbox'].settings || speratedSection[3] === fn.mstr['inbox'].settings) 
        setting.routting(message, speratedSection);
    
    //choose a message
    else if(speratedSection[2] === fn.mstr['inbox'].name) showMessage(message);
}

module.exports = {routting, show, user}