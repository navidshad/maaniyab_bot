module.exports = function(message, speratedSection){
    //go to inbox
    if(message.text === fn.str.adminItems['inbox'].name){
        console.log('got to inbox section');

        //get message list
        fn.db.inbox.find({}, function(err, items){
            if(items.length > 0){
                var titles = [];
                items.forEach(function(item) {
                    var readedSym = fn.str.adminItems.inbox.readSym[0];
                    if(item.readed)  readedSym = fn.str.adminItems.inbox.readSym[1];
                    var title = 'ـ ' + readedSym + ' ' + item.username + ' | ' + item.date;
                    titles.push(title);
                }, this);
                
                titles.push(fn.str.adminItems.inbox['inboxDeleteAll']);
                //show list
                fn.userOper.setSection(message.from.id, fn.str.adminItems['inbox'].name, true);        
                global.robot.bot.sendMessage(message.from.id, fn.str.adminItems['inbox'].name, fn.generateKeyboard({custom:true, list: titles, back:fn.str.goToAdmin['back']}, false));
            }
            else{
                global.robot.bot.sendMessage(message.from.id, 'هیچ پیامی در صندوق وجود ندارد.');
            }
        });
    }

    //delet all message
    else if(message.text === fn.str.adminItems.inbox['inboxDeleteAll']){
        fn.db.inbox.remove({}, function(er){
            global.robot.bot.sendMessage(message.from.id, fn.str['seccess'], fn.generateKeyboard({section:fn.str.goToAdmin['name']}, false));
        });
    }

    //choose a message
    else if(speratedSection[2] === fn.str.adminItems['inbox'].name){
        
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
}