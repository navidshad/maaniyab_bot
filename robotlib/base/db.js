var mongoose = require('mongoose');
mongoose.connect(global.confige.dbpath);

var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() { console.log('db was connected'); });

//create schemas
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userId          : Number,
    username        : String,
    isAdmin         : Boolean,
    isCompelet      : Boolean,
    fullname        : String,
    phone           : Number,
    section         : String,
    textTranslation : {from: String, to:String},
    dictype         : String,
});

var inboxSchema = new Schema({
  readed      : Boolean,
  messId      : String,
  date        : String,
  userId      : Number,
  username    : String,
  fullname    : String,
  message     : String,
});

var sendBoxSchema = new Schema({
  date        : String,
  title       : String,
  text        : String,
});

var ConfigSchema = new Schema({
  username      : String,
  collectorlink : String,
  modules :{
    'settings':Boolean,
    'ticket': Boolean,
    'contacttousers': Boolean,
    'shop': Boolean
  },
  moduleOptions:[{name:String, category:String, active: Boolean, button:String}]
});

var categorySchema = new Schema({
  name:String,
  parent:String,
  description: String,
  order:Number
});

var postSchema = new Schema({
  name        :String,
  category    :String,
  order       :Number,
  date        :String,
  description :String,
  type        :String,
  fileid      :String,
  photoid     :String,
  audioid     :String,
  videoid     :String,
  thumbLink   :String,
  publish     :Boolean
});

var usecounterSchema = new Schema({
  userid : Number,
  phrase: String,
  date:Date
});

var user      = mongoose.model('Users', UserSchema);
var inbox     = mongoose.model('inbox', inboxSchema);
var sendbox   = mongoose.model('sendBox', sendBoxSchema);
var confige   = mongoose.model('confige', ConfigSchema);
var category  = mongoose.model('categories', categorySchema);
var post      = mongoose.model('posts', postSchema);
var usecounter   = mongoose.model('useCounter', usecounterSchema);


module.exports = { connection, user, inbox, sendbox, confige, category, post, usecounter};
