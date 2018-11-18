$(function () {
    $('.hero-carousel').slick({
        prevArrow: $(".prev"),
        nextArrow: $(".next")
    });
    $("#scroll-down").on('click', function () {
        var heroBottom = $(".hero").offset().top + $(".hero").outerHeight(true);
        $("HTML, BODY").animate({ scrollTop: heroBottom }, 1000);
    });
});

