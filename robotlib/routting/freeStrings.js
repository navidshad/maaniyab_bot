var routting = function(message, speratedSection, user){
    var text = message.text;

    //dictionary module
    if(fn.getModuleOption('dictionary').active) fn.m.dictionary.user.routting(message, speratedSection, user);
    //non
    else global.robot.bot.sendMessage(message.from.id, 'لطفا از گزینه های ربات استفاده کنید.');
}

module.exports = {routting}