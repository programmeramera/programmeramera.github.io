---
layout: post
title: "Skapa prototyper med Unity"
date: 2020-02-10 01:00:00 +0100
categories: programming unity gamedevelopment
lang: sv
ref: prototypingwithunitysantoriniv01
unity_dir: santorini/v0.2
---
Här är en prototyp av det roliga brädspelet Santorini, gjord i Unity. Spelet är för två spelare som turas om att flytta byggare och bygga torn, i ett försk att antingen få en byggare att stå på den tredje nivån på ett torn, alternativt stoppa motspelare från att kunna röra sig.

Använd musen för att välja, flytta och bygga. Du kan också använda piltangenterna för att rotera kameran runt spelbrädet, vilket kan underlätta placering och förflyttning.

Kameran behöver absolut mer arbete för att verkligen tillåta en spelare att kunna placera bygga och bygga torn överallt, i alla lägen, och det behöver också lite bättre modeller och grafik. Det vore också trevlig med en AI-spelare för att kunna spela ensam.

Spelregler:
+ Varje spelare har två byggare, som kan placeras vart som helst på brädet.
+ Varje omgång måste varje spelare först flytta en av sina byggare och därpå också bygga ett torn med den flyttade byggaren, utan undantag.
+ En byggare kan bara gå en nivå uppåt, men flera nivåer nedåt.