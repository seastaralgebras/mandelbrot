// stuff

var math = require('mathjs');

/*
var c;
var z;
var x;
*/

function modulus(z) {
    return math.multiply(z, math.conj(z));
}

function julia_iteration(z, c) {
    return math.add(math.multiply(z,z), c);
}

function div_time(c, max_n) {
    let threshold = 10;
    let z = c;
    for (let i = 0; i < max_n; i++) {
        z = julia_iteration(z, c);
        if (modulus(z) > threshold) {
            return i;
        }
    }
    return max_n;
}

function div_fraction(c, max_n) {
    return 1-math.divide(math.log10(div_time(c, max_n)+1), math.log10(max_n));
}

function dec_to_hex(x) {
    if (x > 255) {
        return "ff";
    } else if (x < 0) {
        return "00";
    } else {
        let n = math.floor(x);
        if (n < 16) {
            return "0"+n.toString(16);
        } else {
            return n.toString(16);
        }
    }
}

function to_color(t) {
    let r = math.floor(math.multiply(t, 0));
    let g = math.floor(math.multiply(t, 160));
    let b = math.floor(math.multiply(t, 255));
    return [r, g, b, 255];
}


function to_color_string(t) {
    let r = math.multiply(t, 0);
    let g = math.multiply(t, 160);
    let b = math.multiply(t, 255);
    let r_hex = dec_to_hex(r);
    let g_hex = dec_to_hex(g);
    let b_hex = dec_to_hex(b);
    return "#" + r_hex + g_hex + b_hex;
}


function matrix_generator(width_px) {
    let x_c = -0.5;
    let y_c = 0;
    let width = 3.2;
    let k_step = width/(width_px);
    let x = x_c - width/2;
    let y = y_c - width/2;
    let square = [];
    let row = [];
    for (j = 0; j < width_px; j++) {
        row = [];
        for (i = 0; i < width_px; i++) {
            let thing = math.complex(1,1);
            let point = math.complex(x+i*k_step, y+j*k_step);
            row[i] = point;
        }
        square[j] = row;
    }
    return square;
}


function mandelbrot_set(width_px, max_iterations) {
    let square = matrix_generator(width_px);
    let pixels = [];
    for (j = 0; j < width_px; j++) {
        let row = [];
        for (i = 0; i < width_px; i++) {
            row[i] = to_color_string(div_fraction(square[j][i], max_iterations));
        }
        pixels[j] = row;
    }
    return pixels;
}

function mandelbrotImageData(width_px, max_iterations) {
    let square = matrix_generator(width_px);
    let pixels = [];
    for (j = 0; j < width_px; j++) {
        for (i = 0; i < width_px; i++) {
            let point = square[j][i];
            let color = to_color(div_fraction(point, max_iterations));
            pixels = pixels.concat(color);
        }
    }
    return pixels;
}



function drawMandelbrot(canvas) {
    var ctx = canvas.getContext("2d");
    var width_px = canvas.width;
    let mandy = mandelbrot_set(width_px, 100);
    for (j = 0; j < width_px; j++) {
        for (i = 0; i < width_px; i++) {
            ctx.fillStyle = mandy[j][i];
            ctx.fillRect(i, j, 1, 1);
        }
    }
}
