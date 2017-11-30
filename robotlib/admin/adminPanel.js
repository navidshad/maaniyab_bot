fn = global.fn;

module.exports = function(message, speratedSection){

    //go to Admin 
    if(message.text === fn.str.goToAdmin['name'] || message.text === fn.str.goToAdmin['back']){
        console.log('got to admin section');
        fn.userOper.setSection(message.from.id, fn.str.goToAdmin['name'], true);
        markup = fn.generateKeyboard({section:fn.str.goToAdmin['name'], 'list':fn.str['adminItems']}, false);        
        global.robot.bot.sendMessage(message.from.id, fn.str.goToAdmin['name'], markup);
    }

    //go to settings
    else if(message.text === fn.str.adminItems.settings.name || message.text === fn.str.adminItems.settings.back || speratedSection[2] === fn.str.adminItems.settings.name){
        console.log('go to setting section');
        fn.settings(message, speratedSection);
    }

    //go to inbox
    else if(message.text === fn.str.adminItems['inbox'].name || speratedSection[2] === fn.str.adminItems['inbox'].name){
        console.log('got to inbox section');
        fn.inbox(message, speratedSection);        
    }
    
    //go to sendbox
    else if(message.text === fn.str.adminItems['sendMessage'].name || speratedSection[2] === fn.str.adminItems['sendMessage'].name){
        console.log('send message to users');
        fn.sendbox.analyze(message, speratedSection);
    }
}