module.exports = function(message, speratedSection){
    console.log('recognize file type');
    var resId = speratedSection[speratedSection.length-1];
    
    var resourceid = '';
    var fileType = '';

    //file
    if(message.document){
        resourceid = message.document.file_id;
        fn.post.editpost(resId, {'fileid': resourceid}, message.from.id);
    }    
    //photo
    if(message.photo){
        resourceid = message.photo[2].file_id;
        fn.post.editpost(resId, {'photoid': resourceid}, message.from.id);        
    }       
    //audio
    if(message.audio){       
        resourceid = message.audio.file_id;
        fn.post.editpost(resId, {'audioid': resourceid}, message.from.id);                
    }
    //video
    if(message.video){
        resourceid = message.video.file_id;
        fn.post.editpost(resId, {'videoid': resourceid}, message.from.id);                        
    }            

}