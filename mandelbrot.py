import numpy as np
from PIL import Image

def julia_iteration(z, c):
    return z*z+c

def next_div(z, divergence_time, current_time):
    threshold = 2.01
    abs_z = abs(z)
    new_div_time = np.where(abs_z > threshold, current_time, float('inf'))
        # 
    return np.minimum(divergence_time,new_div_time)


def generate_mandelbrot(size_px, iterations):
    k_step=3.2/size_px
    c = np.array([[-2.1+i*k_step-1.6j+k*k_step*1j for i in range(size_px)] for k in range(size_px)])
    div_time = np.zeros(c.shape)+iterations
    z = c
    for n in range(iterations):
        z=julia_iteration(z, c)
        div_time=next_div(z, div_time, n)
        z.real = np.clip(z.real, -3, 3)
        z.imag = np.clip(z.imag, -3, 3)
    
    return 1-np.log(div_time+1)/np.log(iterations)

def gray_to_color(t, color):
    return [i*t for i in color]

def mandelbrot_image(size_px, iterations,):
    mandy=generate_mandelbrot(size_px, iterations)
    image = 255*mandy
    return Image.fromarray(image)


image = mandelbrot_image(2000, 1000)
image.show()

