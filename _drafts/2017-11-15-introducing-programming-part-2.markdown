---
layout: post
title: "Introducing programming, part 2"
date: 2017-11-15 07:00:00 +0100
categories: programming introduction python
lang: en
ref: introduktiontillprogrammeringdel2
---
Yesterday was an amazing day when I once again got the opportunity to introduce more kids to the wonderful world of programming. Once again, it was in front of my sons 5th grade class and schoolmates when they had the day of "students choice" and were given the choice of "Introducing programming", "3D figures in real life", "Sudoku and other math challenges".

I was told there was gonna be around 12 students, and a couple of days in advance I was informed that there might be just a couple of more. It ended up with 21 students, aged 10 to 11, and that my friends I can tell you is a handful. I have so much respect for the teachers of the world who accepts this challenge every single day!

Similar to the earlier session I did, the school hasn't got any access to computers, but all students have their personal iPad devices, but I was really dissatisfied with the earlier sessions part in which we had to write code on the iPad and hence I managed to reinstall a bunch of my older and currently not used Surface devices, and also managed to configure some more computers, ending up in 10 computers with keyboard that the students could leverage during the last part of the day.

2 Surface Pro 2
2 Surface 3
1 Surface Pro 4
1 Surface Book
1 Samsung laptop
1 MacBook Air
1 MacBook Pro
1 GPD device

The day was organized as follows:

08.00 - 09.00 Introduction to programming
In this session I introduced myself and my history of 35 years of doing programming. I talked about languages, types of development, where one could find programming (such as cars, appliances, elevators, cameras) but also my personal opinions on [how to be a good programmer]. I also leveraged some pattern matching exercises as well as some mathematical problems for the group to solve, to make them understand how to think as a computer. Overall the students were very involved and responsive to questions, asking their own questions and also making comments. 

Things to consider:
The term "hacking" was asked about and one student asked if their new digital door-lock that just had been installed could be hacked. I now wonder if I should have lied and told her no, but too late I realized that I probably scared them a bit when discussing this topic. Need to consider this some more in advance next time! Computer security is a huge topic and I wasn't prepared for this.

Next time I will try and bring even more exercises and maybe even let them work in smaller groups to solve and present their results, otherwise I noticed that there are a couple of students that raise their voices before others get the chance to show that they also understand and wants to be heard.

09.00 - 09.30 Break

09.30 - 11.00 Working with iPads
The second session of the day started with some exercises in which the students used a simple arrow-based language to instruct a robot on screen to navigate a simple maze with some different requirements such as all positions in a maze had to be visited or a key had to be fetched to open the safe in the end. This was also very encouraging since it's apparent that the students appreciated the interaction elements as well as simple challenges that all understood and managed to solve. These exercises was also the introduction to the iPad app CargoBot which I had leveraged before. CargoBot is really cool app that puts the user in the driver seat of a robot arm that need to arrange some boxes according to a final image. The app is structured with some lighter introducing levels but will quite rapidly increase its difficulty and I realized that even after a couple of levels the students needed several discussions regarding topics such as conditional execution, loops, recursion and such. I still recommend CargoBot for these exercises since its fun and also kind of cool since the app was actually developed on an iPad with Codea. I also found the students later the day using CargoBot while waiting for assistance, so I guess they really liked it.

Things to consider:
I forgot to bring my own iPad which meant that I had to leverage a students iPad while demonstrating in front of the class. Better preparations next time!

The app could easily be used to even further demonstrate the topics mentioned above, but one should also realize that having the kids play themselves keeps them interested, instead of simply wathing someone else show them how to do it.

The app is only available in english which means that it does require quite some skill in the english language to fully grasp the topics.

11.00 - 12.00 Lunch

12.00 - 13.00 Working with computers
After the lunch I had unpacked and configured the computers I brought. I introduced the development experience which was the following:

1. Visual Studio Code to edit a python file
2. The integrated terminal in VS Code to run the edited file

I also introduced the Python language and mentioned its popularity and simplicity, my ambition was to quite rapidly introduce the turtle graphics module to make the development more fun since visual execution is much more fun than the console interactions. However here I quickly realized that I had greatly overestimated the students understanding of computers and actual keyboards. They didn't know how to save files (they didn't understand the concept of files either) with CTRL+S and it was even more confusing since the students with MacBooks had to use a separate command CMD+S. I also failed in explaining thoroughly the different parts of the development environment (editor, terminal, explorer) which meant I had to several times help the students in running the edited file in the terminal instead of trying to run commands in the editor. I also realized that not only the difference between () and [] was very confusing as well as the commands to get these characters was challenging for all of the students. They simply doesn't leverage keyboards. We managed to write and run scripts as following:

print('Hello world')

print(2+3)

name = input()
print(name)

for i in range(5):
	print(i)

names = ['Johan', 'Lina', 'Max', 'Matilda']
for name in names:
	print(name)

prices = [ 2, 3, 4, 6]
sum = 0
for price in prices:
	sum = sum + price
print(sum)

Things to consider:
This might not sound like much, but it took a lot of effort to just explain the need for indentation, quotation of strings and I was quite hit when I realized that the MacBooks where running Python 2.7 while all the Windows devices was running 3.6 meaning that even the simplest exercises above had to be changed for these two devices, and since I didn't have access to Internet, I actually stumbled a while with this matter.

Visual Studio Code is a very simple yet powerful editor, however it was way too much for these exercises. I might have been better off with just using notepad and a cmd-window, or maybe just used an interactive session.

13.00 - 13.20 Break
During the break I let the kids test my HoloLens device which was a wonderful experience. They were really fast learners in getting to know the augmented reality and the interaction gestures available, but they only got to use it for like a minute per student and all of them wanted to try once more after the day, some actually stuck around and did!

13.20 - 14.00 Working with computers
In the last session we summarized what we did in the previous and then I wanted to show the students what can be done when it comes to game development with programming skills. I leveraged the tutorial "Your first game" that uses Phaser and Javascript and just explained some of the changes being done between the different sections, and with somewhere around 50 lines of added code the game was finished, and at least half of the students wanted to get a link to the game to play it afterwards, some also wanted to learn more about Phaser.

That ends up in somewhere around 4 hours of actual content and session. It was an amazing experience and even though some of the students struggled with keeping focused and somewhat disturbed some of the others, I had a very fun and educational day (I learned a lot too).

Things I will try and change for next time:
1) More interactive exercises to demonstrate different concepts such as loops, conditional execution, recursion
2) I will probably stick with Python, but most likely skip leveraging a visual coding environment all together and stick to notepad or something similar.
3) Occassionally someone raised their arm and asked "Why do I do this?" and I was equally baffled by the question every single time. 



[Tess Ferrandez XNA implementation]: https://blogs.msdn.microsoft.com/tess/2012/03/02/xna-for-windows-phone-walkthroughcreating-the-bizzy-bees-game/
[how to be a good programmer]:
[Phaser]: http://phaser.io/