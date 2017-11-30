var show = function(userid, newcat){
    var activationtext = '',
    moduleOption = {},
    index = null;
    //find module option
    if(global.robot.confige.moduleOptions){
        global.robot.confige.moduleOptions.forEach(function(element, i) {
            if(element.name === 'ticket') {
                index = i;
                moduleOption = element;
            }
        }, this);
    } 
    else global.robot.confige.moduleOptions = [];

    if(index === null) {
        activationtext = 'enable';
        moduleOption = {'name':'ticket','active':false, 'button': fn.str.moduleButtons.contact['name']};
        global.robot.confige.moduleOptions.push(moduleOption);
    }
    
    //defin activation button
    activationtext = (moduleOption.active) ? 'disable' : 'enable';
    //defin new category
    if(newcat) {
        moduleOption.category = newcat;
        global.robot.confige.moduleOptions[index] = moduleOption;
    }
    //save configuration
    global.robot.save();

    var list = [fn.str.moduleButtons['category'].name, fn.str.moduleButtons.activation[activationtext]],
    back = fn.str.adminItems.settings['back'],
    remarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);
    global.robot.bot.sendMessage(userid, fn.str.settingsItems.inbox['name'], remarkup);
    fn.userOper.setSection(userid, fn.str.settingsItems.inbox['name'], true);    
}

var category = function (message, speratedQuery){
    console.log('set categori for inbox');
    fn.userOper.setSection(message.from.id, fn.str.moduleButtons['category'].name, true);
    var back = fn.str.settingsItems['inbox']['back'];
    var list = [];
    global.robot.categories.forEach(function(element) { list.push(element.parent + ' - ' + element.name); }, this);
    global.robot.bot.sendMessage(message.from.id, fn.str.editPost['category'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

var routting = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;
    //show inbox setting
    if (text == fn.str.settingsItems.inbox['name'] || text == fn.str.settingsItems.inbox['back']){
        show(message.from.id);
    }

    //active or deactive
    else if(fn.checkValidMessage(text, [fn.str.moduleButtons.activation.enable,fn.str.moduleButtons.activation.disable])){
        console.log('active deactive inbox');
        var key = (text === fn.str.moduleButtons.activation.enable) ? true : false;
        global.robot.confige.moduleOptions.forEach(function(element) {
            if(element.name === 'ticket') 
                element.active = key;
        }, this);

        global.robot.save();
        show(message.from.id);
    }

    //set category
    else if(text === fn.str.moduleButtons['category'].name) category(message, speratedSection);
    else if(speratedSection[last] == fn.str.moduleButtons['category'].name){
        console.log('get new category for inbox');
        var cat = text.split(' - ')[1];
        if(fn.category.checkInValidCat(cat)){
            show (message.from.id, cat);
        }else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
    }
}   
module.exports = {routting}