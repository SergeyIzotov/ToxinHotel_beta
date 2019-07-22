$('.my-datepicker').datepicker({
})

$('.data-dropdown-datepicker').datepicker({
    minDate: new Date(),
    dateFormat: 'd M',
})

var now = new Date();
var endDate = new Date(now.getTime() + 365*24*60*60*1000)
var $start = $('#start'),
    $end = $('#end');
var $datepickers = $('.datepickers');

$datepickers.datepicker({
    language: 'ru',
    // offset: ,

    minDate: now,
    maxDate: endDate,
    multipleDatesSeparator: "-",
    range: true,
    onSelect: function (fd, date) {
        $end.data('datepicker')
            .update('selectedDates', $start.data('datepicker').selectedDates);
        var start = fd.split('-')[0]
        var end = fd.split('-')[1];
        if (end) {
            $start.val(start);
            $end.val(end);
        } else {
            $end.val('')
        }
        console.log($start.data('datepicker'));
    }
})