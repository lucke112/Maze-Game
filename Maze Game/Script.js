var cols, rows;
var w = 40;
var grid = [];
var current;
var stack = [];
var i2 = 0;
var j2 = 0;
var pointx = 0;
var pointy = 0;
var pointcircle = false;

//Crate the Canvas and every Cell then pushis it into the grid array, also creates a new character
function setup() {

    createCanvas(400, 400);
    cols = floor(width/w);
    rows = floor(height/w);

    while ((j2 == 0 && i2 == 0)) {
        j2 = Math.floor(Math.random() * 10);
        i2 = Math.floor(Math.random() * 10);
    }
    while ((pointx == j2 && pointy == i2) || (pointx == 0 && pointy == 0)) {
        pointx = Math.floor(Math.random() * 10);
        pointy = Math.floor(Math.random() * 10);
    }


    for(var j = 0; j < rows; j++) {
        for(var i = 0; i < cols; i++) {
            var cell = new Cell(i, j);
            grid.push(cell);
            
        }
    }
    current = grid[0];
}

    //Draws the grid that have been created, shows the character and the end 
    function draw() {
        background(0);
        for(var i = 0; i < grid.length; i++) {
            grid[i].show();
        }

        current.visited = true;
        current.highlght();
        var next = current.checkNeighbors();

        if(next) {
            next.visited = true;
            stack.push(current);
            removeWalls(current, next);
            current = next;
        } else if(stack.length > 0) {
            current = stack.pop();
        }
        current.theEnd();
        current.thePoints();
    }

    //Checks the celss cordinates withing the grid and returns it as long as it is possible
    function index(i, j) {
        if(i < 0 || j < 0 || i > cols-1 || j > rows-1) {
            return -1;
        }
        return i + j * cols;
    }
    
    //Defines every Cell
    function Cell(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true];
        this.visited = false;

        //Creates the end
        this.theEnd = function() {
            noStroke();
            fill(0, 255, 0);
            rect(i2 * w + (w - w * 0.5) / 2, j2 * w + (w - w * 0.5) / 2, w * 0.5, w * 0.5);
        }

        //Creates the Points
        this.thePoints = function() {
            noStroke();
            if(!pointcircle) {
                fill(204, 0, 0);
                ellipse(pointx * w + w/2, pointy * w + w/2, w/2, w/2);
            }
        }

        //Defines the maze, checks what walls it can go in to and generate a random way through the maze
        this.checkNeighbors = function() {
            var neighbors = [];

            var top = grid[index(i, j - 1)];
            var right = grid[index(i + 1, j)];
            var bottom = grid[index(i, j + 1)];
            var left = grid[index(i - 1, j)];

            if(top && !top.visited) {
                neighbors.push(top);
            }
            if(right && !right.visited) {
                neighbors.push(right);
            }
            if(bottom && !bottom.visited) {
                neighbors.push(bottom);
            }
            if(left && !left.visited) {
                neighbors.push(left);
            }

            if(neighbors.length > 0) {
                var r = floor(random(0, neighbors.length));
                return neighbors[r];
            } else {
                return undefined;
            }
        }

        //Higlights the first Cell that creates the playing field
        this.highlght = function() {
            var x = this.i * w;
            var y = this.j * w;
            noStroke();
            fill(0, 128, 255);
            rect(x + w/4, y + w/4, w/2, w/2);
        }

        //Shows what walls that aren't removed in the Canvas, also fills the cell with a color
        this.show = function() {
            var x = this.i * w;
            var y = this.j * w;
            stroke(255);
            if(this.walls[0]) {
                line(x, y, x + w, y);
            }
            if(this.walls[1]) {
                line(x + w, y, x + w, y + w);
            }
            if(this.walls[2]) {
                line(x + w, y + w, x, y + w);
            }
            if(this.walls[3]) {
                line(x, y + w, x, y);
            }

            if(this.visited) {
                noStroke();
                fill(0, 0, 0);
                rect(x, y, w, w);
            }
        }
    }

    //When going in to a new Cell, remove the wall that it came from
    function removeWalls (a, b) {
        var x = a.i - b.i;
        if(x == 1) {
            a.walls[3] = false;
            b.walls[1] = false;
        } else if(x == -1) {
            a.walls[1] = false;
            b.walls[3] = false;
        }
        var y = a.j - b.j;
        if(y == 1) {
            a.walls[0] = false;
            b.walls[2] = false;
        } else if(y == -1) {
            a.walls[2] = false;
            b.walls[0] = false;
        }
    }


    //Gets the pressed key that user pressed
    document.addEventListener("keydown", function(e) {
            Character(e.key);
    });

    //Handles the movement of the character
    function Character(direction) {

        var currentCell = grid[index(current.i, current.j)];

        var nextCell;

        //Save the registered plan move to nextCell
        if(direction == "ArrowRight") {
            nextCell = grid[index(current.i + 1, current.j)];
        } else if(direction == "ArrowDown") {
            nextCell = grid[index(current.i, current.j + 1)];
        } else if(direction == "ArrowLeft") {
            nextCell = grid[index(current.i - 1, current.j)];
        } else if(direction == "ArrowUp") {
            nextCell = grid[index(current.i, current.j - 1)];
        }

        // Move the character in that direction if possible
    if (nextCell && !currentCell.walls[0] && !nextCell.walls[2] && direction == "ArrowUp") {
        current = nextCell;
    } else if (nextCell && !currentCell.walls[1] && !nextCell.walls[3] && direction == "ArrowRight") {
        current = nextCell;
    } else if (nextCell && !currentCell.walls[2] && !nextCell.walls[0] && direction == "ArrowDown") {
        current = nextCell;
    } else if (nextCell && !currentCell.walls[3] && !nextCell.walls[1] && direction == "ArrowLeft") {
        current = nextCell;
    } 

    //Restarts the program when player is on the right spot
    if(current.i == i2 && current.j == j2 && pointcircle == true) { 
        restart();
    }

    //Point is collected
    if(current.i == pointx && current.j == pointy) {
        pointcircle = true;
    }

    }

    //Restarts the program when called
    function restart() {
    cols = undefined, rows = undefined;
    w = 40;
    grid = [];
    current = undefined;
    stack = [];
    i2 = 0;
    j2 = 0;
    pointx = 0;
    pointy = 0;
    pointcircle = false;
    setup();
    }