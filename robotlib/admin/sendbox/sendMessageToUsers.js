var AdminMessageCreator = function (userId,mess, calbck) {
   //create callback keyboard
   var detailArr = [];
   var fn_editTitle = fn.str['queryAdminSndMess'] + '-' + fn.str['queryAdminSndMessEditTitle'] + '-' + mess._id;
   var fn_editText  = fn.str['queryAdminSndMess'] + '-' + fn.str['queryAdminSndMessEditMessage'] + '-' + mess._id;
   var fn_delete = fn.str['queryAdminSndMess'] + '-' + fn.str['queryAdminSndMessDel'] + '-' + mess._id;
   var fn_publication = fn.str['queryAdminSndMess'] + '-' + fn.str['queryAdminSndMessSend'] + '-' + mess._id;

   //edit btns //publication btn
   detailArr.push([ {'text': 'حذف', 'callback_data': fn_delete},
   {'text': 'بستن', 'callback_data': fn.str['queryAdminSndMess']},
   {'text': 'ارسال', 'callback_data': fn_publication},
   {'text': '📝 متن', 'callback_data': fn_editText}]);

   //create message
   var text = mess.title + '\n' +
   'ــــــــــــــــ' + '\n' +
   mess.text + '\n' + '\n' +
   'لطفا برای تنظیمات و ارسال نهایی از گزینه های زیر استفاده کنید.';

   //fn.userOper.setSection(userId, fn.str.goToAdmin[0], true);
   //global.robot.bot.sendMessage(userId, fn.str['seccess'], global.fn.generateKeyboard({section:fn.str.goToAdmin[0]}, false));    
   global.robot.bot.sendMessage(userId, text, {"reply_markup" : {"inline_keyboard" : detailArr}});   

   if(calbck)
        calbck();
}

var editMessage = function(id, detail, message, ecCallBack){
    //console.log('edit a course', id);
    fn.db.sendbox.findOne({"_id": id}, function(err, mess){
        if(mess){
            if(detail.text) mess.text = detail.text;
            if(detail.titel) mess.title = detail.title;
            showSendBoxsection(message, fn.str['seccess']);
            if(ecCallBack) AdminMessageCreator(message.from.id, mess, ecCallBack);
            else AdminMessageCreator(message.from.id, mess);
            mess.save();
        }
        else showSendBoxsection(message,'این پیام دیگر وجود ندارد');
    });
}

var showSendBoxsection = function(message, txt){
    var titles = [];
    
    fn.db.sendbox.find({}, function(err, items){
        //make title list
        if(items.length > 0){
            items.forEach(function(element) {
                titles.push(global.fn.str.adminItems.sendMessage['sendboxSymbol'] + element.title);
            }, this);
        }

        fn.userOper.setSection(message.from.id, fn.str.adminItems['sendMessage'].name, true);  
        global.robot.bot.sendMessage(message.from.id, (txt) ? txt : fn.str.adminItems['sendMessage'].name, global.fn.generateKeyboard({'section':fn.str.adminItems['sendMessage'].name, 'list': titles}, false));
    });
}

var analyze = function(message, speratedSection, fullname){

    //ask to sendBox section
    if (message.text === fn.str.adminItems['sendMessage'].name){
        console.log('go to sendbox section');
        showSendBoxsection(message);
    }

    //ask to new message
    else if (message.text === fn.str.adminItems.sendMessage['sendMessToUsersNewMess']){
        console.log('getting message');
        fn.userOper.setSection(message.from.id, fn.str.adminItems.sendMessage['sendMessToUsersNewMess'], true);        
        global.robot.bot.sendMessage(message.from.id, fn.str.adminItems.sendMessage['sendMessToUsersTitle'], fn.generateKeyboard({'section':fn.str.goToAdmin['back']}, true));
    }
    //get the title of new message
    else if(speratedSection[3] === fn.str.adminItems.sendMessage['sendMessToUsersNewMess']){
        console.log('send admins message to users');

        //check title to not to added already
        fn.db.sendbox.findOne({'title': message.text}, function(err, item){
            if(item){
                global.robot.bot.sendMessage(message.from.id, 'این عنوان قبلا ثبت شده است، لطفا عنوان دیگری انتخواب کنید.')
            }
            else{
                var newSendMess = new fn.db.sendbox({
                    //'date'     : fn.time.gettime(),
                    'title'     : message.text,
                });
        
                newSendMess.save(() => {
                    AdminMessageCreator(message.from.id, newSendMess);
                    global.robot.bot.sendMessage(message.from.id, fn.str['seccess']);
                    showSendBoxsection(message);
                });
            }
        });
    }

    //delete all message
    else if (message.text === fn.str.adminItems.sendMessage['sendMessToUsersDeleteAll']){
        fn.db.sendbox.remove({}, function(err){
            global.robot.bot.sendMessage(message.from.id, fn.str['seccess'], global.fn.generateKeyboard({section:fn.str.goToAdmin['name']}, false))
            showSendBoxsection(message);        
        });
    }

    //edit message - callback query
    else if(speratedSection[3] === fn.str.adminItems.sendMessage['sendMessToUsersEditMess']){
        console.log('edit message');
        editMessage(speratedSection[speratedSection.length-1], {text: message.text}, message);
    }

    //choose an old message
    else if(message.text.includes(fn.str.adminItems.sendMessage['sendboxSymbol'])){
        console.log('this is a message');
        sendboxMessTitle = message.text.replace(fn.str.adminItems.sendMessage['sendboxSymbol'], '').trim();

        //find message
        fn.db.sendbox.findOne({'title': sendboxMessTitle}, function(errr, mess){
            if(mess){
                AdminMessageCreator(message.from.id, mess);
            }
        })
    }
}

module.exports = {analyze, editMessage, AdminMessageCreator}