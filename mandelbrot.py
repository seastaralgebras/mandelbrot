import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as colors

def julia_iteration(z, c):
    return z*z+c

def next_div(z, divergence_time, current_time):
    threshold = 3
    abs_z = abs(z)
    new_div_time = np.where(abs_z > threshold, current_time, float('inf'))
        # 
    return np.minimum(divergence_time,new_div_time)


def generate_julia(c, size_px, x_c, y_c, width, iterations):
    k_step=width/size_px
    x=x_c-width/2
    y=y_c-width/2
    z = np.array([[x+i*k_step+(y+k*k_step)*1j for i in range(size_px)] for k in range(size_px)])
    div_time = np.zeros(z.shape)+iterations
    for n in range(iterations):
        z=julia_iteration(z, c)
        div_time=next_div(z, div_time, n)
        z.real = np.clip(z.real, -3, 3)
        z.imag = np.clip(z.imag, -3, 3)
    
    return np.log(div_time+1)/np.log(iterations)


def generate_mandelbrot(size_px, x_c, y_c, width, iterations):
    k_step=width/size_px
    x=x_c-width/2
    y=y_c-width/2
    c = np.array([[x+i*k_step+(y+k*k_step)*1j for i in range(size_px)] for k in range(size_px)])
    div_time = np.zeros(c.shape)+iterations
    z = c
    for n in range(iterations):
        z=julia_iteration(z, c)
        div_time=next_div(z, div_time, n)
        z.real = np.clip(z.real, -3, 3)
        z.imag = np.clip(z.imag, -3, 3)
    
    return np.log(div_time+1)/np.log(iterations)

def to_color(t):
    color = np.stack([.5+0.5*t, np.ones_like(t), 1-t], axis=-1)
    return colors.hsv_to_rgb(color)

def mandelbrot_image(size_px, iterations,):
    image=to_color(generate_mandelbrot(size_px, -0.5, 0, 3.2, iterations))
    return image

def julia_image(c, size_px, iterations,):
    image=to_color(generate_julia(c, size_px, 0, 0, 4.2, iterations))
    return image

c = -1+0j
width = 1000
n = 500
mandy = mandelbrot_image(width, n)
julia = julia_image(c, width, n)
x = 1
y = 1

fig, axs = plt.subplots(1,2)
fig.suptitle('Mandelbrot and Julia sets')
axs[0].imshow(mandy)
axs[0].set_title('Mandelbrot')
axs[1].imshow(julia)
axs[1].set_title('Julia set for c = ' + str(c))
plt.savefig('mandelbrot_and_julia.png')
plt.show()
# plt.figure()
# plt.subplot(111)
# plt.imshow(mandy)
# plt.subplot(112)
# plt.imshow(julia)
# plt.show()