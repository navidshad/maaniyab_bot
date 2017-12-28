var checkText_DicOption = function(text){
    var valid = false;
    var option = null;
    var options = [
        fn.mstr.dictionary['to_fa'],
        fn.mstr.dictionary['to_en'], 
        fn.mstr.dictionary['trans_word'], 
        fn.mstr.dictionary['trans_text']
    ]
    
    options.forEach((element, i) => {
        if(text.includes(element)) { valid = true; option = element}
    });

    return {'valid': valid, 'option': option};
}
var changeUseroption = function(message, option){
    switch (option) {
        case fn.mstr.dictionary['to_fa']:
            fn.userOper.editUser(message.from.id,{'diclang': option}, (user) => { fn.commands.backToMainMenu(message, user); });
            break;
        case fn.mstr.dictionary['to_en']:
            fn.userOper.editUser(message.from.id,{'diclang': option}, (user) => { fn.commands.backToMainMenu(message, user); });        
            break;
        case fn.mstr.dictionary['trans_word']:
            fn.userOper.editUser(message.from.id,{'dictype': option}, (user) => { fn.commands.backToMainMenu(message, user); });        
            break;
        case fn.mstr.dictionary['trans_text']:
            fn.userOper.editUser(message.from.id,{'dictype': option}, (user) => { fn.commands.backToMainMenu(message, user); });        
            break;
    }
}
var injectbuttons = function(items, user){
    //check activation of module
    moduleOption = fn.getModuleOption('dictionary');
    if(!moduleOption.active) return items;

    //copy buttons
    var newitems = [];
    items.forEach((element) => { newitems.push(element); }, this);

    var dv = fn.mstr.dictionary.dvider;
    var to_fa       = (user.diclang === fn.mstr.dictionary['to_fa']) ? '✅' + dv : '⬜️' + dv;
    var to_en       = (user.diclang === fn.mstr.dictionary['to_en']) ? '✅' + dv : '⬜️' + dv;
    var trans_word  = (user.dictype === fn.mstr.dictionary['trans_word']) ? '✅' + dv : '⬜️' + dv;
    var trans_text  = (user.dictype === fn.mstr.dictionary['trans_text']) ? '✅' + dv : '⬜️' + dv;

    to_fa       += fn.mstr.dictionary['to_fa'],
    to_en       += fn.mstr.dictionary['to_en'], 
    trans_word  += fn.mstr.dictionary['trans_word'], 
    trans_text  += fn.mstr.dictionary['trans_text'];

    newitems.splice(0, 0, to_fa, to_en); //trans_word, trans_text);
    return newitems;
}

var gtranslate = require('./google_translate');
var translate = function(message){
    fn.db.user.findOne({'userId': message.from.id}, 'userId diclang dictype').exec((e, user) => {
        switch (user.dictype) {
            case fn.mstr.dictionary['trans_word']:
                wordTrans(user, message.text);
                break;
            case fn.mstr.dictionary['trans_text']:
                googleTranslate(user, message.text);
                break;
        }
    });
}
var wordTrans = function(user,text){}
var googleTranslate = function(user, text){
    var langoptions = {
        'fa': fn.mstr.dictionary.to_en,
        'en': fn.mstr.dictionary.to_fa,
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
module.exports = { translate, injectbuttons, changeUseroption, checkText_DicOption }