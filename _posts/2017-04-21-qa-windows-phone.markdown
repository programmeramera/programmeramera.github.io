---
layout: post
title:  "Things to consider when using Microsoft Engagement SDK"
date:   2017-04-21 08:00:00 +0100
categories: uwp store business qa english
lang: en
ref: qawindowsphone
---

A cool framework that we as developers of UWP applications can use to better engage with our customers is the Microsoft Engagement SDK. There are however some things we need to consider.

The Microsoft Engagement SDK is something called a Framework SDK which means that it will be packaged and deployed separately from your application, in other words, not included in the appx or bundle. Instead it will be deployed to the users devices through the Store application. 

This can cause some confusion when doing local QA on devices since the SDK has to be explicitly installed onto these devices. We have found that while doing QA on x86 or x64 devices such as Surface or PC's there's no big issue, since we usually run the .ps1 script to install the application, which registers certificates and additional dependencies. We have however stumbled upon some nasty behaviors while having external testers trying to deploy ARM builds onto their devices by downloading the appx through a web page or similar.

So please bear in mind that prior to installing your .appx on ARM devices you also have to manually deploy and install any eventual dependencies that aren't packaged within the .appx.

[dev-sum]: http://www.devsum.se
