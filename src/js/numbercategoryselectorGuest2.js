/*
 * numbercategoryselector.js
 * Author & copyright (c) 2017: Sakri Koskimies
 *
 * MIT license
 */
(function ($) {

        $.fn.guest2 = function (options) {

            $g2ginput = $(this);
            $g2goriginalPlaceholder = $g2ginput.attr("placeholder");

            var settings = $.extend({
                // Defaults.
                categoryNames: ["Adults", "Children"],
                categoryValues: false,
                minValue: 0,
                maxValue: 10,
                closeOnOutsideClick: true,
                showText: true,
                delimiter: ", ",
                align: "left",
                fade: true,
                useDisplay: true,
                showZero: false,
                callback: function(values){}
            }, options);

            if (!settings.categoryValues) {
                settings.categoryValues = newFilledArray(settings.categoryNames.length, 0);
            }

            $g2gparent = createHTML();

            if (settings.closeOnOutsideClick) {
                $(document).mouseup(function (e) {
                    if (!$g2ginput.is(e.target) && !$g2gparent.is(e.target) && $g2gparent.has(e.target).length === 0 && !$("div.guest2.display").is(e.target) && $("div.guest2.display").has(e.target).length === 0) {
                        if (settings.fade) {
                            $g2gparent.fadeOut(200);
                        } else {
                            $g2gparent.hide();
                        }
                    }
                });
            }

            $(this).click(function () {
                switchSelector();
            });

            $(window).resize(function () {
                setPositions();

            });

            function doCallback() {
                if (typeof options.callback == 'function') {
                    var callbackResult = {};
                    for ($g2gi = 0; $g2gi < settings.categoryNames.length; $g2gi++) {
                        callbackResult[settings.categoryNames[$g2gi]] = settings.categoryValues[$g2gi];
                    }
                    options.callback.call(this, callbackResult);
                }
            }

            function setPositions() {
                switch (settings.align) {
                    case "left":
                        $g2gparent.css("top", $g2ginput.position().top + $g2ginput.outerHeight());
                        $g2gparent.css("left", $g2ginput.position().left);
                        break;

                }
                if (settings.useDisplay) {
                    $g2gdisplay = $("div.guest2.display");
                    $g2gdisplay.css("top", $g2ginput.position().top + 1);
                    $g2gdisplay.css("left", $g2ginput.position().left + 1);
                    $g2gdisplay.css("width", $g2ginput.width() - 1);
                    $g2gdisplay.css("height", $g2ginput.height() - 1);
                }
            }

            $("a.guest2.button.plus").click(function () {
                $g2gcategory = $(this).attr("category");
                if (settings.categoryValues[$g2gcategory] < settings.maxValue) {
                    settings.categoryValues[$g2gcategory]++;
                    $g2gnum = settings.categoryValues[$g2gcategory];
                    $("div.guest2.value[category='" + $g2gcategory + "']").text($g2gnum);
                    doCallback();
                    if(settings.categoryValues[$g2gcategory] == settings.maxValue){
                        $(this).addClass("inactive");
                    }else{
                        $(this).removeClass("inactive");
                    }
                    if(settings.categoryValues[$g2gcategory] > settings.minValue){
                        $("a.guest2.button.minus[category='"+$g2gcategory+"']").removeClass("inactive");
                    }else{
                        $("a.guest2.button.minus[category='"+$g2gcategory+"']").addClass("inactive");
                    }
                }
                if (settings.showText) {
                    if (!settings.useDisplay) {
                        updateText();
                    } else {
                        updateElement();
                    }
                }
                return false;
            });

            $("a.guest2.button.minus").click(function () {
                $g2gcategory = $(this).attr("category");
                if (settings.categoryValues[$g2gcategory] > settings.minValue) {
                    settings.categoryValues[$g2gcategory]--;
                    $g2gnum = settings.categoryValues[$g2gcategory];
                    $("div.guest2.value[category='" + $g2gcategory + "']").text($g2gnum);
                    doCallback();
                    if(settings.categoryValues[$g2gcategory] == settings.minValue){
                        $(this).addClass("inactive");
                    }else{
                        $(this).removeClass("inactive");
                    }
                    if(settings.categoryValues[$g2gcategory] < settings.maxValue){
                        $("a.guest2.button.plus[category='"+$g2gcategory+"']").removeClass("inactive");
                    }else{
                        $("a.guest2.button.plus[category='"+$g2gcategory+"']").addClass("inactive");
                    }
                }
                if (settings.showText) {
                    if (!settings.useDisplay) {
                        updateText();
                    } else {
                        updateElement();
                    }
                }
                return false;
            });

            function updateElement() {
                $g2ginput.val("");
                $g2gdisplay = $("div.guest2.inlinedisplay");
                $g2gdisplay.empty();
                $g2gdisplayelements = 0;
                for ($g2gi = 0; $g2gi < settings.categoryNames.length; $g2gi++) {
                    if (settings.categoryValues[$g2gi] != 0 || settings.showZero) {
                        $g2gdisplayelement = $("<div class='guest2 displayelement'></div>").appendTo($g2gdisplay);
                        $g2gdisplayelement.text(settings.categoryValues[$g2gi] + " " + settings.categoryNames[$g2gi] + ", ");
                        $g2gdisplayelements++;
                    }
                }
                if ($g2gdisplayelements == 0) {
                    $g2ginput.attr("placeholder", $g2goriginalPlaceholder)
                } else {
                    $g2ginput.attr("placeholder", "")
                }
                updateText();
            }

            // function updateText() {
            //     $g2gtext = "";
            //     $g2gadded = 0;
            //     for ($g2gi = 0; $g2gi < settings.categoryNames.length; $g2gi++) {
            //         if (settings.categoryValues[$g2gi] != 0 || settings.showZero) {
            //             if ($g2gadded != 0) {
            //                 $g2gtext += settings.delimiter;
            //             }
            //             $g2gtext += settings.categoryValues[$g2gi] + " " + settings.categoryNames[$g2gi];
            //             $g2gadded++;
            //         }
            //     }
            //     $g2ginput.val($g2gtext);
            // }
            function updateText() {
                $g2gtext = "";
                $g2gadded = 0;
                $g2gsum = 0;
                $gbaby =0;
                $glast = settings.categoryNames.length-1;
                for ($g2gi = 0; $g2gi < settings.categoryNames.length; $g2gi++) {
                    if (settings.categoryValues[$g2gi] != 0 || settings.showZero) {

                        $g2gsum += settings.categoryValues[$g2gi];
                        $g2gadded++;
                    }
                }
                $gbaby+= settings.categoryValues[$glast]
                if($gbaby != 0){
                    //$gtext+=$gsum + " гостя, " + $baby + " младенцы";   Если младенец != гость
                    $g2gtext+=$g2gsum-$gbaby + " гостя, " + $gbaby + " младенцы";
                }else{
                    $g2gtext += $g2gsum + " гостя";}

                if ($g2gsum == 0) {
                    $g2ginput.val($g2goriginalPlaceholder);
                    $(".NCSG.reset").hide();
                } else {
                    $g2ginput.val($g2gtext);
                    $(".NCSG.reset").show();
                }

            }


            function createHTML() {

                $g2ginput.attr("type", "text");
                if (settings.useDisplay) {

                    $g2ginput.attr("placeholder", "");

                    $g2gdisplay = $("<div class='guest2 display'></div>").prependTo("body");
                    $g2gdisplay.css("top", $g2ginput.position().top + 1);
                    $g2gdisplay.css("left", $g2ginput.position().left + 1);
                    $g2gdisplay.css("width", $g2ginput.width() - 1);
                    $g2gdisplay.css("height", $g2ginput.height() - 1);

                    $("<div class='guest2 inlinedisplay'></div>").prependTo($g2gdisplay);

                    $g2gdisplay.click(function () {
                        switchSelector();
                    });
                }


                $g2gparent = $("<div class='guest2 parent'></div>").prependTo("body").hide();

                switch (settings.align) {
                    case "left":
                        $g2gparent.css("top", $g2ginput.position().top + $g2ginput.outerHeight());
                        $g2gparent.css("left", $g2ginput.position().left);
                        break;

                }

                for ($g2gi = 0; $g2gi < settings.categoryNames.length; $g2gi++) {
                    $g2gcategory = $("<div class='guest2 category'></div>").appendTo($g2gparent);
                    $g2gtext = $("<div class='guest2 text'></div>").appendTo($g2gcategory);
                    $g2gname = $("<div class='guest2 name' category='" + $g2gi + "'>&nbsp;" + settings.categoryNames[$g2gi] + "</div>").appendTo($g2gtext);
                    $g2gbuttons = $("<div class='guest2 buttons'></div>").appendTo($g2gcategory);
                    $g2gbutton_minus = $("<a href='' class='guest2 button minus' category='" + $g2gi + "'>&#8211;</a>").appendTo($g2gbuttons);
                    $g2gvalue = $("<div class='guest2 value' category='" + $g2gi + "'>" + settings.categoryValues[$g2gi] + "</div>").appendTo($g2gbuttons);
                    $g2gbutton_plus = $("<a href='' class='guest2 button plus' category='" + $g2gi + "'>&#43;</a>").appendTo($g2gbuttons);

                    if(settings.categoryValues[$g2gi] == settings.maxValue){
                        $g2gbutton_plus.addClass("inactive");
                    }

                    if(settings.categoryValues[$g2gi] == settings.minValue){
                        $g2gbutton_minus.addClass("inactive");
                    }
                }
                $g2gclose = $("<div class='NCSG room'></div><a class='NCSG close' href=''>Применить</a>").appendTo($g2gparent);
                $g2gclose.click(function () {
                    if (settings.fade) {
                        $g2gparent.fadeOut(200);
                    } else {
                        $g2gparent.hide();
                    }
                    return false;
                });
                $g2gzero = $("<div class='NCSG room'></div><a class='NCSG reset' href=''>Очистить</a>").appendTo($g2gparent);
                $g2gzero.click(function() {
                    for ($g2gi = 0; $g2gi < settings.categoryNames.length; $g2gi++) {
                        if (settings.categoryValues[$g2gi] != 0 || settings.showZero) {
                            settings.categoryValues[$g2gi] = 0;
                            $("div.guest2.value[category='" + $g2gi + "']").text("0");
                            $(".guest2.button.minus").addClass("inactive");
                            doCallback();
                        }
                    }
                    updateText();
                    return false;
                });
                if (settings.showText) {
                    if (!settings.useDisplay) {
                        updateText();
                    } else {
                        updateElement();
                    }
                }

                if (settings.useDisplay) {
                    $g2ginput.css("color", "transparent");
                }

                return $g2gparent;
            }




            function switchSelector() {
                if (settings.fade) {
                    $g2gparent.fadeToggle(200);
                } else {
                    $g2gparent.toggle();
                }
            }

            function newFilledArray(len, val) {
                var rv = new Array(len);
                while (--len >= 0) {
                    rv[len] = val;
                }
                return rv;
            }

        }
        ;

    }(jQuery)
)
;