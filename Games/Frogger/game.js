var audioStarted = false;

function start_game()
{
    game = new Game,
    document.addEventListener("keydown", function(e)
    {
        if (!audioStarted)
        {
            theme.play();
            audioStarted = true;
        }
        if (37 === e.keyCode || 38 === e.keyCode || 39 === e.keyCode || 40 === e.keyCode) {
            e.preventDefault();
        }
        if (-1 === game.dead && game.lives > 0) {
            if (38 === e.keyCode) {
                up();
            } else if (40 === e.keyCode) {
                down();
            } else if (37 === e.keyCode) {
                left();
            } else if (39 === e.keyCode) {
                right();
            }
        }
    });
    board = document.getElementById("game"),
    context = board.getContext("2d"),
    theme = document.createElement("audio"),
    theme.setAttribute("src", "assets/frogger.mp3"),
    theme.setAttribute("loop", "true"),
    sprites = new Image,
    deadsprite = new Image,
    sprites.src = "assets/frogger_sprites.png",
    deadsprite.src = "assets/dead_frog.png",
    sprites.onload = function()
    {
        draw_bg(),
        draw_info(),
        make_cars(),
        make_logs(),
        draw_frog(),
        setInterval(game_loop, 50)
    }
}
function game_loop()
{
    draw_bg(),
    draw_info(),
    draw_cars(),
    draw_logs(),
    draw_wins(),
    game.lives > 0 ? draw_frog() : game_over()
}
function draw_bg()
{
    context.fillStyle = "#191970",
    context.fillRect(0, 0, 399, 229),
    context.fillStyle = "#000000",
    context.fillRect(0, 229, 399, 228),
    context.drawImage(sprites, 0, 0, 399, 113, 0, -55, 399, 113),
    context.drawImage(sprites, 0, 119, 399, 34, 0, 229, 399, 34),
    context.drawImage(sprites, 0, 119, 399, 34, 0, 440, 399, 34)
}
function draw_info()
{
    context.clearRect(0, 474, 400, 60);
    draw_lives(),
    context.font = "bold 14pt arial",
    context.fillStyle = "#00EE00",
    context.fillText("Level ", 74, 490),
    draw_level(),
    context.font = "bold 10pt arial",
    context.fillText("Score: ", 4, 505),
    context.fillText("Highscore: ", 200, 505),
    draw_score()
}
function draw_lives()
{
    var e = 4, t = 532;
    game.score - 1e4 * game.extra >= 1e4 && game.lives < 4 && game.extra++;
    for (var o = 0; o < game.lives + game.extra; o++) context.drawImage(sprites, 13, 334, 17, 23, e, t - 55, 11, 15), e += 14;
}
function draw_level()
{
    context.font = "bold 15pt arial",
    context.fillStyle = "#00EE00",
    context.fillText(game.level, 131, 490)
}
function draw_score()
{
    context.font = "bold 10pt arial",
    context.fillStyle = "#00EE00",
    context.fillText(game.score, 49, 505),
    highscore = window.localStorage.highscore ? localStorage.highscore : 0,
    context.fillText(highscore, 272, 505)
}
function draw_frog()
{
    if (game.log = log_collision(), game.dead > 0) context.drawImage(deadsprite, 4, 2, 19, 24, game.posX, game.posY - 55, 19, 24), game.dead--;
    else if (0 == game.dead) game.reset();
    else if (game.win > 0) game.win--;
    else if (0 == game.win) game.reset();
    else if (car_collision()) sploosh();
    else if (water_collision() && -1 == game.log) sploosh();
    else if (check_win()) win();
    else
    {
        if (game.log >= 0)
        {
            var e = game.posX - logs[game.log].dir * logs[game.log].speed;
            bounds_check(e, game.posY) && (game.posX = e)
        }
        "u" == game.facing ? context.drawImage(sprites, 12, 369, 23, 17, game.posX, game.posY - 55, 23, 17) : "d" == game.facing ? context.drawImage(sprites, 80, 369, 23, 17, game.posX, game.posY - 55, 23, 17) : "l" == game.facing ? context.drawImage(sprites, 80, 335, 19, 23, game.posX, game.posY - 55, 19, 23) : "r" == game.facing && context.drawImage(sprites, 12, 335, 19, 23, game.posX, game.posY - 55, 19, 23)
    }
}
function draw_wins()
{
    for (var e = 0; e < game.won.length; e++)
        if (game.won[e])
            switch (e)
            {
                case 0:
                    context.drawImage(sprites, 80, 369, 23, 17, 15, 25, 23, 17);
                    break;
                case 1:
                    context.drawImage(sprites, 80, 369, 23, 17, 101, 25, 23, 17);
                    break;
                case 2:
                    context.drawImage(sprites, 80, 369, 23, 17, 187, 25, 23, 17);
                    break;
                case 3:
                    context.drawImage(sprites, 80, 369, 23, 17, 270, 25, 23, 17);
                    break;
                case 4:
                    context.drawImage(sprites, 80, 369, 23, 17, 354, 25, 23, 17)
            }
}
function draw_cars()
{
    for (var e = 0; e < cars.length; e++) cars[e].move(), cars[e].out_of_bounds() && (cars[e] = make_car(cars[e].lane, null, cars[e].model)), cars[e].draw();
}
function draw_logs()
{
    for (var e = 0; e < logs.length; e++) logs[e].move(), logs[e].out_of_bounds() && (logs[e] = make_log(logs[e].row)), logs[e].draw();
}
function game_over()
{
    context.font = "bold 72pt arial",
    context.fillStyle = "#FFFFFF",
    context.fillText("GAME", 60, 95),
    context.fillText("OVER", 60, 245),
    game.score >= highscore && (localStorage.highscore = game.score,
    context.font = "bold 48pt arial",
    context.fillStyle = "#00EE00",
    context.fillText("YOU GOT A", 20, 325),
    context.fillText("HIGHSCORE", 6, 405))
}
function up()
{
    bounds_check(game.posX, game.posY - 30) && (game.posY -= 30,
    game.current++),
    game.current > game.highest && (game.score += 10,
    game.highest++),
    game.facing = "u"
}
function down()
{
    bounds_check(game.posX, game.posY + 30) && (game.posY += 30,
    game.current--),
    game.facing = "d"
}
function left()
{
    bounds_check(game.posX - 30, game.posY) && (game.posX -= 30),
    game.facing = "l"
}
function right()
{
    bounds_check(game.posX + 30, game.posY) && (game.posX += 30),
    game.facing = "r"
}
function bounds_check(e, t)
{
    return t > 90 && 510 > t && e > 0 && 369 > e ? !0 : t > 60 && 100 > t && (e > 5 && 40 > e && !game.won[0] || e > 92 && 128 > e && !game.won[1] || e > 178 && 214 > e && !game.won[2] || e > 263 && 299 > e && !game.won[3] || e > 347 && 383 > e && !game.won[4]) ? !0 : !1
}
function check_win()
{
    if (game.posY > 60 && game.posY < 100)
    {
        if (game.posX > 5 && game.posX < 40 && !game.won[0]) return game.won[0] = !0, !0;
        if (game.posX > 92 && game.posX < 128 && !game.won[1]) return game.won[1] = !0, !0;
        if (game.posX > 178 && game.posX < 214 && !game.won[2]) return game.won[2] = !0, !0;
        if (game.posX > 263 && game.posX < 299 && !game.won[3]) return game.won[3] = !0, !0;
        if (game.posX > 347 && game.posX < 383 && !game.won[4]) return game.won[4] = !0, !0
    }
    return !1
}
function win()
{
    game.score += 50,
    game.win = 15,
    game.won[0] && game.won[1] && game.won[2] && game.won[3] && game.won[4] && level()
}
function level()
{
    for (var e = 0; e < game.won.length; e++) game.won[e] = !1;
    game.score += 1e3,
    game.level++
}
function collides(e, t, o, s, a, n, i, r)
{
    return a + i >= e && e >= a && n + r >= t && t >= n || a + i >= e + o && e + o >= a && n + r >= t && t >= n || a + i >= e && e >= a && n + r >= t + s && t + s >= n || a + i >= e + o && e + o >= a && n + r >= t + s && t + s >= n
}
function car_collision()
{
    if (game.posY < 505 && game.posY > 270)
        for (var e = 0; e < cars.length; e++)
            if (collides(game.posX, game.posY, game.width, game.height, cars[e].posX, cars[e].posY, cars[e].width, cars[e].height)) return !0;
    return !1
}
function log_collision()
{
    if (game.posY < 270)
        for (var e = 0; e < logs.length; e++)
            if (collides(game.posX, game.posY, game.width, game.height, logs[e].posX, logs[e].posY, logs[e].width, logs[e].height)) return e;
    return -1;
}
function water_collision()
{
    return game.posY > 105 && game.posY < 270
}
function sploosh()
{
    game.lives--,
    game.dead = 20
}
function make_cars()
{
    cars = [make_car(0), make_car(0, 130, 3), make_car(0, 260, 3), make_car(1), make_car(2), make_car(2, 150, 0), make_car(3, 200), make_car(4), make_car(5), make_car(5, 80), make_car(5, 240)]
}
function make_car(e, t, o)
{
    switch (e)
    {
        case 0:
            return new Car(null == t ? -25 : t,rows[e],e,3,null == o ? 1 : o);
        case 1:
            return new Car(null == t ? 399 : t,rows[e],e,2,null == o ? 0 : o);
        case 2:
            return new Car(null == t ? 399 : t,rows[e],e,4,null == o ? 2 : o);
        case 3:
            return new Car(null == t ? -25 : t,rows[e],e,3,null == o ? 3 : o);
        case 4:
            return new Car(null == t ? 399 : t,rows[e],e,3,null == o ? 0 : o);
        case 5:
            return new Car(null == t ? 399 : t,rows[e],e,4,null == o ? 4 : o)
    }
}
function make_logs()
{
    logs = [make_log(7), make_log(7, 170), make_log(8), make_log(8, 200), make_log(9), make_log(10), make_log(11), make_log(11, 100, 0), make_log(12)];
}
function make_log(e, t, o)
{
    switch (e)
    {
        case 7:
            return new Log(null == t ? 399 : t,rows[e],e,1,1,null == o ? 1 : o);
        case 8:
            return new Log(null == t ? -85 : t,rows[e],e,4,-1,null == o ? 2 : o);
        case 9:
            return new Log(null == t ? 399 : t,rows[e],e,2,1,null == o ? 0 : o);
        case 10:
            return new Log(null == t ? -85 : t,rows[e],e,2,-1,null == o ? 1 : o);
        case 11:
            return new Log(null == t ? 399 : t,rows[e],e,3,1,null == o ? 1 : o);
        case 12:
            return new Log(null == t ? -85 : t,rows[e],e,3,-1,null == o ? 2 : o)
    }
}
function Car(e, t, o, s, a)
{
    this.posX = e,
    this.posY = t,
    this.lane = o,
    this.speed = s,
    this.model = a,
    this.width = models[a].width,
    this.height = models[a].height,
    this.move = function()
    {
        this.posX = this.posX - models[a].dir * this.speed * game.level
    },
    this.draw = function()
    {
        switch (this.model)
        {
            case 0:
                context.drawImage(sprites, 8, 265, 30, 22, this.posX, this.posY - 55, 30, 22);
                break;
            case 1:
                context.drawImage(sprites, 45, 264, 29, 24, this.posX, this.posY - 55, 29, 24);
                break;
            case 2:
                context.drawImage(sprites, 81, 263, 24, 26, this.posX, this.posY - 55, 24, 26);
                break;
            case 3:
                context.drawImage(sprites, 9, 300, 24, 21, this.posX, this.posY - 55, 24, 21);
                break;
            case 4:
                context.drawImage(sprites, 105, 301, 46, 19, this.posX, this.posY - 55, 46, 19)
        }
    },
    this.out_of_bounds = function()
    {
        return this.posX + this.width < 0 || this.posX > 399
    }
}
function Log(e, t, o, s, a, n)
{
    this.posX = e,
    this.posY = t,
    this.row = o,
    this.speed = s,
    this.dir = a,
    this.length = n,
    this.width = lengths[n].width,
    this.height = lengths[n].height,
    this.move = function() {
        this.posX = this.posX - this.dir * this.speed
    },
    this.draw = function()
    {
        switch (this.length)
        {
            case 0:
                context.drawImage(sprites, 6, 165, 179, 21, this.posX, this.posY - 55, 179, 21);
                break;
            case 1:
                context.drawImage(sprites, 5, 197, 118, 21, this.posX, this.posY - 55, 118, 21);
                break;
            case 2:
                context.drawImage(sprites, 6, 229, 85, 22, this.posX, this.posY - 55, 85, 22)
        }
    },
    this.out_of_bounds = function()
    {
        return this.posX + this.width < 0 || this.posX > 399
    }
}
function Game()
{
    this.lives = 5,
    this.extra = 0,
    this.level = 1,
    this.score = 0,
    this.posX = 187,
    this.posY = 503,
    this.facing = "u",
    this.log = -1,
    this.current = -1,
    this.highest = -1,
    this.dead = -1,
    this.win = -1,
    this.won = [!1, !1, !1, !1, !1],
    this.reset = function()
    {
        this.posY = 503,
        this.posX = 187,
        this.facing = "u",
        this.log = -1,
        this.current = -1,
        this.highest = -1,
        this.dead = -1,
        this.win = -1
    }
}
var models = [{width: 30, height: 22, dir: 1}, {width: 29, height: 24, dir: -1}, {width: 24, height: 26, dir: 1}, {width: 24, height: 21, dir: -1}, {width: 46, height: 19, dir: 1}], lengths = [{width: 179, height: 21}, {width: 118, height: 21}, {width: 85, height: 22}], rows = [473, 443, 413, 383, 353, 323, 288, 261, 233, 203, 173, 143, 113];
