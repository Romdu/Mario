// https://developer.mozilla.org/fr/docs/Web/JavaScript/Introduction_%C3%A0_JavaScript_orient%C3%A9_objet
var Cell = function (y, x, image) {
    this.x = x;
    this.y =  y;
    this.id = "pos("+this.x+","+this.y+")";
    this.image = image;
    var img = document.createElement("img");
    img.id = "pos("+this.x+","+this.y+")";
    img.src = this.image;
    img.className += "case";
    document.getElementById("ligne"+ this.y).appendChild(img);
    this.update = function () {
        img.style.left = this.x*2.5+"%";
        img.style.top = this.y*5.25+"%";
    };
    this.checkCollision = function (cell) {
        // retourne true si la cellule est aux mÃªme coordonnÃ©es que cell
    };
    this.die = function () {
        // dÃ©truit l'objet et le remove de la map
    };
    this.update();
};

var Mario = function (y, x, image) {
    Cell.call(this, y, x , image);
    document.getElementById("pos("+this.x+","+this.y+")").classList.add("mario");
    this.falling = false;
    this.onmove = false;
    this.vitesseLeft = 0;
    this.vitesseRight = 0;
    this.onJump = false;
    this.nb = 0;
    this.jump = {
        power: 3, // hauteur du saut en nombre de cellules
        interval: null // identifiant de l'intervalle de temps entre chaque animations du saut
    };
    setTimeout(function(){
        mario.input = new Input([32, 37, 39]);
    }, 10);
    this.makeJump = function () {
            if(mario.falling === false){
                if(mario.jump["power"] > 0 && mario.y-1 >= 0){
                    var collision = map.checkCollision(map.map[mario.y-1][mario.x]);
                    if(collision === true){
                        mario.y--;
                        for(var i = 0; i < map.koopa.length; i++){
                            if(map.koopa[i].x == mario.x && map.koopa[i].y == mario.y  && mario.y != 0  && mario.x != 0){
                                var marioDie = new Audio('http://peal.io/download/wn5l3');
                                marioDie.autoplay = true;
                                mario.die();
                            }
                        }
                        mario.jump['power']--;
                    }
                    else if(collision == "peach"){
                        peach.getYou();
                    }
                    else{
                        mario.jump['power'] = 0;
                    }
                }
                else{
                    mario.falling = true;
                }
            }   
    };
    this.fall = function () {
        if(mario.falling === true && mario.jump['power'] == 0){
            this.nb++;
        }
        if(mario.falling === true && mario.jump['power'] == 0 && this.nb > 1){
            if(map.map[mario.y+1][mario.x].image != "block.png"){
                var collision = map.checkCollision(map.map[mario.y+1][mario.x]);
                if(collision === true){    
                    mario.y++;
                    var o = 0;
                    var koopawant = "";
                    for(var i = 0; i < map.koopa.length; i++){
                        if(map.koopa[i].x == mario.x && map.koopa[i].y == mario.y){
                            koopawant = map.koopa[i];
                        }
                        if(map.koopa[i].image == "vide.png"){
                            o++;
                        }
                        if(o == map.koopa.length-1){
                            if(koopawant != ""){
                                document.getElementById("koopadie").play();
                                peach.getYou();
                            }
                        }
                        else{
                            if(koopawant != ""){
                                document.getElementById("koopadie").play();
                                koopawant.die();
                            }
                        }
                    }
                }
                else if(collision == "peach"){
                    peach.getYou();
                }         
            }
            else{
                mario.falling = false;
                this.nb = 0;
                mario.jump['power'] = 3
            }
        }
        else if(mario.jump['power'] == 3){
            if(map.map[mario.y+1][mario.x].image != "block.png"){
                var collision = map.checkCollision(map.map[mario.y+1][mario.x])          
                if(collision === true){    
                    mario.y++;
                    var o = 0;
                    var koopawant = "";
                    for(var i = 0; i < map.koopa.length; i++){
                        if(map.koopa[i].x == mario.x && map.koopa[i].y == mario.y){
                            koopawant = map.koopa[i];
                        }
                        if(map.koopa[i].image == "vide.png"){
                            o++;
                        }
                        if(o == map.koopa.length-1){
                            if(koopawant != ""){
                                var koopaDie = new Audio('http://peal.io/download/tvqbh');
                                koopaDie.autoplay = true;
                                peach.getYou();
                            }
                        }
                        else{
                            if(koopawant != ""){
                                var koopaDie = new Audio('http://peal.io/download/tvqbh');
                                koopaDie.autoplay = true;
                                koopawant.die();
                            }
                        }
                    }
                }
                else if(collision == "peach"){
                    peach.getYou();
                }  
            }
            else{
                mario.falling = false;
            }
        }
    };
    this.die = function () {
        document.getElementById(mario.id).src = "vide.png";
        this.x = 0;
        this.y = 0;
        clearInterval(this.interval);
        this.update();
        setTimeout( function(){
            window.location.reload();
        }, 3000)
    };
    this.move = function (mov) {  
        if(this.onmove === false){
            if(mov == "l"){
                this.vitesseLeft++;
                if(this.vitesseLeft == 4){
                    if(document.getElementById(mario.id).src != "rickLeft.gif"){
                        document.getElementById(mario.id).src = "rickLeft.gif";
                    }
                    mario.x--;
                    this.vitesseLeft = 0;
                    this.onmove = true;
                }
            }
            else if(mov == "r"){
                this.vitesseRight++;
                if(this.vitesseRight == 4){
                    if(document.getElementById(mario.id).src != "rickRight.gif"){
                        document.getElementById(mario.id).src = "rickRight.gif";
                    }
                    mario.x++;
                    this.vitesseRight = 0;
                    this.onmove = true;
                }
            }
        }
        // si mario rencontre un koopa aprÃ¨s son dÃ©placement, il meurt
    };
    this.interval = setInterval(function () {
        mario.fall();
        //mario.move();
        mario.update();
        if(mario.jump['power'] < 3 && mario.falling === false){
            mario.makeJump();
        }
        mario.onmove = false
    }, 100);
};

