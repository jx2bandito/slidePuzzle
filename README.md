# Slide Puzzle<br />

This is a virtual slide puzzle that I made because the one I won from the Santa Monica Pier arcade kept getting stuck. It's a standard 4x4 
slide puzzle. It's also a time bomb. I made this at a time when I was looking into Angular 1 so there's a bit of unnecessary Angular in there - specifically
I just used ng-repeat to implement the audio files. This is by no means an Angular app, though. As for how the puzzle scrambles - it actually 
uses a brute force algorithm where random clicks are simulated repeatedly. I realize this is a bad approach resource wise, but it made sure the 
game would be winnable as not all random combinations can be won if I just haphazardly placed all the pieces. A better approach would have been to store 
multiple winnable starting positions in several objects. However, another project, Tacoholics Anonymous, was already brewing in my head...


<br />
<br />Project page: https://jx2bandito.github.io/slidePuzzle
<br />


### User Stories: <br />
* User can choose between 3 difficulties - Beginner, Intermediate, and Advanced.
* User can toggle sound effects on and off.
* User must win by lining up the slides in numerical order from left to right, top to bottom.
* If the timer reaches zero before the puzzle is solved, the sliding pieces will fly out in random directions, simulating an explosion.
* Upon winning or losing, the user can choose 'Play Again' to play under the same difficulty, or choose 'Reset' to refresh the page.
* User's score is tracked by the game.
