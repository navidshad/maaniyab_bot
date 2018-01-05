var show = function(userid, injectedText){
    var activationtext = '',
    moduleOption = {},
    index = null;
    //find module option
    if(global.robot.confige.moduleOptions){
        global.robot.confige.moduleOptions.forEach(function(element, i) {
            if(element.name === 'dictionary') {
                index = i;
                moduleOption = element;
            }
        }, this);
    } else global.robot.confige.moduleOptions = [];
    
    //create module option
    if(index === null) {
        activationtext = 'enable';
        moduleOption = {'name':'dictionary','active':false, 'button': fn.mstr.dictionary['name']};
        global.robot.confige.moduleOptions.push(moduleOption);
    }
    
    //defin activation button
    activationtext = (moduleOption.active) ? 'disable' : 'enable';

    //save configuration
    global.robot.save();

    var list = [
        fn.str.activation[activationtext],
        fn.mstr.dictionary.btns['textTranslationMess'],
        fn.mstr.dictionary.btns['wordTranslationMess'],
    ];

    var back = fn.str.goToAdmin['back'];
    var remarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);
    var mess = (injectedText) ? injectedText : fn.mstr.dictionary['name'];
    global.robot.bot.sendMessage(userid, mess, remarkup);
    fn.userOper.setSection(userid, fn.mstr.dictionary['name'], true);    
}

var setTextDescription = function(userid, flag){
    var dictionaryModule = fn.getModuleOption('dictionary');
    if(!dictionaryModule.otherdata) dictionaryModule.otherdata = [{},{}];
    if(flag.textTranslationMess) dictionaryModule.otherdata[0] = {'name':'textTranslationMess', 'data':flag.textTranslationMess}
    if(flag.wordTranslationMess) dictionaryModule.otherdata[1] = {'name':'wordTranslationMess', 'data':flag.wordTranslationMess}
    show(userid, fn.str['seccess']);
}

var user = require('./user');

var routting = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;
    //show dictionary setting
    if (text == fn.mstr.dictionary['name'] || text == fn.mstr.dictionary['back']){
        show(message.from.id);
    }

    //active or deactive
    else if(fn.checkValidMessage(text, [fn.str.activation.enable,fn.str.activation.disable])){
        console.log('active deactive dictionary');
        var key = (text === fn.str.activation.enable) ? true : false;
        global.robot.confige.moduleOptions.forEach(function(element) {
            if(element.name === 'dictionary') element.active = key;
        }, this);

        global.robot.save();
        show(message.from.id);
    }

    //get text translation message
    else if(text == fn.mstr.dictionary.btns['textTranslationMess']){
        fn.userOper.setSection(message.from.id, fn.mstr.dictionary.btns['textTranslationMess'], true);
        var replymarkup = fn.generateKeyboard({'section': fn.mstr.dictionary['back']}, true);
        global.robot.bot.sendMessage(message.from.id, fn.mstr.dictionary.btns['textTranslationMess'], replymarkup);
    }
    else if(speratedSection[last] === fn.mstr.dictionary.btns['textTranslationMess'])
        setTextDescription (message.from.id, {'textTranslationMess' : text});

    //get word translation message
    else if(text == fn.mstr.dictionary.btns['wordTranslationMess']){
        fn.userOper.setSection(message.from.id, fn.mstr.dictionary.btns['wordTranslationMess'], true);
        var replymarkup = fn.generateKeyboard({'section': fn.mstr.dictionary['back']}, true);
        global.robot.bot.sendMessage(message.from.id, fn.mstr.dictionary.btns['wordTranslationMess'], replymarkup);
    }
    else if(speratedSection[last] === fn.mstr.dictionary.btns['wordTranslationMess'])
        setTextDescription (message.from.id, {'wordTranslationMess' : text});
}   
module.exports = {routting, user}