var Koopa = function (y, x, image) {
    Cell.call(this, y, x , image);
    document.getElementById("pos("+this.x+","+this.y+")").classList.add("koopa");
    this.direction = 'left';
    this.die = function() {
        document.getElementById(this.id).src = "deathRobot.gif";
        this.x = 0;
        this.y = 0;
        clearInterval(this.interval);
        var thi = this
        setTimeout( function(){
            document.getElementById(thi.id).src = "vide.png";
            thi.image = "vide.png";
            thi.update();

        }, 200)

    };
    this.move = function () {
        var seeKoopa = false;
        var seeKoopa2 = false;
        if(this.direction == "left"){
            for(var i = 0; i < map.koopa.length; i++){
                if(map.koopa[i].x == this.x-1 && map.koopa[i].y == this.y){
                    map.koopa[i].direction = "left";
                    document.getElementById(map.koopa[i].id).style.transform = "rotateY(-360deg)";
                    seeKoopa = true;
                }
            }
            if(seeKoopa === true){
                this.direction = "right";
                document.getElementById(this.id).style.transform = "rotateY(-180deg)";
                this.move();
            }
            else if(map.checkCollision(map.map[this.y][this.x-1]) === true){
                this.x--;
                for(var i = 0; i < map.koopa.length; i++){
                    if(map.koopa[i].x == mario.x && map.koopa[i].y == mario.y && mario.y != 0  && mario.x != 0){
                        var marioDie = new Audio('http://peal.io/download/wn5l3');
                        marioDie.autoplay = true;
                        mario.die();
                    }
                }
            }
            else{
                this.direction = "right";
                document.getElementById(this.id).style.transform = "rotateY(-180deg)";
                this.move();
            }
        }
        else{
            for(var i = 0; i < map.koopa.length; i++){
                if(map.koopa[i].x == this.x+1 && map.koopa[i].y == this.y){
                    map.koopa[i].direction = "right";
                    document.getElementById(map.koopa[i].id).style.transform = "rotateY(-180deg)";
                    seeKoopa2 = true;
                }
            }
            if(seeKoopa2 === true){
                this.direction = "left";
                document.getElementById(this.id).style.transform = "rotateY(-360deg)";
                this.move();
            }
            else if(map.checkCollision(map.map[this.y][this.x+1]) === true){
                this.x++;
                for(var i = 0; i < map.koopa.length; i++){
                    if(map.koopa[i].x == mario.x && map.koopa[i].y == mario.y && mario.y != 0){
                        var marioDie = new Audio('http://peal.io/download/wn5l3');
                        marioDie.autoplay = true;
                        mario.die();
                    }
                }
            }
            else{
                this.direction = "left";
                document.getElementById(this.id).style.transform = "rotateY(-360deg)";
                this.move();
            }
        }
    };
    this.fall = function () {
        if(map.map[this.y+1][this.x].image != "block.png"){
            this.y++;
        }
    };
    var koopa = this;
    this.interval = setInterval(function () {
        koopa.fall();
        koopa.move();
        koopa.update();
    }, 200);
}

