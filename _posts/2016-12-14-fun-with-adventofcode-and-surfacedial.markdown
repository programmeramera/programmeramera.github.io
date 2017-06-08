---
layout: post
title:  "Fun with Advent of Code Day 13.2 and Surface Dial"
date:   2016-12-14 00:00:00 +0100
categories: adventofcode english surface uwp
lang: en
ref: adventofcode2015day13part2
---

Warning: This post does include the solution to Advent of Code 2016 Day 13 part 2!

If you still haven't discovered the awesome site [Advent of Code][adventofcode] you really need to head there and discover their fun and tricky challenges for developers. It's a very nice way of keeping your development skills up to date, or maybe learn a new language while solving the problems?

I've been trying to follow the daily challenges as much as possible but still have a couple that needs further investigation, but yesterday I received a Surface Dial and couldn't stop myself from trying to fiddle with that device as well. And then I thought, why not try and mix both pleasures.

The result was a simple UWP application in which I added the code that solved the maze problem for day 13 and then integrated the Surface Dial to bind its rotation to the current max steps count that was one of the parameters for the problem. I also leveraged [Win2D][win2d] to render a somewhat easy grid, showing the currently visited rooms in the maze.

{% include youtubePlayer.html id="66j5Y1TyU3Q" %}

The actual Surface Dial integration was very simple, here's pretty much all the code required:


```csharp
myController = RadialController.CreateForCurrentView();
var icon = RandomAccessStreamReference.CreateFromUri(new Uri("ms-appx:///Assets/StoreLogo.png"));
var myItem = RadialControllerMenuItem.CreateFromIcon("Day13", icon);
myController.Menu.Items.Add(myItem);
myController.RotationChanged += MyController_RotationChanged;

...

void MyController_RotationChanged(RadialController sender, RadialControllerRotationChangedEventArgs args)
{
    steps += (int)args.RotationDeltaInDegrees / 10; // steps is the max steps in the path finding
    ClearMaze();
    Move(1, 1, 0, steps); // 1,1 is the starting position, 0 is the initial length, and steps is the max steps allowed
    canvasControl.Invalidate(); // redray the Win2D canvas
}
```

If you want to try the solution out (and have a Surface Dial) you can find the [git repository here][repository]. Again, please remember that one solution to the Day 13 part 2 problem is included, and if you don't want to cheat you might want to build your own solution first.

[adventofcode]: http://adventofcode.com/2016
[repository]: https://github.com/programmeramera/AdventOfCodeUwp
[win2d]: https://github.com/Microsoft/Win2D