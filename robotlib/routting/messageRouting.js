fn = global.fn;
menu = require('./menuItemsRouting');

var analyze = function(message){
    //commands
    if(message.text && message.text === '/start')                   fn.commands.start(message);
    else if (message.text && message.text === '/getsection')        fn.commands.getsection(message);
    else if (message.text && message.text.includes('/register-'))   fn.commands.registerAdmin(message);
    else if (message.text && message.text === '/getusecount')       fn.commands.getusecount(message)

    else{
        //validating user
        fn.userOper.checkProfile(message.from.id, (section, isCompelet, isAdmin, fullname) => {
            
            //sperate section 
            var speratedSection = section.split('/');
            
            //go to meain menu
            if(message.text && message.text === fn.str['backToMenu']) fn.commands.backToMainMenu(message, isAdmin, isCompelet);
            
            //when profile is compelet
            else if(isCompelet){
                console.log('user profile is compelet');
                //text message
                if(message.text){
                    var text = message.text;

                    //choose dic option
                    var dicOpt = text.split(fn.str.moduleButtons.dictionary.dvider)[1];
                    if(dicOpt && fn.dictionarysetting.checkText_DicOption(dicOpt).valid){
                        console.log('dictunary option');
                        fn.dictionarysetting.changeUseroption(message, dicOpt);
                    }

                    //go to admin
                    else if(text === fn.str.goToAdmin['name'] || text === fn.str.goToAdmin['back'] || speratedSection[1] === fn.str.goToAdmin['name'] && isAdmin){
                        fn.adminPanel(message, speratedSection);}
                    
                    //menu items
                    else if(fn.checkValidMessage(text, global.robot.menuItems) || fn.checkValidMessage(speratedSection[1], global.robot.menuItems))
                        menu(message, speratedSection);

                    //translate
                    else fn.dictianary.translate(message);
                }

                //non text message
                else{
                    fn.upload(message, speratedSection);
                }
            
            }
            //user profile is not compelet
            else if (!isCompelet && message.text){
                console.log('user profile is not compelet', 'you should register first');
                var name = 'کاربر گرامی ' + message.from.first_name + ' عزیر،';
                var pm = name + '\n' + 'شما ابتدا باید پروفایل خود را تکمیل کنید تا بتوانید از امکانات ربات استفاده کنید.';
                global.robot.bot.sendMessage(message.from.id, pm, fn.generateKeyboard({section:fn.str['mainMenu'], "isCompelet": isCompelet}, false));
            }
        });
    }
}

module.exports = {
    analyze
}