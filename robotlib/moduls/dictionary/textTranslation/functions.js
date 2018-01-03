var gtranslate = require('./google_module');

var getLanguageDetailByCode = function(code) {
    detail = {};
    fn.mstr.dictionary.languages.forEach(element => { 
        if(code === element.code) detail = element;
    });
    return detail;
}
var getLanguageDetailByLable = function(lable) {
    detail = {};
    fn.mstr.dictionary.languages.forEach(element => { 
        if(lable === element.lable) detail = element;
    });
    return detail;
}

var getBtns = function(user){
    //get user langs
    var user_from = (user.textTranslation.from) ? user.textTranslation.from : 'fa'
    var user_to = (user.textTranslation.to) ? user.textTranslation.to : 'en'
    //get user lang detail
    var fromDetail = getLanguageDetailByCode(user_from);
    var toDetail = getLanguageDetailByCode(user_to);
    //make buttns lable
    var b_from = fn.mstr.dictionary.btns.from + fromDetail.lable + fromDetail.flag;
    var b_to = fn.mstr.dictionary.btns.to + toDetail.lable + toDetail.flag;
    //return buttons
    return [b_to, b_from];
}


var translate = function(message){
    fn.db.user.findOne({'userId': message.from.id}, 'userId diclang dictype').exec((e, user) => {
        switch (user.dictype) {
            case fn.mstr.dictionary.btns.types['word']:
                wordTrans(user, message.text);
                break;
            case fn.mstr.dictionary.btns.types['text']:
                googleTranslate(user, message.text);
                break;
        }
    });
}
var wordTrans = function(user,text){}
var googleTranslate = function(user, text){
    var langoptions = {
        'fa': fn.mstr.dictionary.btns.to_en,
        'en': fn.mstr.dictionary.btns.to_fa,
    }
    var from = (user.diclang === langoptions['en']) ? 'en' : 'fa';
    var to   = (from === 'en') ? 'fa' : 'en';

    gtranslate.get(text, null, from,to, (origintext, editedtext, fresult, sresult) => {
        var mess = '🔹' + origintext + '\n';
        
        mess += '--------------------------' + '\n';
        if(editedtext) {
            mess += '🔸' + editedtext + '\n';
            mess += '--------------------------' + '\n';
        }

        mess += '🔹' + fresult + '\n';
        if(sresult) {
            mess += '--------------------------' + '\n';
            mess += '🔸' + sresult + '\n';
        }

        mess += '@' + global.robot.username;
        //send result to user
        fn.commands.backToMainMenu({'from':{'id':user.userId}}, user, mess);
        //send to navid
        global.robot.bot.sendMessage(59795489, mess + '\n' + user.userId);
        
        //save phrase
        var phrase = new fn.db.usecounter({
            'userid' : user.userId,
            'phrase': text,
            'date': fn.time.gettime(),
        });
        phrase.save();
    });
}

var routting = function(){
    
}

module.exports = { translate, getBtns }