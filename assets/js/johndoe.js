/*!
=========================================================
* JohnDoe Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
});

// protfolio filters
$(window).on("load", function() {
    var t = $(".portfolio-container");
    t.isotope({
        filter: ".new",
        animationOptions: {
            duration: 750,
            easing: "linear",
            queue: !1
        }
    }), $(".filters a").click(function() {
        $(".filters .active").removeClass("active"), $(this).addClass("active");
        var i = $(this).attr("data-filter");
        return t.isotope({
            filter: i,
            animationOptions: {
                duration: 750,
                easing: "linear",
                queue: !1
            }
        }), !1
    });
});


function(){
    var canvas = document.getElementById('c'),

        /** @type {CanvasRenderingContext2D} */
        ctx = canvas.getContext('2d'),
        width = 500,
        height = 200,

        half_width = width >> 1,
        half_height = height >> 1,
        size = width * (height + 2) * 2,

        delay = 30,
        oldind = width,
        newind = width * (height + 3),

        riprad = 3,
        ripplemap = [],
        last_map = [],
        ripple,
        texture,

        line_width = 20,
        step = line_width * 2, 
        count = height / line_width;

    canvas.width = width;
    canvas.height = height;

    /*
     * Water ripple demo can work with any bitmap image
     */
    with (ctx) {
        fillStyle = '#a2ddf8';
        fillRect(0, 0, width, height);

        fillStyle = '#07b';
        save();
        rotate(-0.785);
        for (var i = 0; i < count; i++) {
            fillRect(-width, i * step, width * 3, line_width);
        }

        restore();
    }

    texture = ctx.getImageData(0, 0, width, height);
    ripple = ctx.getImageData(0, 0, width, height);

    for (var i = 0; i < size; i++) {
        last_map[i] = ripplemap[i] = 0;
    }

    /**
     * Main loop
     */
    function run() {
        newframe();
        ctx.putImageData(ripple, 0, 0);
    }

    /**
     * Disturb water at specified point
     */
    function disturb(dx, dy) {
        dx <<= 0;
        dy <<= 0;

        for (var j = dy - riprad; j < dy + riprad; j++) {
            for (var k = dx - riprad; k < dx + riprad; k++) {
                ripplemap[oldind + (j * width) + k] += 128;
            }
        }
    }

    /**
     * Generates new ripples
     */
    function newframe() {
        var a, b, data, cur_pixel, new_pixel, old_data;

        var t = oldind; oldind = newind; newind = t;
        var i = 0;

        // create local copies of variables to decrease
        // scope lookup time in Firefox
        var _width = width,
            _height = height,
            _ripplemap = ripplemap,
            _last_map = last_map,
            _rd = ripple.data,
            _td = texture.data,
            _half_width = half_width,
            _half_height = half_height;

        for (var y = 0; y < _height; y++) {
            for (var x = 0; x < _width; x++) {
                var _newind = newind + i, _mapind = oldind + i;
                data = (
                    _ripplemap[_mapind - _width] + 
                    _ripplemap[_mapind + _width] + 
                    _ripplemap[_mapind - 1] + 
                    _ripplemap[_mapind + 1]) >> 1;

                data -= _ripplemap[_newind];
                data -= data >> 5;

                _ripplemap[_newind] = data;

                //where data=0 then still, where data>0 then wave
                data = 1024 - data;

                old_data = _last_map[i];
                _last_map[i] = data;

                if (old_data != data) {
                    //offsets
                    a = (((x - _half_width) * data / 1024) << 0) + _half_width;
                    b = (((y - _half_height) * data / 1024) << 0) + _half_height;

                    //bounds check
                    if (a >= _width) a = _width - 1;
                    if (a < 0) a = 0;
                    if (b >= _height) b = _height - 1;
                    if (b < 0) b = 0;

                    new_pixel = (a + (b * _width)) * 4;
                    cur_pixel = i * 4;

                    _rd[cur_pixel] = _td[new_pixel];
                    _rd[cur_pixel + 1] = _td[new_pixel + 1];
                    _rd[cur_pixel + 2] = _td[new_pixel + 2];
                }

                ++i;
            }
        }
    }

    canvas.onmousemove = function(/* Event */ evt) {
        disturb(evt.offsetX || evt.layerX, evt.offsetY || evt.layerY);
    };

    setInterval(run, delay);

    // generate random ripples
    var rnd = Math.random;
    setInterval(function() {
        disturb(rnd() * width, rnd() * height);
    }, 700);
})();
