$(function() {
    $.fn.connectFour = function(options) {
        'use strict';
		var disk = {
			diameter: 'default',
			padding: 8,
			red: {
				name: 'red',
				fill: 'red',
				stroke: 'purple'
			},
			yellow : {
				name: 'yellow',
				fill: 'yellow',
				stroke: 'purple'
			},
			default : {
				name: 'White',
				fill: 'White',
				stroke: 'purple'
			}
		},
		boardSetting = {
			diameter:'default',
			padding: 1,
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
		[ 							   //fix to 6x7 as the game requires
            ['', '', '', '', '', '', ''],      // (5,0)   (5, 1)    (5, 2)
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''], 
            ['', '', '', '', '', '', ''],       // (0,0)   (0, 1)   (0, 2)
		],		
		c = document.getElementById("board");
		ctx = c.getContext("2d");
		c.style.background = 'blue';

		boardSetting.diameter =  (c.width/7) - (disk.padding*2);

		function drawCircle(cx,cy,circleFill,circleStroke){
			ctx.beginPath();
			ctx.arc(cx,cy,boardSetting.diameter/2, 0, 2*Math.PI, false);
			ctx.fillStyle = circleFill;
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = circleStroke;
			ctx.stroke();
		}

		function drawDisk(col, row, name){
			var cx = (c.width / boardSetting.max_width) * (col + 1) - boardSetting.diameter / 2;
			var cy =  c.height - ((c.height / boardSetting.max_height) * (row + 1) - boardSetting.diameter / 2);

			//console.log("cx and cy: " + cx + " " + cy);
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
			alert("Initializing Board");
			for (var row = 0; row < cells.length; row++){
				for(var column =0; column < cells[row].length; column++){
					cells[row][column] = '';
				}
			}
		}

		// assign disk name with name so the value should be either red or yellow
		// always red first

		function addDisk(column, name){
			for(var i = 0; i < cells.length; i++){   //check height of array
				if(cells[i][column] == '') {
					cells[i][column] = name;
					//console.log(i, name);
					break;
				}	
			}
			return i;
		}			

		drawDisks();

		function getValue(row, column){
			if (row > 6 || row < 0 || column > 7 || column < 0 )
				return -1;

			return cells[row][column];
		}

		function checkWinner(){
			//check row
			for (var i = 0; i < 6; i++) {         // height
				for (var j = 0; j < 7; j++){      // column
					var temp = getValue(i,j);
					if (temp != -1 && temp != '' && (temp == getValue(i,j+1)) && (temp == getValue(i,j+2)) && (temp ==getValue(i,j+3))) {
						//console.log("WINNER ROW " + i + j + " " + getValue(i,j) + " " + getValue(i,j+1) + " " + getValue(i,j+2));
						return temp;
					}
				}
			}
			
			//check column
			for (var i = 0; i < 6; i++) {         // height
				for (var j = 0; j < 7; j++){      // column
					var temp = getValue(i,j);
					if (temp != -1 && temp != '' && (temp == getValue(i+1,j)) && (temp == getValue(i+2,j)) && (temp ==getValue(i+3,j))) {
						//console.log("WINNER COLUMN " + i + j + " " + getValue(i+1,j) + " " + getValue(i+2,j) + " " + getValue(i+2,j));
						return temp;
					}
				}
			}

			//check diagonal 
			for (var i = 0; i < 6; i++) {         // height
				for (var j = 0; j < 7; j++){      // column
					var temp = getValue(i,j);
					if (temp != -1 && temp != '' && (temp == getValue(i+1,j+1)) && (temp == getValue(i+2,j+2)) && (temp ==getValue(i+3,j+3))) {
						//console.log("WINNER DIAGONAL " + i + j + " " + getValue(i+1,j) + " " + getValue(i+2,j) + " " + getValue(i+2,j));
						return temp;
					}
				}
			}
		}
	
	//reference: http://www.informit.com/articles/article.aspx?p=1903884&seqNum=6

	/*c.addEventListener('click', function (e) {
	    // React to the mouse down event
	});*/
	function windowToCanvas(x, y) {
	   var bbox = c.getBoundingClientRect();

	   return { 
	   	x: x - bbox.left * (c.width  / bbox.width),
	    y: y - bbox.top  * (c.height / bbox.height)
	   };
	}

	c.onclick = function (e) {
	    // React to the mouse down event
	    var currLocation = windowToCanvas(e.clientX, e.clientY);
	    var column;

	    //console.log(currLocation.x, currLocation.y);
	    //needs to determine Column from CurrentLocation
	    //board is 700x700, 
	    
	    if (currLocation.x >= 0 && currLocation.x <= 100){
	    	column = 0;
	    	boardSetting.moveCounter++;
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

	    }
	    
	    //boardSetting.currentPlayer.red = ;
	    if(boardSetting.moveCounter % 2 == 0){
			addDisk(column,boardSetting.currentPlayer.red.color);
	    } else {
	    	addDisk(column,boardSetting.currentPlayer.yellow.color);
	    }

	    drawDisks();
	    boardSetting.winner = checkWinner();
		if (boardSetting.winner == 'yellow' || boardSetting.winner == 'red'){
			alert("Winner is : " + boardSetting.winner );
			drawDisks();
			initialize();
			drawDisks();
		}


		//reset here

		};
	}
}(jQuery));