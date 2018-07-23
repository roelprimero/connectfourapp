$(function() {
    $.fn.connectFour = function(options) {
        'use strict';
		var disk = {
			diameter: 'default',
			padding: 2,
			red: {
				name: 'red',
				fill: 'red',
				stroke: 'black'
			},
			yellow : {
				name: 'yellow',
				fill: 'yellow',
				stroke: 'black'
			},
			default : {
				name: 'White',
				fill: 'White',
				stroke: 'black'
			}
		},
		boardSetting = {
			diskDiameter:'default',
			max_width: 7,
			max_height: 6,
			moveCounter: 0,
			winner: 'None',
			currentPlayer: {
				red: {
					color: 'red'
				},
				yellow: {
					color: 'yellow'
				}
			}
		},
		c,   //context
		ctx,
		cells = 
		[ 							   		   // fix to 6x7 as the game requires
            ['', '', '', '', '', '', ''],      // (5,0)   (5, 1)    (5, 2) ...
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''], 
            ['', '', '', '', '', '', ''],       // (0,0)   (0, 1)   (0, 2) ... 
		],		
		c = document.getElementById("board");
		ctx = c.getContext("2d");
		c.style.background = 'blue';
		boardSetting.diskDiameter =  (c.width/boardSetting.max_width) - (disk.padding * 2);

		function drawCircle(cx,cy,circleFill,circleStroke){
			ctx.beginPath();
			ctx.arc(cx,cy,boardSetting.diskDiameter/2, 0, 2*Math.PI, false);
			ctx.fillStyle = circleFill;
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = circleStroke;
			ctx.stroke();
		}

		function drawDisk(col, row, name){
			var cx = (c.width / boardSetting.max_width) * (col + 1) - boardSetting.diskDiameter / 2;
			var cy =  c.height - ((c.height / boardSetting.max_height) * (row + 1) - boardSetting.diskDiameter / 2);

			if (name == disk.red.name){
				drawCircle(cx,cy, disk.red.fill, disk.red.stroke);
			} else if (name == disk.yellow.name) {
				drawCircle(cx,cy, disk.yellow.fill, disk.yellow.stroke);
			} else {
				drawCircle(cx,cy, disk.default.fill, disk.default.stroke);
			}
			
		}

		function drawDisks()
		{
			for (var row = 0; row < cells.length; row++){
				for(var column =0; column < cells[row].length; column++){
					drawDisk(column, row, cells[row][column]);
				}
			}
		}

		function initialize()
		{
			for (var row = 0; row < cells.length; row++){
				for(var column =0; column < cells[row].length; column++){
					cells[row][column] = '';
				}
			}
		}

		// assign disk name with name so the value should be either red or yellow
		// Limitation: always yellow first

		function addDisk(column, name){
			for(var i = 0; i < cells.length; i++){   //check height of array
				if(cells[i][column] == '') {
					cells[i][column] = name;
					break;
				}	
			}
		}			

		function getValue(row, column){
			if (row > 6 || row < 0 || column > 7 || column < 0 ) //detects out of bounds
				return -1;

			return cells[row][column]; //return value of the coordinate
		}

		function checkWinner(){
			//check row
			for (var i = 0; i < 6; i++) {         // height
				for (var j = 0; j < 7; j++){      // column
					var temp = getValue(i,j);
					if (temp != -1 && temp != '' && (temp == getValue(i,j+1)) && (temp == getValue(i,j+2)) && (temp ==getValue(i,j+3))) {
						return temp;
					}
				}
			}
			
			//check column
			for (var i = 0; i < 6; i++) {         // height
				for (var j = 0; j < 7; j++){      // column
					var temp = getValue(i,j);
					if (temp != -1 && temp != '' && (temp == getValue(i+1,j)) && (temp == getValue(i+2,j)) && (temp ==getValue(i+3,j))) {
						return temp;
					}
				}
			}

			//check diagonal  '/' and '\'
			for (var i = 0; i < 6; i++) {         // height
				for (var j = 0; j < 7; j++){      // column
					for(var offset = -1; offset <= 1 ; offset+=2 ){ //diagonals
						var temp = getValue(i,j);
						if (temp != -1 && temp != '' && (temp == getValue(i+1,j+1*offset)) && (temp == getValue(i+2,j+2*offset)) && (temp ==getValue(i+3,j+3*offset))) {
							console.log("\/");
							return temp;
						}
					}
				}
			}
		}

	//intially draw the disk	
	drawDisks(); 
	
	//reference: http://www.informit.com/articles/article.aspx?p=1903884&seqNum=6
	/*c.addEventListener('click', function (e) {
	    // React to the mouse down event
	});*/

	function windowToCanvas(x, y) {
	   //window.location.href=window.location.href;
	   var bbox = c.getBoundingClientRect();
	   return { 
	   	x: x - bbox.left * (c.width  / bbox.width),
	    y: y - bbox.top  * (c.height / bbox.height)
	   };
	}

	c.onclick = function (e) {
	    // React to the mouse click event
	    var currLocation = windowToCanvas(e.clientX, e.clientY);
	    var column;

	    //needs to determine Column from CurrentLocation
	    //board is 700x700
	    //design is still hard-coded, could use diffent Math functions for improvement

	    if (currLocation.x >= 0 && currLocation.x <= 100){
	    	column = 0;
	    	boardSetting.moveCounter++; //counts valid moves
	    } else if (currLocation.x >= 101 && currLocation.x <= 200) {
			column = 1;
			boardSetting.moveCounter++;
	    } else if (currLocation.x >= 201 && currLocation.x <= 300) {
			column = 2;
			boardSetting.moveCounter++;
	    } else if (currLocation.x >= 301 && currLocation.x <= 400) {
	    	column = 3;
	    	boardSetting.moveCounter++;
	    } else if (currLocation.x >= 401 && currLocation.x <= 500) {
	    	column = 4;
	    	boardSetting.moveCounter++;
	    } else if (currLocation.x >= 501 && currLocation.x <= 600) {
	    	column = 5;
	    	boardSetting.moveCounter++;
	    } else if (currLocation.x >= 601 && currLocation.x <= 700) {
	    	column = 6;
	    	boardSetting.moveCounter++;
	    } else {
	    	//do nothing
	    }
	    
	    if(boardSetting.moveCounter % 2 == 0){
			addDisk(column,boardSetting.currentPlayer.red.color);
			$("#player").text("Player Turn: Yellow");
	    } else {
	    	addDisk(column,boardSetting.currentPlayer.yellow.color);
	    	$("#player").text("Player Turn: Red");
	    }

	    drawDisks();
	    boardSetting.winner = checkWinner();
		if (boardSetting.winner == 'yellow' || boardSetting.winner == 'red'){
			$("#player").text("Winner is: " + boardSetting.winner);
			initialize();
			alert(boardSetting.winner + " has won the game! Click OK for a new game");
			window.location.href=window.location.href;
		}


		//draw
		console.log(boardSetting.moveCounter);
		if(boardSetting.moveCounter > 42){
			$("#player").text("DRAW");
			alert("It was a DRAW. Click OK for a new game");
			window.location.href=window.location.href;
		}

		};
	}
}(jQuery));