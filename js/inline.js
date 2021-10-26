
function jqEvents() {
    if (localStorage.getItem('lang')) {
        if (localStorage.getItem('lang') != $("input[name='lang']").val()) {
            if (localStorage.getItem('lang') == 'en') { window.location = 'index.html'; }
            else { window.location = 'index_ru.html'; }
        }
    }
    if (localStorage.getItem('mac_file')) { mac_file = localStorage.getItem('mac_file'); $('#mac_file').val(mac_file); }
    if (localStorage.getItem('keep_file') == 1) { $('#keep_file').prop('checked', true); }
    else if (localStorage.getItem('keep_file') == 0) { $('#keep_file').prop('checked', false); }
    if (localStorage.getItem('logo_file') == 1) { $('#logo_file').prop('checked', true); }
    else if (localStorage.getItem('logo_file') == 0) { $('#logo_file').prop('checked', false); }
    if (localStorage.getItem('plist_order') == 1) { plistOrder = 1; togglePlistOrder(); }
    else { plistOrder = 0; }
    if (localStorage.getItem('selLogo')) { var selLogo = localStorage.getItem('selLogo'); $(".sel_logos option").each(function () { if ($(this).val() == selLogo) { $(this).attr('selected', 'selected'); } }); }
    if (localStorage.getItem('fileArray')) {
        var fileArray = Number(localStorage.getItem('fileArray')); for (var i = 1; i < fileArray; i++) {
            fileNr = i + 1; $('#file_container').append('<div id="file' + fileNr + '" class="file_field" style="padding-top: 5px;"> \
     <label class="file_label" for="file[]" style="margin-left: 10px;">File: </label> \
     <input name="file[]" type="file" class="file" /> \
    </div>');
        }
    }
    if (localStorage.getItem('urlArray')) {
        var urlArray = JSON.parse(localStorage.getItem('urlArray')); $('#1').find('input').val(urlArray[0]); for (var i = 1; i < urlArray.length; i++) {
            urlNr = i + 1; if ($("input[name='lang']").val() == 'ru') { linkText = 'Ссылка на плейлист M3U или TXT '; }
            else { linkText = 'M3U or TXT playlist URL'; }
            $('#url_container').append('<div id="' + urlNr + '" class="url_field" style="padding-top: 5px;"> \
     <label class="url_label" for="url'+ urlNr + '">URL: </label> \
     <input class="url" name="url'+ urlNr + '" type="search" size="40" placeholder="' + linkText + '" onfocus="this.placeholder = """ onblur="this.placeholder = "' + linkText + '""/> \
    </div>'); $('#' + urlNr).find('input').val(urlArray[i]);
        }
    }
    var options = {
        target: '#boxContent', url: '../scripts/up_file_multi.php', success: function (data) {
            mac_file = $('#mac_file').val(); localStorage.setItem('mac_file', mac_file); keep_file = $('#keep_file').is(':checked'); logo_file = $('#logo_file').is(':checked'); if (keep_file) { localStorage.setItem('keep_file', 1); }
            else { localStorage.setItem('keep_file', 0); }
            if (logo_file) { localStorage.setItem('logo_file', 1); }
            else { localStorage.setItem('logo_file', 0); }
            var selCountry = $('#file_country option:selected').val(); localStorage.setItem('selCountry', selCountry); var selLogo = $('#file_logo option:selected').val(); localStorage.setItem('selLogo', selLogo); if ($.trim(data) == 'MAC address is not found!' || $.trim(data) == 'MAC address is not activated!' || $.trim(data) == 'MAC адрес не активирован!' || $.trim(data) == 'MAC адрес не найден!') { $('#explanationBox').show(); }
            if (data.indexOf('reCaptcha') != -1) { $('#captchaBox').show(); }
            if (pinCheck(data, 'pin_file')) {
                if (data.indexOf('MAC PIN') != -1 && sessionStorage.getItem("pinRetry")) {
                    if (localStorage.getItem("lang") == "ru") { $('#boxContent').html(data + "<br />" + "Осталось попыток: " + (4 - Number(sessionStorage.getItem("pinRetry")))); }
                    else { $('#boxContent').html(data + "<br />" + " Attempts remaining: " + (4 - Number(sessionStorage.getItem("pinRetry")))); }
                }
                else { $('#boxContent').html(data); var fileCount = 0; $.each($('.file_field input'), function (index, value) { if (value.files.length > 0) { fileCount++; } }); localStorage.setItem('fileArray', fileCount); addUrl(fileCount); }
            }
        }, beforeSubmit: function (arr) {
            $('#captchaBox').hide(); $('#messageBox').show(); if ($("input[name='lang']").val() == 'ru') { $('#boxContent').html('Загружается...'); }
            else { $('#boxContent').html('Uploading...'); }
        }, error: function (data) { }
    }; $('#file_form').on('submit', function (event) {
        event.preventDefault(); fileCount = 0; $.each($('.file_field input'), function (index, value) { if (value.files.length > 0) { fileCount++; } }); if (fileCount) { $(this).ajaxSubmit(options); }
        else { addUrl(0); }
    }); $('#reset_form').submit(function (event) {
        $.post('../scripts/reset_list.php', $("#reset_form").serialize(), function (data) {
            $('#captchaBox').hide(); $('#messageBox').show(); if (pinCheck(data, 'pin_reset')) { $('#boxContent').html(data); }
            if (data.indexOf('reCaptcha') != -1) { $('#captchaBox').show(); }
        }); event.preventDefault();
    }); if ($('.url_field').length == 1) { $('#less_url').hide(); }
    $('#orderButton').click(function () { togglePlistOrder(); plistOrder = 1 - plistOrder; localStorage.setItem('plist_order', plistOrder); }); moreLessButtons(); $('#lang').click(function (event) {
        if ($('#lang').text() == 'English') { localStorage.setItem('lang', 'en'); }
        else { localStorage.setItem('lang', 'ru'); }
    })
}
function moreLessButtons() {
    $('#more_url, #less_url, #more_file, #less_file').unbind('click'); $('#more_url').click(function () {
        var urlNr = $('.url_field').length + 1; if (urlNr > 10) { $('#more_url').hide(); return; }
        if ($("input[name='lang']").val() == 'ru') { linkText = 'Ссылка на плейлист M3U или TXT '; }
        else { linkText = 'M3U or TXT playlist URL'; }
        $('#url_container').append('<div id="' + urlNr + '" class="url_field" style="padding-top: 5px;"> \
    <label class="url_label" for="url'+ urlNr + '">URL: </label> \
    <input class="url" name="url'+ urlNr + '" type="search" size="40" placeholder="' + linkText + '" onfocus="this.placeholder = """ onblur="this.placeholder = "' + linkText + '""/> \
   </div>'); if ($('.url_field').length == 1) { $('#less_url').hide(); }
        else { $('#less_url').show(); }
    }); $('#less_url').click(function () {
        var urlNr = $('.url_field').length; if (urlNr > 1) { $('#' + urlNr).remove(); }
        if ($('.url_field').length == 1) { $('#less_url').hide(); }
        else { $('#less_url').show(); }
        $('#more_url').show();
    }); if ($('.file_field').length == 1) { $('#less_file').hide(); }
    $('#more_file').click(function () {
        var fileNr = $('.file_field').length + 1; if (fileNr > 10) { $('#more_file').hide(); return; }
        $('#file_container').append('<div id="file' + fileNr + '" class="file_field" style="padding-top: 5px;"> \
    <label class="file_label" for="file[]" style="margin-left: 10px;">File: </label> \
    <input name="file[]" type="file" class="file" /> \
   </div>'); if ($('.file_field').length == 1) { $('#less_file').hide(); }
        else { $('#less_file').show(); }
    }); $('#less_file').click(function () {
        var fileNr = $('.file_field').length; if (fileNr > 1) { $('#file' + fileNr).remove(); }
        if ($('.file_field').length == 1) { $('#less_file').hide(); }
        else { $('#less_file').show(); }
        $('#more_file').show();
    });
}
function togglePlistOrder() { plist1Contents = $('#td_plist1>div'); plist2Contents = $('#td_plist2>div'); plist1Buttons = $('#button_cell1>div'); plist2Buttons = $('#button_cell2>div'); $('#td_plist1').html(plist2Contents); $('#td_plist2').html(plist1Contents); $('#button_cell1').html(plist2Buttons); $('#button_cell2').html(plist1Buttons); moreLessButtons(); }
function addUrl(fileCount) {
    if (fileCount < 1) { localStorage.removeItem('fileArray'); }
    $('#captchaBox').hide(); mac_file = $('#mac_file').val(); keep_file = $('#keep_file').is(':checked'); logo_file = $('#logo_file').is(':checked'); var url_count = $('.url_field').length; var urlArray = []; for (var i = 0; i < url_count; i++) { if ($('#' + (i + 1)).find('input').val().trim() != '') { urlArray.push($('#' + (i + 1)).find('input').val()); } }
    url_count = urlArray.length; if (urlArray.length < 1) {
        if (!fileCount) {
            $('#messageBox').show(); if ($("input[name='lang']").val() == 'ru') { $('#boxContent').html('Добавьте файл или ссылку!'); }
            else { $('#boxContent').html('Please add File or URL!'); }
        }
        localStorage.removeItem('urlArray'); return;
    }
    else { localStorage.setItem('urlArray', JSON.stringify(urlArray)); }
    localStorage.setItem('mac_file', mac_file); if (keep_file) { localStorage.setItem('keep_file', 1); }
    else { localStorage.setItem('keep_file', 0); }
    if (logo_file) { localStorage.setItem('logo_file', 1); }
    else { localStorage.setItem('logo_file', 0); }
    $('#messageBox').show(); if ($("input[name='lang']").val() == 'ru') { $('#boxContent').html('Добавляется...'); }
    else { $('#boxContent').html('Adding...'); }
    $.post('../scripts/up_url_only.php', $("#file_form").serialize() + "&url_count=" + url_count + "&file_selected=" + fileCount + "&plist_order=" + plistOrder, function (data) {
        if ($.trim(data) == 'MAC address is not found!' || $.trim(data) == 'MAC address is not activated!' || $.trim(data) == 'MAC адрес не активирован!' || $.trim(data) == 'MAC адрес не найден!') { $('#explanationBox').show(); }
        if (pinCheck(data, 'pin_file')) {
            if (data.indexOf('MAC PIN') != -1 && sessionStorage.getItem("pinRetry")) {
                if (localStorage.getItem("lang") == "ru") { $('#boxContent').html(data + "<br />" + "Осталось попыток: " + (4 - Number(sessionStorage.getItem("pinRetry")))); }
                else { $('#boxContent').html(data + "<br />" + " Attempts remaining: " + (4 - Number(sessionStorage.getItem("pinRetry")))); }
            }
            else { $('#boxContent').html(data); }
        }
        if (data.indexOf('reCaptcha') != -1) { $('#captchaBox').show(); }
    }).error(function (xhr, status, error) { }); var selCountry = $('#file_country option:selected').val(); localStorage.setItem('selCountry', selCountry); var selLogo = $('#file_logo option:selected').val(); localStorage.setItem('selLogo', selLogo);
}
function getCountries() { $.get('../converter/countries.php', function (data) { $('.sel_countries').html(data); if (localStorage.getItem('selCountry')) { var selCountry = localStorage.getItem('selCountry'); $(".sel_countries option").each(function () { if ($(this).val() == selCountry) { $(this).attr('selected', 'selected'); } }); } }); }
function pinCheck(data, input) {
    if (data.indexOf('Enter MAC PIN') != -1 || data.indexOf('Введите MAC PIN') != -1) {
        if (sessionStorage.getItem('pinRetry')) { pinRetry = Number(sessionStorage.getItem('pinRetry')); if (pinRetry >= 3) { $('#' + input).val(''); $('#' + input).hide(); $('#' + input + '_text').hide(); $('#boxContent').html('Your IP is reported for ban!'); $('#explanationBox').show(); $.post('ban/ban_ip.php', { mac: mac_file }, function (data) { }); return false; } }
        else { pinRetry = 0; }
        fadeSpeed = 250; $('#' + input).val(''); $('#' + input).show(); $('#' + input + '_text').show(); pinRetry++; sessionStorage.setItem('pinRetry', pinRetry); return true;
    }
    else { sessionStorage.removeItem('pinRetry'); return true; }
}
if (document.cookie.indexOf("captcha") == -1) { var onloadCallback = function () { grecaptcha.render('captchaBox', { 'sitekey': '6LdMEwgUAAAAAOs4QVBXxVPgp2wbCsWhKjD5Xk33', 'callback': verifyCallback, 'theme': 'light' }); }; var verifyCallback = function (token) { $('.captcha_input').html('<input type="hidden" name="g-recaptcha-token" value="' + token + '">'); }; }
$(document).ready(function () { document.cookie = "origin=valid;path=/"; getCountries(); jqEvents(); });