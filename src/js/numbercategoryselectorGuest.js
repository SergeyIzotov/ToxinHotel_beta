(function ($) {

        $.fn.guest = function (options) {

            $ginput = $(this);
            $goriginalPlaceholder = $ginput.attr("placeholder");

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
                callback: function (values) {
                }
            }, options);

            if (!settings.categoryValues) {
                settings.categoryValues = newFilledArray(settings.categoryNames.length, 0);
            }

            $gparent = createHTML();

            if (settings.closeOnOutsideClick) {
                $(document).mouseup(function (e) {
                    if (!$ginput.is(e.target) && !$gparent.is(e.target) && $gparent.has(e.target).length === 0
                        && !$("div.guest.display").is(e.target) && $("div.guest.display").has(e.target).length === 0) {
                        if (settings.fade) {
                            $gparent.fadeOut(200);
                        } else {
                            $gparent.hide();
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
                    for ($gi = 0; $gi < settings.categoryNames.length; $gi++) {
                        callbackResult[settings.categoryNames[$gi]] = settings.categoryValues[$gi];
                    }
                    options.callback.call(this, callbackResult);
                }
            }

            function setPositions() {
                switch (settings.align) {
                    case "left":
                        $gparent.css("top", $ginput.position().top + $ginput.outerHeight());
                        $gparent.css("left", $ginput.position().left);
                        break;

                }
                if (settings.useDisplay) {
                    $gdisplay = $("div.guest.display");
                    $gdisplay.css("top", $ginput.position().top + 1);
                    $gdisplay.css("left", $ginput.position().left + 1);
                    $gdisplay.css("width", $ginput.width() - 1);
                    $gdisplay.css("height", $ginput.height() - 1);
                }
            }

            $("a.guest.button.plus").click(function () {
                $gcategory = $(this).attr("category");
                if (settings.categoryValues[$gcategory] < settings.maxValue) {
                    settings.categoryValues[$gcategory]++;
                    $gnum = settings.categoryValues[$gcategory];
                    $("div.guest.value[category='" + $gcategory + "']").text($gnum);
                    doCallback();
                    if (settings.categoryValues[$gcategory] == settings.maxValue) {
                        $(this).addClass("inactive");
                    } else {
                        $(this).removeClass("inactive");
                    }
                    if (settings.categoryValues[$gcategory] > settings.minValue) {
                        $("a.guest.button.minus[category='" + $gcategory + "']").removeClass("inactive");
                    } else {
                        $("a.guest.button.minus[category='" + $gcategory + "']").addClass("inactive");
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

            $("a.guest.button.minus").click(function () {
                $gcategory = $(this).attr("category");
                if (settings.categoryValues[$gcategory] > settings.minValue) {
                    settings.categoryValues[$gcategory]--;
                    $gnum = settings.categoryValues[$gcategory];
                    $("div.guest.value[category='" + $gcategory + "']").text($gnum);
                    doCallback();
                    if (settings.categoryValues[$gcategory] == settings.minValue) {
                        $(this).addClass("inactive");
                    } else {
                        $(this).removeClass("inactive");
                    }
                    if (settings.categoryValues[$gcategory] < settings.maxValue) {
                        $("a.guest.button.plus[category='" + $gcategory + "']").removeClass("inactive");
                    } else {
                        $("a.guest.button.plus[category='" + $gcategory + "']").addClass("inactive");
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
                $ginput.val("");
                $gdisplay = $("div.guest.inlinedisplay");
                $gdisplay.empty();
                $gdisplayelements = 0;
                for ($gi = 0; $gi < settings.categoryNames.length; $gi++) {
                    if (settings.categoryValues[$gi] != 0 || settings.showZero) {
                        $gdisplayelement = $("<div class='guest displayelement'></div>").appendTo($gdisplay);
                        $gdisplayelement.text(settings.categoryValues[$gi] + " " + settings.categoryNames[$gi] + ", ");
                        $gdisplayelements++;
                    }
                }
                if ($gdisplayelements == 0) {
                    $ginput.attr("placeholder", $goriginalPlaceholder)
                } else {
                    $ginput.attr("placeholder", "")
                }
                updateText();
            }

            // function updateText() {
            //     $gtext = "";
            //     $gadded = 0;
            //     for ($gi = 0; $gi < settings.categoryNames.length; $gi++) {
            //         if (settings.categoryValues[$gi] != 0 || settings.showZero) {
            //             if ($gadded != 0) {
            //                 $gtext += settings.delimiter;
            //             }
            //             $gtext += settings.categoryValues[$gi] + " " + settings.categoryNames[$gi];
            //             $gadded++;
            //         }
            //     }
            //     $ginput.val($gtext);
            // }
            function updateText() {
                $gtext = "";
                $gadded = 0;
                $gsum = 0;
                $baby = 0;
                $last = settings.categoryNames.length - 1;
                for ($gi = 0; $gi < settings.categoryNames.length; $gi++) {
                    if (settings.categoryValues[$gi] != 0 || settings.showZero) {

                        $gsum += settings.categoryValues[$gi];
                        $gadded++;

                    }
                }
                $baby += settings.categoryValues[$last]
                if ($baby != 0) {
                    //$gtext+=$gsum + " гостя, " + $baby + " младенцы";   Если младенец != гость
                    $gtext += $gsum - $baby + " гостей, " + $baby + " младенцы";
                } else {
                    $gtext += $gsum + " гостей";
                }

                if ($gsum == 0) {
                    $ginput.val($goriginalPlaceholder);
                    $(".NCSG.reset").hide();
                } else {
                    $ginput.val($gtext);
                    $(".NCSG.reset").show();
                }

            }


            function createHTML() {

                $ginput.attr("type", "text");
                if (settings.useDisplay) {

                    $ginput.attr("placeholder", "");

                    $gdisplay = $("<div class='guest display'></div>").prependTo("body");
                    $gdisplay.css("top", $ginput.position().top + 1);
                    $gdisplay.css("left", $ginput.position().left + 1);
                    $gdisplay.css("width", $ginput.width() - 1);
                    $gdisplay.css("height", $ginput.height() - 1);

                    $("<div class='guest inlinedisplay'></div>").prependTo($gdisplay);

                    $gdisplay.click(function () {
                        switchSelector();
                    });
                }


                $gparent = $("<div class='guest parent'></div>").prependTo("body").hide();

                switch (settings.align) {
                    case "left":
                        $gparent.css("top", $ginput.position().top + $ginput.outerHeight());
                        $gparent.css("left", $ginput.position().left);
                        break;

                }

                for ($gi = 0; $gi < settings.categoryNames.length; $gi++) {
                    $gcategory = $("<div class='guest category'></div>").appendTo($gparent);
                    $gtext = $("<div class='guest text'></div>").appendTo($gcategory);
                    $gname = $("<div class='guest name' category='" + $gi + "'>&nbsp;" + settings.categoryNames[$gi] + "</div>").appendTo($gtext);
                    $gbuttons = $("<div class='guest buttons'></div>").appendTo($gcategory);
                    $gbutton_minus = $("<a href='' class='guest button minus' category='" + $gi + "'>&#8211;</a>").appendTo($gbuttons);
                    $gvalue = $("<div class='guest value' category='" + $gi + "'>" + settings.categoryValues[$gi] + "</div>").appendTo($gbuttons);
                    $gbutton_plus = $("<a href='' class='guest button plus' category='" + $gi + "'>&#43;</a>").appendTo($gbuttons);

                    if (settings.categoryValues[$gi] == settings.maxValue) {
                        $gbutton_plus.addClass("inactive");
                    }

                    if (settings.categoryValues[$gi] == settings.minValue) {
                        $gbutton_minus.addClass("inactive");
                    }
                }
                $gclose = $("<div class='NCSG room'></div><a class='NCSG close' href=''>Применить</a>").appendTo($gparent);
                $gclose.click(function () {
                    if (settings.fade) {
                        $gparent.fadeOut(200);
                    } else {
                        $gparent.hide();
                    }
                    return false;
                });
                $gzero = $("<div class='NCSG room'></div><a class='NCSG reset' href=''>Очистить</a>").appendTo($gparent);
                $gzero.click(function () {
                    for ($gi = 0; $gi < settings.categoryNames.length; $gi++) {
                        if (settings.categoryValues[$gi] != 0 || settings.showZero) {
                            settings.categoryValues[$gi] = 0;
                            $("div.guest.value[category='" + $gi + "']").text("0");
                            $(".guest.button.minus").addClass("inactive");
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
                    $ginput.css("color", "transparent");
                }

                return $gparent;
            }


            function switchSelector() {
                if (settings.fade) {
                    $gparent.fadeToggle(200);
                } else {
                    $gparent.toggle();
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