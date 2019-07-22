$("input[name='guest']").guest({
    categoryNames: ["Взрослые", "Дети", "Младенцы"],
    categoryValues: false,
    minValue: 0,
    maxValue: 10,
    closeOnOutsideClick: false,
    showText: true,
    delimiter: ", ",
    align: "left",
    fade: true,
    useDisplay: false,
    showZero: false,
});