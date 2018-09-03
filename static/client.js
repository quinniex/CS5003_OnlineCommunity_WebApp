/**
 * This client side js helps navigate between the different city pages on the Home. 
 */ 
var city;
(function () {
    $(function () {
        $( document ).ready(function() {
            $(`.userPosts, .otherApis`).hide();
            $('.homeImages').show();
            var canvas = d3.select("#myDiv")
                .append("svg")
                .attr("width", 400)
                .attr("height", 405)
        });

        $("#home, #logo").click(function () {
            $("#myNavbar .active").removeClass("active");
            $(this).addClass("active");
            $(`.userPosts, .otherApis`).hide();
            $('.homeImages').show();
            return false;
        });

        $("#standrews").click(function () {
            $(this).addClass("active");
            city = "St Andrews";
            console.log(city);
            cityPage();
            startSvg(city);
        });

        $("#cupar").click(function () {
            $(this).addClass("active");
            city = "Cupar";
            console.log(city);
            cityPage();
            startSvg(city);

        });

        $("#dundee").click(function () {
            $(this).addClass("active");
            city = "Dundee";
            console.log(city);
            cityPage();
            startSvg(city);

        });

        $("#newport").click(function () {
            $(this).addClass("active");
            city = "Newport";
            console.log(city);
            cityPage();
            startSvg(city);

        });
    });

    function cityPage(){
        $("#myNavbar .active").removeClass("active");
        $(`.userPosts, .otherApis`).show();
        $('.homeImages').hide();
        return false;
    }
}());
