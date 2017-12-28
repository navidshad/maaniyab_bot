var routting = function(message, speratedSection, user){
    var text = message.text;

    //dictionary module
    if(fn.getModuleOption('dictionary').active){
        //choose dic option
        var dicOpt = text.split(fn.mstr.dictionary.dvider)[1];
        if(dicOpt && fn.m.dictionary.user.checkText_DicOption(dicOpt).valid){
            console.log('dictunary option');
            fn.m.dictionary.user.changeUseroption(message, dicOpt);
        }
        //translate
        else fn.m.dictionary.user.translate(message);
    }
    //non
    else global.robot.bot.sendMessage(message.from.id, 'لطفا از گزینه های ربات استفاده کنید.');
}

module.exports = {routting}