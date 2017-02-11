$(function(){
    $(document).bind('keydown', 'alt+p', function(){
        $("#preview").click();
    });
    $("input").bind('keydown', 'alt+p', function(){
        $("#preview").click();
    });
    $("textarea").bind('keydown', 'alt+p', function(){
        $("#preview").click();
    });

    $(document).bind('keydown', 'alt+h', function(){
        $("#help").click();
        return false;
    });
    $("input").bind('keydown', 'alt+h', function(){
        $("#help").click();
        return false;
    });
    $("textarea").bind('keydown', 'alt+h', function(){
        $("#help").click();
        return false;
    });
    //or since firefox won't let me disable it's own help thing
    $(document).bind('keydown', 'alt+y', function(){
        $("#help").click();
        return false;
    });
    $("input").bind('keydown', 'alt+y', function(){
        $("#help").click();
        return false;
    });
    $("textarea").bind('keydown', 'alt+y', function(){
        $("#help").click();
        return false;
    });
});