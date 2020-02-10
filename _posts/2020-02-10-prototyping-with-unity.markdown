---
layout: post
title: "Prototyping with Unity"
date: 2020-02-10 01:00:00 +0100
categories: programming unity gamedevelopment
lang: en
ref: prototypingwithunitysantoriniv01
unity_dir: santorini/v0.2
---
This is a prototype of the excellent board game Santorini, implemented with Unity. The game is a two player game in which players take turn in moving builders and building towers, trying to either move a builder to the third level, or stop the other playing from being able to move.

Use mouse to select, move and build. You can use arrow keys to rotate around the center of the game board, simplifying selection and movement.

The camera need some more work to really allow players to be able to select and place builders and buildings in all places, and it also is in desparate need of some better models and graphics. Possibly an AI player would be fun to be able to play with one player only.

Rules of the game:
+ Each player has two builders, being placed wherever on the board.
+ Each turn, a player has to first move any player, and then build somewhere with that player, no exceptions.
+ A builder can move up only one level above it's current level, but down as many as possible.