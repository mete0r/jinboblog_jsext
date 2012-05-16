function burn1ngk0re_svgedit_init() {

    function loadScript(src, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;

        if (callback) {
            script.onload = callback;
            script.onreadystatechange = function() {
                if (this.readyState == 'complete') {
                    callback();
                }
            };
        }

        head.appendChild(script);
    }

    var jquery_ui = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js';
    loadScript(jquery_ui, function(){});

    var embedapi_js = 'http://svg-edit.googlecode.com/svn/tags/stable/editor/embedapi.js';
    loadScript(embedapi_js, function() {
        //window.console.debug('embedapi loaded');

        jinboblog_jsext.on('EntryCommentLoaded', function(entryComment) {
            entryComment = jQuery(entryComment);

            var buttons = entryComment.find('.buttons');
            var submitbtn = buttons.find('input[type="submit"]');

            var svgbtn = jQuery(document.createElement('input'));
            svgbtn.attr('type', 'button');
            svgbtn.attr('value', 'SVG');
            svgbtn.click(function(){
                var textarea = entryComment.find('textarea');
                var dialog = jQuery(document.createElement('div'));
                dialog.attr('title', 'SVG Editor');
                dialog.hide();
                jQuery('#content').append(dialog);

                var iframe = document.createElement('iframe');
                iframe.src = 'http://svg-edit.googlecode.com/svn/tags/stable/editor/svg-editor.html';
                //iframe.id = 'svgedit';
                iframe.scrolling = 'no';
                iframe.onload = function() {
                    var svgCanvas = new embedded_svg_edit(iframe);

                    dialog.dialog({
                        width: 700
                        , height: 500
                        , modal: true
                        , open: function(event, ui) {

                            var insertButton = jQuery(document.createElement('input'));
                            insertButton.attr('type', 'button');
                            insertButton.attr('value', 'insert');
                            insertButton.click(function() {
                                //window.console.debug('insert clicked');
                                svgCanvas.getSvgString()(function(data, error) {
                                    data = data.replace(/\n/g, '');
                                    data = '<!-- 댓글 한글 검사 통과용 주석 -->' + data;
                                    //window.console.debug(data);
                                    textarea.text(data);
                                    dialog.dialog('close');
                                });
                            });
                            dialog.before(insertButton);

                            var frame = jQuery(iframe);
                            frame.width('100%');
                            frame.height(dialog.innerHeight() - 50);
                            frame.css('overflow', 'none');

                            var doc = iframe.contentWindow.document;
                            var mainButton = doc.getElementById('main_button');
                            if (mainButton) {
                                mainButton.style.display = 'none';
                            }
                        }
                        , close: function(event, ui) {
                            dialog.remove();
                        }
                    });
                };

                dialog.append(iframe);

            });

            submitbtn.before(svgbtn);
        });
    });


}

jQuery(document).ready(function() {

    burn1ngk0re_svgedit_init();

});
