$(document).ready(function() {
    $('.features .feature').each(function(i) {
        $(this).delay(i * 500).animate({ opacity: 1 }, 1000);
    });
});
