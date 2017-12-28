var show = function(userid, newcat){
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

    var list = [fn.str.activation[activationtext]],
    back = fn.str.goToAdmin['back'];
    remarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);
    global.robot.bot.sendMessage(userid, fn.mstr.dictionary['name'], remarkup);
    fn.userOper.setSection(userid, fn.mstr.dictionary['name'], true);    
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
}   
module.exports = {routting, user}