var Peach = function (y, x, image) {
    this.nb = 0;
    Cell.call(this, y, x , image);
    document.getElementById("pos("+this.x+","+this.y+")").classList.add("peach");
    this.getYou = function(){
        this.nb++;
        if(this.nb <= 1){
            for(var i = 0; i < map.koopa.length; i++){
                map.koopa[i].die();
            }
            clearInterval(mario.interval);
            document.getElementById(mario.id).src = "rickFace.png";
            mario.update();
            mario = null;
            var win = new Audio("http://peal.io/download/ldaze");
            win.autoplay = true;
            setTimeout(function(){
                window.location.reload();
            }, 3000)
        }
    }
    
};

var Input = function (key) {
    var keys = [];
    for(var j = 0; j < key.length; j++){
        keys[key[j]] = false;
    }
    function update() {
        requestAnimationFrame(update);
        if(mario != null){
            if (keys[32] === true && mario.falling === false && mario.y-1 > 0) {
                mario.makeJump();
            }
            if (keys[39] === true && mario.x+1 > 0) {
                var collision = map.checkCollision(map.map[mario.y][mario.x+1]);
                if(collision === true){
                    mario.move("r");
                }
                else if(collision == "peach"){
                        peach.getYou();
                }
            }
            if (keys[37] === true  && mario.x-1 > 0) {
                var collision = map.checkCollision(map.map[mario.y][mario.x-1]);
                if(collision === true){
                    mario.move("l");
                }
                else if(collision == "peach"){
                        peach.getYou();
                }
            }
            if(mario != null){
                if(keys[32] === false && keys[37] === false && keys[39] === false && mario.x != 0 && mario.y != 0){
                    document.getElementById(mario.id).src = "rickFace.png";
                }
            }
        }
    }

    update();

    document.body.addEventListener("keydown", function (e) {
        if(e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 39){
            keys[e.keyCode] = true;
        }
    });
    document.body.addEventListener("keyup", function (e) {
        if(e.keyCode == 32 || e.keyCode == 37 || e.keyCode == 39){
            keys[e.keyCode] = false;
        }
    });
    
}

var Map = function (model) {
    this.map = [];
    this.koopa = [];
    var ok = [];

    this.generateMap = function () {
        var start = new Audio('http://peal.io/download/6iens');
        start.autoplay = true;
        var div = document.createElement("div");
        div.id = "map";
        document.body.appendChild(div);
        for(var i = 0; i < model.length; i++){
            var div = document.createElement("div");
            div.id = "ligne"+i;
            div.className += "ligne";
            document.getElementById("map").appendChild(div);
            for(var j = 0; j < model[i].length; j++){
                if(model[i][j] == "w"){
                    ok.push(new Cell(i, j, "block.png"));
                }
                else if(model[i][j] == " "){
                    ok.push(new Cell(i, j, "vide.png"));
                }
                else if(model[i][j] == "k"){
                    ok.push(new Koopa(i, j, "robotRickLeft.gif"));
                    this.koopa.push(ok[j]);
                }
                else if(model[i][j] == "m"){
                    ok.push(mario = new Mario(i, j, "rickFace.png"));
                }
                else if(model[i][j] == "p"){
                    ok.push(peach = new Peach(i, j, "morty.png"));
                }
            }
            this.map.push(ok);
            ok = [];
        }
    };
    this.checkCollision = function (cell) {
        var ok = false;
        if(cell.image != "block.png"){
            if(cell.image == "morty.png"){
                    return "peach";
            }
            else{
                return true;
            }
        }
        else{
            return false;
        }
    };
    this.delete = function (cell) {
        // retire la cell de map
        // retire la cell du dom
        // delete la cell
    };
};

var schema = [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w                                   k  w',
    'w                wwwwwwwwwwwwwwwwwww   w',
    'w              ww                      w',
    'w            ww  w                     w',
    'w          ww    w  w     k   w    k   w',
    'w        ww      w  wwwwwwwwwwwwwwwwwwww',
    'w      ww        w                     w',
    'w    w          kw          k          w',
    'w   wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w  w                                   w',
    'w                                      w',
    'w   k   k    w     k   k w             w',
    'wwwwwwwwwwwwwwwwwwwwwwwwww            kw',
    'w                           wwwwwwwwwwww',
    'w                         wwwwwwwwwwwwww',
    'w                       wwwwwwwwwwwwwwww',
    'wm              p     wwwwwwwwwwwwwwwwww',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
];
var map = new Map(schema);
document.getElementById("startback").onclick = function(){
    document.getElementById("startback").style.width = "0%";
    document.getElementById("startback").style.height = "0%";
    document.getElementById("startback").style.margin = "0";
    map.generateMap();
}