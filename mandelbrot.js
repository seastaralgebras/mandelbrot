var math = require('mathjs');



function modulus(z) {
    return math.multiply(z, math.conj(z));
}

function julia_iteration(z, c) {
    return math.add(math.multiply(z,z), c);
}

function div_time(z, c, max_n) {
    let threshold = 3;
    let z_temp = z;
    for (let i = 0; i < max_n; i++) {
        z_temp = julia_iteration(z_temp, c);
        if (modulus(z_temp) > threshold) {
            return i;
        }
    }
    return max_n;
    //return 0;
}

function div_fraction(z, c, max_n) {
    //return 1-math.divide(math.log10(div_time(z, c, max_n)+1), math.log10(max_n));
    return math.divide(math.log10(div_time(z, c, max_n)+1), math.log10(max_n));
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


function to_color_rgb(t) {
    let r = math.multiply(t, 255);
    let g = math.multiply(t, 96);
    let b = math.multiply(t, 126);
    let r_hex = dec_to_hex(r);
    let g_hex = dec_to_hex(g);
    let b_hex = dec_to_hex(b);
    return "#" + r_hex + g_hex + b_hex;
}

function to_color_hsl(t) {
    let h_0 = 240;
    let h_1 = 120;
    let h = math.floor(h_0 + math.multiply(t, h_1-h_0))%360;
    let s = 100;
    let l = math.floor(math.multiply(1-t, 90));
    let color = "hsl(" + h + ", " + s + "%, " + l + "%)";
    return color;
}

function to_color(t) {
    return to_color_hsl(t);
}


function matrix_generator(width_px, x_c, y_c, width) {
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
    let square = matrix_generator(width_px, 0, 0, 4.2);
    let pixels = [];
    for (j = 0; j < width_px; j++) {
        let row = [];
        for (i = 0; i < width_px; i++) {
            point = square[j][i];
            row[i] = to_color(div_fraction(point, c, max_iterations));
        }
        pixels[j] = row;
    }
    return pixels;
}


function mandelbrot_set(width_px, max_iterations) {
    let square = matrix_generator(width_px, -0.5, 0, 3.2);
    let pixels = [];
    for (j = 0; j < width_px; j++) {
        let row = [];
        for (i = 0; i < width_px; i++) {
            point = square[j][i];
            row[i] = to_color(div_fraction(0, point, max_iterations));
        }
        pixels[j] = row;
    }
    return pixels;
}



function drawMandelbrot(canvas) {
    var ctx = canvas.getContext("2d");
    var width_px = canvas.width;
    let mandy = mandelbrot_set(width_px, 150);
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
    let julia = julia_set(width_px, c, 150);
    for (j = 0; j < width_px; j++) {
        for (i = 0; i < width_px; i++) {
            ctx.fillStyle = julia[j][i];
            ctx.fillRect(i, j, 1, 1);
        }
    }
}

