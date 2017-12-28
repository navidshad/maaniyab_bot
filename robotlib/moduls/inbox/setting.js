var show = function(userid, newcat){
    var mName = fn.mstr.inbox['modulename'];
    var activationtext = '',
    moduleOption = {},
    index = null;
    //find module option
    if(global.robot.confige.moduleOptions){
        global.robot.confige.moduleOptions.forEach(function(element, i) {
            if(element.name === mName) {
                index = i;
                moduleOption = element;
            }
        }, this);
    } 
    else global.robot.confige.moduleOptions = [];

    if(index === null) {
        activationtext = 'enable';
        moduleOption = {'name':mName,'active':false, 'button': fn.mstr.inbox['lable']};
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

    var list = [fn.mstr['category'].asoption, fn.str.activation[activationtext]],
    back = fn.mstr.inbox['back'],
    remarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);
    global.robot.bot.sendMessage(userid, fn.mstr.inbox['name'], remarkup);
    fn.userOper.setSection(userid, fn.mstr.inbox['settings'], true);    
}

var category = function (message, speratedQuery){
    console.log('set categori for inbox');
    fn.userOper.setSection(message.from.id, fn.mstr['category'].asoption, true);
    var back = fn.mstr['inbox']['back'];
    var list = [];
    global.robot.category.forEach((element) => {
        list.push(element.parent + ' - ' + element.name);
    });
    global.robot.bot.sendMessage(message.from.id, fn.mstr.post.edit['category'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

var routting = function(message, speratedSection){
    var mName = fn.mstr.inbox['modulename'];
    var text = message.text;
    var last = speratedSection.length-1;
    //show inbox setting
    if (text === fn.mstr.inbox['settings'] || text === fn.mstr.inbox['back']){
        show(message.from.id);
    }

    //active or deactive
    else if(fn.checkValidMessage(text, [fn.str.activation.enable,fn.str.activation.disable])){
        console.log('active deactive inbox');
        var key = (text === fn.str.activation.enable) ? true : false;
        global.robot.confige.moduleOptions.forEach(function(element) {
            if(element.name === mName) 
                element.active = key;
        }, this);

        global.robot.save();
        show(message.from.id);
    }

    //set category
    else if(text === fn.mstr['category'].asoption) category(message, speratedSection);
    else if(speratedSection[last] == fn.mstr['category'].asoption){
        console.log('get new category for inbox');
        var cat = text.split(' - ')[1];
        if(fn.m.category.checkInValidCat(cat)){
            show (message.from.id, cat);
        }else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
    }
}   
module.exports = {routting}