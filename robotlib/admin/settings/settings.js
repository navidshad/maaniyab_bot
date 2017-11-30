fn = global.fn;
//go to settings section
var toSettings = function(message, txt){
    fn.userOper.setSection(message.from.id, fn.str.adminItems.settings.name, true);
    var list = fn.converAMenuItemsToArray(fn.str['settingsItems']);
    global.robot.bot.sendMessage(message.from.id, (txt) ? txt : fn.str.adminItems.settings.name, fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':fn.str.goToAdmin.back}, false));        
}

module.exports = function(message, speratedSection){
    console.log(message.text, fn.str.settingsItems.categories['name']);
    //ask to settings
    if(message.text === fn.str.adminItems.settings.name || message.text === fn.str.adminItems.settings['back']){
        console.log('go to settings');
        toSettings(message);
    }


    //post contents
    else if(message.text === fn.str.settingsItems.post['name'] || message.text === fn.str.settingsItems.post['back'] || speratedSection[3] === fn.str.settingsItems.post['name']){
        console.log('go to static content');
        fn.post.routting(message, speratedSection);
    }


    //categories
    else if(message.text == fn.str.settingsItems.categories['name'] || message.text == fn.str.settingsItems.categories['back'] || speratedSection[3] == fn.str.settingsItems.categories['name']){
        console.log('go to category');
        fn.category.routting(message, speratedSection);
    }

    //inbox setting
    else if (message.text == fn.str.settingsItems.inbox['name'] || message.text == fn.str.settingsItems.inbox['back'] || speratedSection[3] == fn.str.settingsItems.inbox['name'])
        fn.inboxsetting.routting(message, speratedSection);

    //dictionary setting
    else if (message.text == fn.str.settingsItems.dictionary['name'] || message.text == fn.str.settingsItems.dictionary['back'] || speratedSection[3] == fn.str.settingsItems.dictionary['name'])
    fn.dictionarysetting.routting(message, speratedSection);
}