var show = function(message){
    console.log('got to inbox section');
    //get message list
    fn.db.inbox.find({}).sort('-_id').exec(function(err, items){
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
                var detailArr = [];
                var fn_answer = fn.mstr.inbox.query['inbox'] + '-' + fn.mstr.inbox.query['answer'] + '-' + item._id;
                detailArr.push([ {'text': 'ارسال پاسخ', 'callback_data': fn_answer} ]);

                inboxMess = 'پیام از طرف ' + '@' + item.username +
                '\n' + 'ــــــــــــــــــــ' + '\n' + item.message + '\n \n @' + global.robot.username;
                global.robot.bot.sendMessage(message.from.id, inboxMess, {"reply_markup" : {"inline_keyboard" : detailArr}});
            }
            else{
                global.robot.bot.sendMessage(message.from.id, 'این پیام دیگر موجود نیست');
            }
        });
}

var answertoMessage = function(message, messid){
    fn.db.inbox.findOne({'date':date}, function(ee, item){
        if(item){
            answer = 'پیام شما:' + '\n';
            answer += item.message + '\n \n';
            answer += 'جواب پیام شما:' + '\n';
            answer += message.text + '\n';
            answer += '\n @' + global.robot.username;
            global.robot.bot.sendMessage(message.from.id, answer);
            global.robot.bot.sendMessage(item.userId, answer).catch((error) => {
                console.log(error.code);  // => 'ETELEGRAM'
                console.log(error.response.body); // => { ok: false, error_code: 400, description: 'Bad Request: chat not found' }
                if(error.response.statusCode === 403) global.robot.bot.sendMessage(message.from.id, 'این کاربر ربات را block کرده است.'); 
            });
            show(message);
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
    else if(speratedSection[speratedSection.length-1] === fn.mstr['inbox'].name) showMessage(message);

    //get answer
    else if(speratedSection[speratedSection.length-2] === fn.mstr['inbox'].mess['answer']) answertoMessage(message, speratedSection[speratedSection.length-1]);
}

var query = function(query, speratedQuery){
    //answer
    if(speratedQuery[1] === fn.mstr.inbox.query['answer']) {
        fn.userOper.setSection(query.from.id, fn.str['mainMenu'] + '/' + fn.str.goToAdmin['name'] + '/' + fn.mstr['inbox'].name + '/' + fn.mstr.inbox.mess['answer'] + '/' + speratedQuery[speratedQuery.length-1], false);
        global.robot.bot.sendMessage(query.from.id, fn.mstr.inbox.mess['answer'], fn.generateKeyboard({section:fn.mstr['inbox'].back}, true));
    }
}

module.exports = {routting, query, show, user}