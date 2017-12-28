//start bot
var start = function(message){
    //collect 
    var form = Object.assign({}, message.from);
    form.bot = global.robot.username;
    fn.collector.send(form);

    var id=message.from.id,
    username = message.from.username, fullname= message.from.first_name + ' ' + message.from.last_name;
    fn.userOper.registerId(id, {'username':username, 'fullname':fullname}, (user) => {
        backToMainMenu(message, user, false);
        if(isAdmin) global.robot.bot.sendMessage(message.from.id, fn.str['youareadmin']);
    });
}

//get user's section
var getsection = function(message){
    fn.userOper.checkProfile(message.from.id, (user) => {
        global.robot.bot.sendMessage(message.from.id, user.section);
    });
}

//register admin
var registerAdmin = function(message){
    console.log('register someone');
    var sperate = message.text.split('-');
    fn.userOper.addAdminToWaintingList(sperate[1]);
    global.robot.bot.sendMessage(message.from.id, fn.str['registeradmin']);
}

//back to mainMenu
var backToMainMenu = function(message, user, mess){
    console.log('go to main menu');
    var items = global.robot.menuItems;

    //inject dictionary btns
    items = fn.m.dictionary.user.injectbuttons(items, user);

    fn.userOper.setSection(message.from.id, fn.str['mainMenu'], false);
    remarkup = fn.generateKeyboard({section:fn.str['mainMenu'], 'list':items, "isCompelet": user.isCompelet, "isAdmin": user.isAdmin}, false);
    var texttosend = (mess) ? mess : global.robot.confige.firstmessage;
    if(texttosend == null) texttosend = global.fn.str['mainMenuMess'];
    global.robot.bot.sendMessage(message.from.id, texttosend, remarkup);
}

//setcollector
var setcollector = function(message){
    var newlink = message.text.split('/setcollector-')[1];
    global.robot.collectorlink = newlink;
    global.robot.save();
    global.robot.bot.sendMessage(message.from.id, fn.str['seccess'] + ' ' + newlink);
}

//drop database
var dropdb = function(message){ 
    fn.db.connection.db.listCollections().toArray(function (err, collections) {
        collections.forEach(element => {
          fn.db.connection.db.dropCollection(element.name, function(err, result) {});
        });
        fn.updateBotContent(() => {
          start(message);
        });
    });
}

//get user count
var getusecount = function(message){
    today = fn.time.gettime();
    fn.db.usecounter.count({}).exec((e, count) => {
        var mess = '✳️ ' + 'تعداد کل واژه های جستجو شده: ' + count + '\n';
        mess += '@' + global.robot.username;
        global.robot.bot.sendMessage(message.from.id, mess);

        if(today) {
            fn.db.usecounter.count({'date': fn.time.gettime()}).exec((e, todaycount) => {
                if(!todaycount) return;
                var todaymess = '❇️ ' + 'تعداد واژه های جستجو شده توسط کاربران امروز: ' + todaycount + '\n';
                todaymess += '@' + global.robot.username;
                global.robot.bot.sendMessage(message.from.id, todaymess);
            });
        }
    });

}

module.exports = {
    start, getsection, registerAdmin, backToMainMenu, setcollector, 
    dropdb, getusecount,
}