module.exports = {
    //public -----------------------------------------------------
    seccess         :'انجام شد',
    back:           '⤴️ برگشت به',
    escapEdit       :'⤴️ خارج شدن از ویرایش',
    chooseOtherText :'لطفا واژه دیگری انتخاب کنید.',
    choosethisItems :'لطفا از گزینه های زیر استفاده کنید.',
    newname         :'لطفا یک نام جدید انتخاب کنید',

    //post types
    postTypes:{
        text :{'icon':'📄', 'name':'text'},
        file: {'icon':'📎', 'name':'file'},
        video: {'icon':'📺', 'name':'video'},
        sound: {'icon':'🎧', 'name':'sound'},
        photo: {'icon':'🏞', 'name':'photo'},
        attached:' - 🃏(دارای فایل)',
        ticket:'ticket'
    },

    //user -------------------------------------------------------
    mainMenu        : 'صفحه اصلی',
    mainMenuMess    : 'الان میتونی هر چیزی که میخوای رو ترجمه کنی، لطفا یک کلمه یا متن برای من ارسال کن.',
    backToMenu      :'⤴️ برگشت به منو',
    //send ticket
    contactWadminMess:'لطفا پیام متنی خود را برای مدیر مجموعه ارسال کنید.',

    //admin Setting module ------------------------------------------------------
    goToAdmin:{name:'🏁 بخش مدیریت', back:'⤴️ برگشت به مدیریت'},
    adminItems:{
        sendMessage:{
            name:'📨 ارسال پیام به کاربران', back:'', modulename:'contacttousers',
            sendboxSymbol:'ـ ' + '🗒 ',
            sendMessToUsersNewMess:'پیام جدید',
            sendMessToUsersDeleteAll:'حذف همه از لیست',
            sendMessToUsersTitle:'لطفا عنوان پیام را ارسال کنید.',
            sendMessToUsersEditMess:'متن جدید را ارسال کنید.',
        },
        inbox: {
            name:'📬 صندوق پیام ها', back:'', modulename:'ticket',
            readSym: ['📪','📭'],
            inboxDeleteAll: 'حذف تمام پیام ها',
        },
        settings: {name:'⚙️ تنظیمات', back:'⤴️ برگشت به تنظیمات', modulename:'settings'},
    },
    //---------------------------------------------------------------------------
    settingsItems:{
        post :{name:'⚙️' + ' - ' + '🔖 مطالب', back:'⤴️ برگشت به ⚙️ 🔖 مطالب'},
        categories :{name:'⚙️' + ' - ' + '🗂 دسته بندی مطالب', back:'⤴️ برگش به ⚙️ دسته بندی مطالب'},
        inbox : {name:'⚙️' + ' - ' + '📬 صندوق پیام ها', back:'⤴️ برگش به ⚙️ صندوق پیام ها', modulename:'ticket'},
        dictionary : {name:'⚙️' + ' - ' + 'معنی یاب', back:'⤴️ برگش به ⚙️ معنی یاب', modulename:'dictionary'},        
    },
    moduleButtons : {
        activation: {enable:'فعال کردن', disable:'غیر فعال کردن'},
        category:{name:'دسته بندی', message:'لطفا دسته بندی که میخواهید این قابلیت در آن نمایش داده ود را انتخاب کنید.'},
        contact :{name:'📨 ارسال پیام، مشاوره', modulename:'ticket'},
        dictionary :{
            name:'معنی یاب', modulename:'dictionary',
            to_fa:'انگلیسی به فارسی', to_en:'فارسی به انگلیسی', trans_word:'ترجمه لغت', trans_text:'ترجمه متن',
            dvider:' ، ',
        }        
    },

    //post ------------------------------------------------------------
    settingGetNewAboutUs : 'لطفا متن درباره ما را ارسال کنید.',
    postOptions: ['❌ حذف مطلب', '✏️ افزودن مطلب'],
    scErrors : [
        'نام دسته بندی ها  مطالب نباید مثل هم باشد.',
        'مطب دیگری با این نام قبلا ثبت شده است.',
        'دسته بندی دیگری با این نام قبلا ثبت شده است.'        
    ],
    newSCMess :'لطفا یک نام برای مطلب جدید انتخاب کنید.' + '\n' + 'توجه کنید که این نام در داخل منو ها نمایش داده میشود.',
    editPost:{
        name:'لطفا نام جدید مطلب را وارد کنید.',
        description:'توضیحات جدید را وارد کنید.',
        category:'لطفا دسته بندی مورد نظر را انتخاب کنید.',
        upload:'متناسب با نوع مطلب، فایلی که میخاهید آپلود شود را ارسال کنید.',
        order:'لطفا اولویت مطلب را با عدد مشخص کنید. ترتیب محصولات و دسته بندی ها هنگامی که لیست میشوند بر اساس این اعداد است.'        
    },
    //category
    categoryoptions: ['📝 ویرایش دسته های فعلی', '✏️ افزودن دسته'],
    maincategory: 'دسته اصلی',  //don't change it, it has been stored in categories collection
    backtoParent:'⤴️ برگشت به بالا',
    editCategory:{
        name:'لطفا نام جدید دسته بندی را ارسال کنید.',
        parent:'لطفا دسته بندی مادر را انتخاب کنید.',
        description:'لطفا توضیحات دسته بندی را انتخاب کنید.',
        order:'لطفا اولویت دسته بندی را با عدد مشخص کنید. ترتیب محصولات و دسته بندی ها هنگامی که لیست میشوند بر اساس این اعداد است.'
    },
    //symbles
    catsym:'🗂',
    staticsym:'🔖',
    Published:'✅',
    NotPublished:'🚫',

    //query --------------------------------------------------------
    queryUpload:'upload',
    queryDelete:'delete',
    queryPublication:'publication',
    queryOrder      :'order',

    //send message to users
    queryAdminSndMess:'messageToUsers',
        queryAdminSndMessAdded          :'✅ ',
        queryAdminSndMessRemoved        :'❌ ',
        queryAdminSndMessSend           :'post',
        queryAdminSndMessDel            :'delete',
        queryAdminSndMessEditTitle      :'editTitle',
        queryAdminSndMessEditMessage    :'editMessage',
    
    //post query
    queryPost           :'post',
        queryPostText       :'format' + 'text',
        queryPostFile       :'format' + 'file',
        queryPostPhoto      :'format' + 'photo',
        queryPostSound      :'format' + 'sound',
        queryPostVideo      :'format' + 'video',
        queryPostName       :'name',
        queryPostCategory   :'category',
        queryPostDescription:'description',

    //category query
    queryCategory        :'category',
        queryCategoryName       :'name',
        queryCategoryParent     :'parent',
        queryCategoryDescription:'description',
        
}