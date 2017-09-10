var app = angular.module("slideApp", []);
app.controller("slideCont", [
  "$scope",
  function($scope) {
    var $menuSFX = {
      ID: "menuSound",
      URL: "http://k003.kiwi6.com/hotlink/omtq0pu0vg/MenuTone.mp3",
      Description:
        "A retro-futuristic sound used when hovering on a difficulty choice"
    };

    var $thudSFX = {
      ID: "thudSound",
      URL: "http://k003.kiwi6.com/hotlink/4xjaw06jc2/Thud.mp3",
      Description: "A thud sound used when sliding a piece"
    };

    var $boomSFX = {
      ID: "boomSound",
      URL: "http://k003.kiwi6.com/hotlink/t2ltin0wcu/Boom.mp3",
      Description:
        "A boom sound used upon failing to complete the puzzle within the time limit"
    };

    /* var $sample = {
    "ID": "HTML ID of the sound file",
    "URL": "URL of the sound file used for the src attribute",
    "Description": "A short description of the sound file and its intended use"
  };
  */

    $scope.soundFiles = [$menuSFX, $thudSFX, $boomSFX];
    /////////////////////End Angular
  }
]);

$(document).ready(function() {
  var debug = $("#debug");
  var $audio = $("audio");
  var $volumeControl = $("#volumeControl");
  var volumeOn = true;
  var $menu = $("#menu");
  var $score = $("#scoreBoard");
  var wonLast;
  var $winScore = $("#winScore");
  var winScore = 0;
  var $loseScore = $("#loseScore");
  var loseScore = 0;
  var $puzzleBox = $("#puzzleBox");
  var $difficulty = $(".difficulty");
  var $difName = $(".difName");
  var $selection = $("#selection");
  var $slide = $(".slide");
  var $n1 = $("#n1");
  var $n2 = $("#n2");
  var $n3 = $("#n3");
  var $n4 = $("#n4");
  var $n5 = $("#n5");
  var $n6 = $("#n6");
  var $n7 = $("#n7");
  var $n8 = $("#n8");
  var $n9 = $("#n9");
  var $n10 = $("#n10");
  var $n11 = $("#n11");
  var $n12 = $("#n12");
  var $n13 = $("#n13");
  var $n14 = $("#n14");
  var $n15 = $("#n15");
  var $empty = $("#empty");
  var timeLimit;
  var $timer = $("#timer");
  var $playAgain = $("#playAgain");
  var $reset = $("#reset");
  var $replay = $(".replayMenu");
  function startGame() {}
  function scrambleSlides() {}
  function animatePieces() {}
  var startPointEmpty = JSON.stringify($("#empty").position());
  var arrayPos;
  var arrayID;
  var playing = false;
  var scramble = false;
  var animated = false;

  ////////////////Timer functions

  function clockFormat(int) {
    var minutes = Math.floor(int / 60);
    var seconds = leadZero(int % 60);
    return minutes + ":" + seconds;
  }

  function leadZero(num) {
    if (num < 10) {
      num = "0" + num;
    }

    return num;
  }

  function startCountdown(timer) {
    var startTime = Math.floor(new Date().getTime() / 1000);
    var countdown;
    var currentTime;
    var timePassed;
    var updateTimer;
    countdown = setInterval(function() {
      if (!playing) {
        clearInterval(countdown);
        return false;
      }

      currentTime = Math.floor(new Date().getTime() / 1000);
      timePassed = Math.floor(currentTime - startTime);
      updateTimer = timer - timePassed;
      $timer.html(clockFormat(updateTimer));

      if (updateTimer <= 0) {
        /////////////Lose
        wonLast = false;
        loseScore++;
        $loseScore.html(loseScore);
        clearInterval(countdown);
        $timer.hide();
        $replay.show();
        animatePieces();
      }
    }, 100);
  }

  ////////////////////Get positions of slides
  function definePositions() {
    arrayPos = [
      $empty.position(),
      $n1.position(),
      $n2.position(),
      $n3.position(),
      $n4.position(),
      $n5.position(),
      $n6.position(),
      $n7.position(),
      $n8.position(),
      $n9.position(),
      $n10.position(),
      $n11.position(),
      $n12.position(),
      $n13.position(),
      $n14.position(),
      $n15.position()
    ];

    arrayID = [
      $empty,
      $n1,
      $n2,
      $n3,
      $n4,
      $n5,
      $n6,
      $n7,
      $n8,
      $n9,
      $n10,
      $n11,
      $n12,
      $n13,
      $n14,
      $n15
    ];
  }

  function checkIfWon() {
    for (var i = 1; i < arrayPos.length; i++) {
      if (
        JSON.stringify(Math.round(arrayPos[i].top)) !=
          JSON.stringify(Math.round(arrayID[i].position().top)) ||
        JSON.stringify(Math.round(arrayPos[i].left)) !=
          JSON.stringify(Math.round(arrayID[i].position().left))
      ) {
        return false;
      }
    }

    playing = false;
    winScore++;
    $winScore.html(winScore);
    $timer.hide();
    $replay.show();
    $empty.removeClass("emptyGlowing");
    $puzzleBox.removeClass("bombActive");
    wonLast = true;
    return true;
  }

  /////////Audio set up. Sound effects obtained from www.zapsplat.com
  var menuSound = document.getElementById("menuSound");

  var thudSound = document.getElementById("thudSound");

  var boomSound = document.getElementById("boomSound");

  $audio.prop("volume", 0.3);
  boomSound.volume = 0.02;

  $difName.on("mouseover", function() {
    menuSound.currentTime = 0.2;
    menuSound.play();
  });

  $volumeControl.on("click touchstart", function() {
    if (volumeOn) {
      volumeOn = false;
      $audio.prop("volume", 0);
      $volumeControl.addClass("glyphicon-volume-off");
      $volumeControl.removeClass("glyphicon-volume-up");
      return false;
    } else {
      volumeOn = true;
      $audio.prop("volume", 0.3);
      boomSound.volume = 0.02;
      $volumeControl.removeClass("glyphicon-volume-off");
      $volumeControl.addClass("glyphicon-volume-up");
      return false;
    }
  });

  ///////////////Animation for difficulty choices
  function defineDifficultyAnimation() {
    $("#beginner").css(
      "transform",
      "translateX(" + $("#dd1").width() / 2 + "px)"
    );
    $("#intermediate").css(
      "transform",
      "translateX(" + $("#dd2").width() / 2 + "px)"
    );
    $("#hard").css(
      "transform",
      "translateX(" + $("#dd3").width() / 2.2 + "px)"
    );
  }

  $(".difficulty").css("transition", "none");
  $(".difficulty").css("visibility", "initial");
  defineDifficultyAnimation();
  setTimeout(function() {
    $(".difficulty").css("transition", "");
  }, 10);

  //////Make sure difficulty choices are aligned correctly
  $(window).on("resize", function() {
    $(".difficulty").css("transition", "none");
    defineDifficultyAnimation();
    setTimeout(function() {
      $(".difficulty").css("transition", "");
    }, 300);
  });

  //////////////////////////Gameplay Algorithm

  $difficulty.on("touchstart mousedown", function() {
    $menu.html("Scrambling...");
    var name = this.id;
    setTimeout(function() {
      $menu.hide();
      $selection.show();
      $puzzleBox.show();
      definePositions();
      $score.show();
      $empty.addClass("emptyGlowing");
      $puzzleBox.addClass("bombActive");
      switch (name) {
        case "beginner":
          timeLimit = 3600;
          break;
        case "intermediate":
          timeLimit = 300;
          break;
        case "hard":
          timeLimit = 60;
          break;
      }

      scrambleSlides();
      startCountdown(timeLimit);
    }, 10);
  });

  var wait = false;
  $puzzleBox.children(".slide").on("touchstart mousedown", function() {
    var origPosition = $(this).position();
    var emptyPosition = $empty.position();
    var diffY = Math.round(Math.abs(origPosition.top - emptyPosition.top));
    var diffX = Math.round(Math.abs(origPosition.left - emptyPosition.left));

    if (diffX > 75 || diffY > 75 || diffY == diffX) {
      return false;
    }

    if (!playing) {
      return false;
    } else if (playing) {
      if (!scramble) {
        thudSound.currentTime = 0;
        thudSound.play();
      }
      $(this).css(emptyPosition);
      $("#empty").css(origPosition);
      if (!scramble) {
        checkIfWon();
      }
    }
  });

  $reset.on("mousedown touchstart", function() {
    location.reload();
  });

  $playAgain.on("mousedown touchstart", function() {
    if (!wonLast) {
      animated = false;
      playing = true;
      $slide.css("transform", "none");
      arrayID[0].show();

      for (var i = 0; i < arrayPos.length; i++) {
        arrayID[i].css(arrayPos[i]);
      }
    }

    $menu.show();
    $menu.html("Scrambling...");
    $selection.hide();
    $puzzleBox.hide();
    $score.hide();
    setTimeout(function() {
      $timer.show();
      $replay.hide();
      $menu.hide();
      $selection.show();
      $puzzleBox.show();
      $score.show();
      $empty.addClass("emptyGlowing");
      $puzzleBox.addClass("bombActive");

      scrambleSlides();
      startCountdown(timeLimit);
    }, 10);
  });

  /////While this is a rather expensive way of scrambling the game, especially on mobile, it makes sure that the puzzle is still solvable since some combinations can be unsolvable if the slides are rearranged with no discretion. Future implementation: Store possible legal combinations in an array then assign those combinations instead of having the CPU click randomly
  function scrambleSlides() {
    if (animated) {
      return false;
    }
    playing = true;
    scramble = true;
    for (var a = 0; a < 750; a++) {
      var ranIndex = Math.floor(Math.random() * 16);
      arrayID[ranIndex].mousedown();
    }
    scramble = false;
    return false;
  }

  function returnRanBool() {
    return Math.random() > 0.5;
  }

  function animatePieces() {
    $("#puzzleBox").addClass("shake");
    arrayID[0].hide();
    playing = false;
    setTimeout(function() {
      for (var x = 1; x < arrayID.length; x++) {
        var rxNum = Math.floor(Math.random() * 45); //Rotation X-Axis
        if (returnRanBool()) {
          rxNum = -rxNum;
        }

        var ryNum = Math.floor(Math.random() * 45); //Rotation Y-Axis
        if (returnRanBool()) {
          ryNum = -ryNum;
        }

        var rzNum = Math.floor(Math.random() * 2160); //Rotation Z-Axis
        if (returnRanBool()) {
          rzNum = -rzNum;
        }

        var xNum = Math.floor(Math.random() * $(window).width() / 3 + 100); //Translate X-axis
        if (returnRanBool()) {
          xNum = -xNum;
        }

        var yNum = Math.floor(Math.random() * $(window).height() / 3 + 100); //Translate Y-axis
        if (returnRanBool()) {
          yNum = -yNum;
        }

        var zNum = Math.floor(Math.random() * 100); //translate Z-axis
        if (returnRanBool()) {
          zNum = -zNum;
        }

        arrayID[x].css(
          "transform",
          "translate3d(" +
            xNum +
            "px," +
            yNum +
            "px," +
            0 +
            "px) rotateX(" +
            rxNum +
            "deg) rotateY(" +
            ryNum +
            "deg) rotateZ(" +
            rzNum +
            "deg)"
        );
        $("#puzzleBox").removeClass("shake");
        $("#puzzleBox").addClass("bombActive");
        boomSound.currentTime = 0;
        boomSound.play();
      }
    }, 500);
  }

  /* Test area 
  $(window).on("keydown", function(e) {
    if (e.which == 37) {
      animatePieces();
      animated = true;
    }
    if (e.which == 39) {
      
      animated = false;
      playing = true;
      $slide.css("transform", "none");
      arrayID[0].show();
      
      for(var i = 0; i < arrayPos.length; i++){
        arrayID[i].css(arrayPos[i]);
        
      };
      
    }
  });
*/

  $(window, "body, html").on("keypress", function() {
    for (var i = 0; i < arrayPos.length; i++) {
      arrayID[i].css(arrayPos[i]);
    }
  });
  //////////////////END JQUERY
});