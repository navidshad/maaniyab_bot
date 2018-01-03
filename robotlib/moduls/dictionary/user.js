var textTranslation = require('./textTranslation/functions');
var wordTranslation = '';//require('');

var injectbuttons = function(items, user){
    //check activation of module
    moduleOption = fn.getModuleOption('dictionary');
    if(!moduleOption.active) return items;

    //copy buttons
    var newitems = [];

    switch (user.dictype) {
        case fn.mstr.dictionary.btns.types['text']:
            newitems = textTranslation.getBtns(user);
            break;
    
        case fn.mstr.dictionary.btns.types['word']:
            break;
    }

    //newitems.push(fn.mstr.dictionary.btns['translateType']);
    return newitems.concat(items);    
}

var showOption = function(userid){
    var list = [ fn.mstr.dictionary.btns.types['text'], fn.mstr.dictionary.btns.types['word'] ];
    back = fn.str['backToMenu'];
    remarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);
    global.robot.bot.sendMessage(userid, fn.mstr.dictionary['name'], remarkup);
    fn.userOper.setSection(userid, fn.mstr.dictionary.btns['translateType'], true);
}
var setOption = function(userid, text){
    var availableLableOptions = [ fn.mstr.dictionary.btns.types['text'], fn.mstr.dictionary.btns.types['word'] ];
    if(fn.checkValidMessage(text, availableLableOptions)){
        fn.userOper.editUser(userid, {'dictype':text}, (user) => {
            fn.commands.backToMainMenu({'from':{'id':user.userId}}, user, fn.str['seccess']);
        });
    }
    else global.robot.bot.sendMessage(userid, fn.str['choosethisItems']);
}

var routting = function(message, speratedSection, user){
    var text = message.text;
    var last = speratedSection.length-1;
    var textTransOptions = text.split(fn.mstr.dictionary.dvider)[1];
    //change dictionary type
    if(text === fn.mstr.dictionary.btns.translateType) showOption(message.from.id);
    else if(speratedSection[last] === fn.mstr.dictionary.btns.translateType) setOption(message.from.id, text);
    //type routting
    else if(user.dictype === fn.mstr.dictionary.btns.types['text']) textTranslation.routting(message, speratedSection, user);
    else if(user.dictype === fn.mstr.dictionary.btns.types['word']){}
}

module.exports = { routting, injectbuttons }