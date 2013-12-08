'use strict';

var NumbersGame = angular.module('NumbersGame', []);

NumbersGame.controller('GameController',
	function GameController($scope){

		// range-generating function to use in ng-repeat directives
		$scope.range = function(n) {
			var r = [];
			for (var i = 0; i < n; i++) {
				r.push(i);
			}
			return r;
		}

		// possible labels
		var squares = {			
			numbers: [1,2,3,4,5,6,7,8,9],
			letters: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
		};
        
		// the game model
		$scope.game = {
			// voice options, and default choice
			voices : ['daddy','madeline'],
			voice : 'daddy',

			// game type options, and default choice
			types: ['numbers','letters','both'],
			type: 'numbers',

			// board size
			numRows : 3,
			numCols : 3,

			// game status
			score : 0,
			lastResult: null,
			pick: null,
			clue: null,

			// square details (colors stay the same always, labels depend on the game type)
			colors: ['red','green','blue','orange','yellow','purple','black','white','pink','brown'],
			labels: []
		}

		var shuffle = function(o) { //v1.0
		    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		    return o;
		};

		// choose the index of a random square
		var randomSquare = function() { return Math.floor(Math.random() * $scope.game.numRows * $scope.game.numCols)};

		// play a word (with callback to play another word at 'ended' if appropriate)
		var playWord = function(word,callback) {
			var file = "audio/" + $scope.game.voice + "/" + word + ".mp3";
			var audio = new Audio();
			if (callback) {
				audio.addEventListener('ended',callback);
			}

			audio.setAttribute("src",file.toLowerCase());
			audio.load();
			audio.play();
		};

		// play the color and clue for the chosen square
		// flag is to make sure you only launch the sound once at a time

		var playingClue = false;

		$scope.playClue = function() {
			if (!playingClue) {
				playingClue = true;
				playWord($scope.game.clue.color, function() { 
					playWord($scope.game.clue.label, function() {
						playingClue = false;
					});
				});
			}
		};

		var	getClue = function(i) {
			return {
				color: $scope.game.colors[i],
				label: $scope.game.labels[i]
			}
		};

		$scope.newGame = function(type) {
			$scope.game.type = type;
			$scope.game.score = 0;
			$scope.game.lastResult = null;
			if (type == "numbers") {
				$scope.game.labels = squares.numbers;
			} else if (type == "letters") {
				$scope.game.labels = squares.letters;
			} else if (type == "both") {
				$scope.game.labels = squares.numbers.concat(squares.letters);
			} else {
				$scope.game.labels = [];
		  	}

		  	newBoard();
		}

		var newBoard = function() {
			shuffle($scope.game.colors);
			shuffle($scope.game.labels);

			$scope.game.pick = randomSquare();
			$scope.game.clue = getClue($scope.game.pick);

			// the 'right' / 'wrong' audio happens here
			// because we want the board to get redrawn first
			if ($scope.game.lastResult === 'correct') {
				playWord('right',$scope.playClue);
			} else if ($scope.game.lastResult === 'wrong') {
				playWord('wrong',$scope.playClue);
			} else {
				$scope.playClue();
			}
		};

		$scope.setVoice = function(voice) {
			$scope.game.voice = voice;
		};

		$scope.clicky = function(i) { 
			// check if the click was correct, update the score, and call newBoard()
			if (i == $scope.game.pick) {
				$scope.game.lastResult = 'correct';
				$scope.game.score += 10;
			} else {
				$scope.game.score -= 10;
				$scope.game.lastResult = 'wrong';
			}
			newBoard();
		};

		$scope.newGame($scope.game.type);

	  }
  );