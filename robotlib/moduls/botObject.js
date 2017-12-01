global.messageRouting = require('../routting/messageRouting.js');
global.queryRouting = require('../routting/queryRouting.js');

module.exports = function(detail){
    this.username = detail.username
    this.useCount = 0;
    this.token = detail.token;
    this.bot = {};
    this.adminWaitingList = [];
    this.confige = detail.confige;
    this.categories = [];
    this.menuItems = [];

    this.start = function(){ 
        this.load();
        global.robot = this;
        global.robot.bot = new global.fn.telegramBot(this.token, {polling: true});

        //Message
        global.robot.bot.on('message', (msg) => {
            console.log(msg.text);
            global.messageRouting.analyze(msg);
        });

        //callback 
        global.robot.bot.on('callback_query', (query) => {
            //console.log(query);
            global.queryRouting.analyze(query);
        });
    }

    this.save = function(saveCalBack){
        global.fn.db.confige.findOne({"username": this.username}, function(err, conf){
            if(conf){
                conf.username = global.robot.username,
                conf.modules = global.robot.confige.modules,
                conf.moduleOptions = global.robot.confige.moduleOptions
                conf.save(() => {
                    if(saveCalBack) saveCalBack();
                });
            }
            else{
                var conf = new global.fn.db.confige({
                    "username": global.robot.username,
                    "modules": global.robot.confige.modules,
                    "moduleOptions": global.robot.confige.moduleOptions
                });
                conf.save(() => {
                    if(saveCalBack) saveCalBack();
                });
            }
            //get main menu items
            global.fn.getMainMenuItems();
        });
    }

    this.load = function(loadCalBack){
        global.fn.db.confige.findOne({"username": this.username}, function(err, conf){
            if(conf){
                global.robot.confige.moduleOptions = conf.moduleOptions;
                if(loadCalBack) loadCalBack();
            }
            else if(loadCalBack) loadCalBack();
            //get main menu items
            global.fn.getMainMenuItems();
        });
    }
}