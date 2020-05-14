---
layout: post
title: "Sideloading UWP apps on Windows 10"
date: 2020-05-14 01:00:00 +0100
categories: programming uwp windows10
lang: en
ref: sideloadinguwpappsonwindows10
---
I've helped several clients build UWP apps and games and one thing that is repeatedly asked is for the possibility to install test versions of apps without the need of downloading from Store. This is not a forgotten feature at all in the Microsoft ecosystem and something that works just fine, however it takes some manual steps and this post is intended to guide you through those steps.

I presume that you already have a device with Windows 10, and most likely also been provided with a .zip file containing the packaged application you want to install. Usually this means that you have a couple of files bundled together and the listing of these files might looks something like this:

![files in package][files]


[files]: http://programmeramera.se/assets/msix_files.png
