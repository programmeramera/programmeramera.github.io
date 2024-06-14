---
layout: post
title: "Fix for render issues with high DPI settings"
date: 2024-04-06 01:00:00 +0100
categories: programming opengl sdl
lang: en
ref: fixforrenderissueshighdpi
---
This is so embarassing so I have to post it here since I continously get this error from time to time and never seems to remember how to fix it.

## The problem
When I implement a rendering pipeline with opengl, c++ and the device is configured to use high DPI settings this is a very common issue, observe that the rendering is only parts of the actual window. The screenshot is rendered when the screen is configured with 150% scaling.

![render issue][render-issue]

## The solution
We need to instruct GLFW to respect the scaling settings by setting a property with the following code

``` c++
glfwInit();
glfwWindowHint(GLFW_COCOA_RETINA_FRAMEBUFFER, GLFW_FALSE); // this is the added property
...
window = glfwCreateWindow(...);
glfwMakeContextCurrent(window);
```

With that addition to the setup of GLFW the window now renders as the following image.

![render issue fixed][render-issue-fixed]

So lets hope I can find this here if the issue comes back sometime in the future.

[render-issue]: /assets/render-issue.png
[render-issue-fixed]: /assets/render-issue-fixed.png
