var db                  = require('./base/db.js');
var str                 = require('./str/staticStrings.js');
var mstr                = require('./str/modulesStrings');
var telegramBot         = require('node-telegram-bot-api');
var generateKeyboard    = require('./base/generateKeyboard.js');
var time                = require('../moduls/time.js');
var collector           = require('../moduls/collector');
var fs                  = require('fs');
var request             = require('request');
var path                = require('path');
var commands            = require('./routting/commands');
var freeStrings         = require('./routting/freeStrings');
var m                   = require('./moduls/moduls');

//user
var userOper        = require('./user/userOperations.js');

//admin
var adminPanel      = require('./admin/adminPanel.js');
var upload          = require('./admin/upload.js');

var convertObjectToArray = function(object, option){

    var chartData = [];
    for (var i in object) {
        var item = object[i];
        var outer = [];
        // skip over items in the outer object that aren't nested objects themselves
        if (typeof item === "object" && option.nested) {
            var resalts = convertObjectToArray(item,option);
            for(var j in resalts) { 
                chartData.push(resalts[j])
            }
        }
        else if(typeof item !== "object") chartData.push(item);
    }
    return chartData;
    //console.log(chartData);
}

var converAMenuItemsToArray = function(object){
    var items = [];
    for (item in object){
        var element = object[item];
        //check if the Item is a module setting 
        if(element.modulename){
            //check module statuse
            if(global.confige.modules[element.modulename]) items.push(element.name);
        }
        else items.push(element.name);
    }
    return items;
}

var checkValidMessage = function(text, custom){
    var isvalid = false;
    //str
    if(custom) {
        //console.log(custom);
        custom.forEach(function(element) {
            if(element && text && element.toString().trim() === text.toString().trim()) 
                isvalid = true;
        }, this);
    }
    else {
        global.fn.strArr.forEach(function(element) {
            if(element.toString().trim() === text.toString().trim()) isvalid = true;
        }, this);
    }
    return isvalid;
}

var saveTelegramFile = function(id, fileName, savePath, callback){
    global.robot.bot.getFileLink(id).then((link) => {
        request(link).pipe(fs.createWriteStream(savePath)).on('close', () =>{
            console.log('new file has been created on', savePath);
            if(callback) callback();
        });
    });
}

var getMenuItems = function(name, callback){
    var items = [];
    var noitem = false;
    fn.db.post.find({'category': name}).exec((e, postlist) => {

        if(postlist) postlist.forEach(function(element) { items.push({'name':element.name, 'order':element.order}) }, this);

        //get child categories
        fn.db.category.find({'parent': name}, 'name order').exec((e, catlist) => { 
            if(catlist) catlist.forEach(function(element) { items.push({'name':element.name, 'order':element.order}) }, this); 

            //get modules
            var modulsoptions = global.robot.confige.moduleOptions;
            if(modulsoptions) {
                modulsoptions.forEach(function(md) {
                    if(md.category && md.category === name) items.push({'name':md.button, 'order': 1})
                }, this);
            }

            //sort
            items.sort(function(a, b){return a.order-b.order});
            var newItems = [];
            items.forEach(function(element) { newItems.push(element.name); }, this);
            newItems.reverse();
            
            //no item
            if(postlist.length === 0 && catlist.length === 0) noitem = true;
            
            //callback and description
            var description = name;
            fn.db.category.findOne({'name':name}, (e, c) => {
                if(c && c.description) description =c.description;
                if(callback) callback(newItems, description, noitem);
            });
        });

    });
}

var getMainMenuItems = function(){
    getMenuItems(fn.mstr.category['maincategory'], (items) => { 
        global.robot.menuItems = (items) ? items : [];
        //items.push(fn.str.mainMenuItems['contact']);
    });
}

var queryStringMaker = function(parameter, list, condition){
    var query = '';
    var count = list.length;
    list.forEach(function(element, i) {
        if(i > 0 && i < count) query += " " + condition + " ";
        query += 'this.' + parameter + ' === "' + element + '"';
    }, this);
    return query;
}

var getModuleOption = function(name){
    var moduleOption = {};
    if(global.robot.confige.moduleOptions){
        global.robot.confige.moduleOptions.forEach(function(element, i) {
            if(element.name === name) { moduleOption = element; }
        }, this);
    }
    return moduleOption;
}

var updateBotContent = function(callback){
    m.category.get(() => { getMainMenuItems(); })
    if(callback) callback();
}

module.exports = {
    //system
    db, str, mstr, time, telegramBot, generateKeyboard, convertObjectToArray, commands,
    getMainMenuItems, getMenuItems, converAMenuItemsToArray, queryStringMaker,
    checkValidMessage, saveTelegramFile, collector, freeStrings, m,
    updateBotContent, getModuleOption,
    //user
    userOper, 
    //admin
    adminPanel, upload, 
}