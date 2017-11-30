var createKeyes = function(array, user, cutindex){
    var items = Object(array);
    var dv = fn.str.moduleButtons.dictionary.dvider;
    var to_fa       = (user.diclang.toString() === fn.str.moduleButtons.dictionary['to_fa'].toString()) ? '✅' + dv : '⬜️' + dv;
    var to_en       = (user.diclang.toString() === fn.str.moduleButtons.dictionary['to_en'].toString()) ? '✅' + dv : '⬜️' + dv;
    var trans_word  = (user.dictype.toString() === fn.str.moduleButtons.dictionary['trans_word'].toString()) ? '✅' + dv : '⬜️' + dv;
    var trans_text  = (user.dictype.toString() === fn.str.moduleButtons.dictionary['trans_text'].toString()) ? '✅' + dv : '⬜️' + dv;

    to_fa     += fn.str.moduleButtons.dictionary['to_fa'],
    to_en     += fn.str.moduleButtons.dictionary['to_en'], 
    trans_word  += fn.str.moduleButtons.dictionary['trans_word'], 
    trans_text  += fn.str.moduleButtons.dictionary['trans_text'];

    items.splice(cutindex, 1, to_fa, to_en); //trans_word, trans_text);

    return items;
}

var checkText_DicOption = function(text){
    var valid = false;
    var option = null;
    var options = [
        fn.str.moduleButtons.dictionary['to_fa'],
        fn.str.moduleButtons.dictionary['to_en'], 
        fn.str.moduleButtons.dictionary['trans_word'], 
        fn.str.moduleButtons.dictionary['trans_text']
    ]
    
    options.forEach((element, i) => {
        if(text.includes(element)) { valid = true; option = element}
    });

    return {'valid': valid, 'option': option};
}

var changeUseroption = function(message, option){
    switch (option) {
        case fn.str.moduleButtons.dictionary['to_fa']:
            fn.userOper.editUser(message.from.id,{'diclang': option}, (user) => { fn.commands.backToMainMenu(message, user.isAdmin, user.isCompelet); });
            break;
        case fn.str.moduleButtons.dictionary['to_en']:
            fn.userOper.editUser(message.from.id,{'diclang': option}, (user) => { fn.commands.backToMainMenu(message, user.isAdmin, user.isCompelet); });        
            break;
        case fn.str.moduleButtons.dictionary['trans_word']:
            fn.userOper.editUser(message.from.id,{'dictype': option}, (user) => { fn.commands.backToMainMenu(message, user.isAdmin, user.isCompelet); });        
            break;
        case fn.str.moduleButtons.dictionary['trans_text']:
            fn.userOper.editUser(message.from.id,{'dictype': option}, (user) => { fn.commands.backToMainMenu(message, user.isAdmin, user.isCompelet); });        
            break;
    }
}

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
    }
    else global.robot.confige.moduleOptions = [];
    
    if(index === null) {
        activationtext = 'enable';
        moduleOption = {'name':'dictionary','active':false, 'button': fn.str.moduleButtons.dictionary['name']};
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
    global.robot.bot.sendMessage(userid, fn.str.settingsItems.dictionary['name'], remarkup);
    fn.userOper.setSection(userid, fn.str.settingsItems.dictionary['name'], true);    
}

var category = function (message, speratedQuery){
    console.log('set categori for dictionary');
    fn.userOper.setSection(message.from.id, fn.str.moduleButtons['category'].name, true);
    var back = fn.str.settingsItems['dictionary']['back'];
    var list = [];
    global.robot.categories.forEach(function(element) { list.push(element.parent + ' - ' + element.name); }, this);
    global.robot.bot.sendMessage(message.from.id, fn.str.editPost['category'], 
    fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));
}

var routting = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;
    //show dictionary setting
    if (text == fn.str.settingsItems.dictionary['name'] || text == fn.str.settingsItems.dictionary['back']){
        show(message.from.id);
    }

    //active or deactive
    else if(fn.checkValidMessage(text, [fn.str.moduleButtons.activation.enable,fn.str.moduleButtons.activation.disable])){
        console.log('active deactive dictionary');
        var key = (text === fn.str.moduleButtons.activation.enable) ? true : false;
        global.robot.confige.moduleOptions.forEach(function(element) {
            if(element.name === 'dictionary') 
                element.active = key;
        }, this);

        global.robot.save();
        show(message.from.id);
    }

    //set category
    else if(text === fn.str.moduleButtons['category'].name) category(message, speratedSection);
    else if(speratedSection[last] == fn.str.moduleButtons['category'].name){
        console.log('get new category for dictionary');
        var cat = text.split(' - ')[1];
        if(fn.category.checkInValidCat(cat)){
            show (message.from.id, cat);
        }else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
    }
}   
module.exports = {routting, createKeyes, checkText_DicOption, changeUseroption}