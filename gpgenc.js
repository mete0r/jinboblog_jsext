function gpgenc_burn1ngk0re_init() {

    function onEntryCommentLoaded(entryComment) {
        var pubkey_elem = document.getElementById('gpg-pubkey');
        if (pubkey_elem == undefined) {
            return;
        }
        var ascii_armored_pubkey = pubkey_elem.textContent;
        var gpgpubkey = new getPublicKey(ascii_armored_pubkey);

        function encode_utf8( s ) {
          return unescape( encodeURIComponent( s ) );
        }

        function encrypt_text(gpgpubkey, text) {
            var keytyp = 0; // 0=RSA, 1=Elgamal
            if (gpgpubkey.type == 'RSA') {
                keytyp = 0;
            } else if (gpgpubkey.type == 'ELGAMAL') {
                keytyp = 1;
            }
            var content = encode_utf8(text);
            return doEncrypt(gpgpubkey.keyid, keytyp, gpgpubkey.pkey, content);
        }

        entryComment = jQuery(entryComment);
        var textarea = entryComment.find('textarea[name="comment"]');
        var cleartext = entryComment.find('div.comment-plaintext');
        if (cleartext.length == 0) {
            cleartext = document.createElement('div');
            cleartext = jQuery(cleartext);
            cleartext.addClass('comment-plaintext');
            cleartext.addClass('hidden');
            cleartext.appendTo(textarea.parent());
        }

        var buttons = entryComment.find('.buttons');
        var submitbtn = buttons.find('input[type="submit"]');

        var encbtn = jQuery(document.createElement('input'));
        var restorebtn = jQuery(document.createElement('input'));
        encbtn.attr('type', 'button');
        encbtn.attr('value', '댓글 암호화');
        encbtn.click(function(){
            var text = textarea.val();
            cleartext.text(text);
            var ciphertext = encrypt_text(gpgpubkey, text);
            textarea.val('다음 내용은 블로그 주인만 열어볼 수 있도록 PGP 암호화되었습니다:\n'+ciphertext);
            textarea.width('32em');
            textarea.css('font-family', 'monospace');
            textarea.attr('readonly', 'readonly');
            encbtn.addClass('hidden');
            restorebtn.removeClass('hidden');
        });
        restorebtn.attr('type', 'button');
        restorebtn.attr('value', '복원');
        restorebtn.addClass('hidden');
        restorebtn.click(function(){
            var text = cleartext.text();
            textarea.val(text);
            textarea.removeAttr('readonly');
            encbtn.removeClass('hidden');
            restorebtn.addClass('hidden');
        });
        submitbtn.before(encbtn);
        encbtn.after(restorebtn);
    }
    jinboblog_jsext.on('EntryCommentLoaded', onEntryCommentLoaded);

    var entryComments = jQuery('div.comments').parent();
    entryComments.each(function(index, elem){
            onEntryCommentLoaded(elem);
    });
}

jQuery(document).ready(function() {
    gpgenc_burn1ngk0re_init();

});
