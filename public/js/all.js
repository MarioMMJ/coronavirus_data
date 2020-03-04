function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}



$(document).ready(function() {
    $('.count').each(function() {
        var $this = $(this),
            countTo = $this.attr('data-count');
        $({ countNum: $this.text() }).animate({
            countNum: countTo
        }, {
            duration: randomNumber(1000, 2000),
            easing: 'swing',
            step: function() {
                $this.text(Math.floor(this.countNum));
            },
            complete: function() {
                $this.text(this.countNum);
                //alert('finished');
            }

        });
    });
});