var jinboblog_jsext = jinboblog_jsext || {
    events: {
        'EntryCommentLoaded': []
    }
    , on: function(name, handler) {
        var handlers = this.events[name] || [];
        this.events[name] = handlers.concat(handler);
    }
    , fireEvent: function(name, arg) {
        var handlers = this.events[name] || [];
        var len = handlers.length;
        var i = 0;
        for (i=0;i<len;++i) {
            var handler = handlers[i];
            try {
                handler(arg);
            } catch (e) {
            }
        }
    }
};

/* override loadComponent() in common2.js */
window.loadComment = function(entryId, page, force) {
        var request = new HTTPRequest("POST", blogURL + '/comment/load/' + entryId);
        var o = document.getElementById("entry" + entryId + "Comment");
        if ((!force && o.style.display == 'none') || force) {
                request.onSuccess = function () {
                        PM.removeRequest(this);
                        o.innerHTML = this.getText("/response/commentBlock");
                        jinboblog_jsext.fireEvent('EntryCommentLoaded', o);
//			window.location.href = '#entry' + entryId + 'Comment';
                };
                request.onError = function() {
                        PM.removeRequest(this);
                        PM.showErrorMessage("Loading Failed.","center","bottom");
                };
                PM.addRequest(request,"Loading Comments...");
                request.send('&page='+page);
        }
        if (!force)
                o.style.display = (o.style.display == 'none') ? 'block' : 'none';
};
