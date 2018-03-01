var link = 'www.google-analytics.com/collect';
var trackingid = global.confige.g_trackingID;

var trackevent = function(event){
    event.tid = trackingid;
    event.cid = '47974a24-f19a-43b6-8891-a5378cfe1fee';
    link += '?v=1&t=event&tid=UA-113123995-1&cid=06ec974c-8c0a-4779-b265-41954740acbb&ec=mydemo.com&ea=%2Fhome&el=homepage&ev=300';
    var options = {
        method: 'POST',
        uri: link,
        //body: event,
        json: true // Automatically stringifies the body to JSON
    };
    fn.request_p(options)
    .then(() => {
        console.log('user was tracked');
    })
    .catch(function (err) {
        // Crawling failed...
        //console.log(err);
    });
}

module.exports = {trackevent}