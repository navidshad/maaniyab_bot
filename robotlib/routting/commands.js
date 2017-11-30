//start bot
var start = function(message){
    //collect 
    var form = Object(message.from);
    form.bot = global.robot.username;
    fn.collector.send(form);

    var id = message.from.id,
    username = message.from.username, fullname= message.from.first_name + ' ' + message.from.last_name;
    fn.userOper.registerId(id, {'username':username, 'fullname':fullname}, (isAdmin) => {
        backToMainMenu(message, isAdmin, false);
        if(isAdmin) global.robot.bot.sendMessage(message.from.id, 'اکنون شما مدیر هستید.');
    });
}
//get user's section
var getsection = function(message){
    fn.userOper.checkProfile(message.from.id, (section, isCompelet) => {
        global.robot.bot.sendMessage(message.from.id, section);
    });
}
//register admin
var registerAdmin = function(message){
    console.log('register someone');
    var sperate = message.text.split('-');
    fn.userOper.addAdminToWaintingList(sperate[1]);
    global.robot.bot.sendMessage(message.from.id, 'ثبت نام انجام شد، کابر مورد نظر باید از ابتدا ربات را استارت کند.');
}
//back to mainMenu
var backToMainMenu = function(message, isAdmin, isCompelet){
    console.log('go to main menu');
    var items = [];
    global.robot.menuItems.forEach(element => { items.push(element); });;

    //find user dicdinary detail
    fn.db.user.findOne({'userId':message.from.id}, 'diclang dictype').exec((e, user) => {
        if(user){
            //inject ditunary buttons
            var dicLable = fn.str.moduleButtons.dictionary.name;
            var checkLable = fn.checkValidMessage(dicLable, items, {returnIndex: true});
            items = fn.dictionarysetting.createKeyes(items, user, checkLable.index);
            
            //send main menu
            fn.userOper.setSection(message.from.id, fn.str['mainMenu'], false);
            remarkup = fn.generateKeyboard({section:fn.str['mainMenu'], 'list':items, "isCompelet": isCompelet, "isAdmin": isAdmin}, false);
            global.robot.bot.sendMessage(message.from.id, fn.str['mainMenuMess'], remarkup);
        }
    });
}

module.exports = {
    start, getsection, registerAdmin, backToMainMenu,
}