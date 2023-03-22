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

function div_time(z, c, max_n) {
    let threshold = 10;
    let z_temp = z;
    for (let i = 0; i < max_n; i++) {
        z_temp = julia_iteration(z_temp, c);
        if (modulus(z_temp) > threshold) {
            return i;
        }
    }
    return max_n;
}

function div_fraction(z, c, max_n) {
    return 1-math.divide(math.log10(div_time(z, c, max_n)+1), math.log10(max_n));
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
    let x_c = 0;
    let y_c = 0;
    let width = 4.2;
    let k_step = width/(width_px);
    let x = x_c - width/2;
    let y = y_c - width/2;
    let square = [];
    let row = [];
    for (j = 0; j < width_px; j++) {
        row = [];
        for (i = 0; i < width_px; i++) {
            let point = math.complex(x+i*k_step, y+j*k_step);
            row[i] = point;
        }
        square[j] = row;
    }
    return square;
}

function julia_set(width_px, c, max_iterations) {
    let square = matrix_generator(width_px);
    let pixels = [];
    for (j = 0; j < width_px; j++) {
        let row = [];
        for (i = 0; i < width_px; i++) {
            point = square[j][i];
            row[i] = to_color_string(div_fraction(point, c, max_iterations));
        }
        pixels[j] = row;
    }
    return pixels;
}


function mandelbrot_set(width_px, max_iterations) {
    let square = matrix_generator(width_px);
    let pixels = [];
    for (j = 0; j < width_px; j++) {
        let row = [];
        for (i = 0; i < width_px; i++) {
            point = square[j][i];
            row[i] = to_color_string(div_fraction(0, point, max_iterations));
        }
        pixels[j] = row;
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



function drawJulia(canvas, real, imaginary) {
    var c = math.complex(real, imaginary);
    var ctx = canvas.getContext("2d");
    var width_px = canvas.width;
    let julia = julia_set(width_px, c, 100);
    for (j = 0; j < width_px; j++) {
        for (i = 0; i < width_px; i++) {
            ctx.fillStyle = julia[j][i];
            ctx.fillRect(i, j, 1, 1);
        }
    }
}


/*
let width_px = 20;
let n = 50;
let c = math.complex(.5, .5);
let t = div_time(0, c, n);
let mandy = mandelbrot_set(width_px, n);
console.log(t);
*/



/*
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



function drawMandelbrot_alt(canvas) {
    var ctx = canvas.getContext("2d");
    var width_px = canvas.width;
    let n = 100;
    let x_c = -0.5;
    let y_c = 0;
    let width = 3.2;
    let k_step = width/(width_px);
    let x = x_c - width/2;
    let y = y_c - width/2;
    let point = math.complex(x, y);
    for (j = 0; j < width_px; j++) {
        for (i = 0; i < width_px; i++) {
            point = math.complex(x+i*k_step, y+j*k_step);
            ctx.fillStyle = to_color_string(div_fraction(point, n));
            ctx.fillRect(i, j, 1, 1);
        }
    }
}
*/