var sharedGameScene;
var velocidadeTiro = 50;

var GameLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {

        this._super();

        sharedGameScene = this;

        var size = cc.winSize;

        this.imgBackground = new cc.Sprite(res.bgGame_png);
        this.imgBackground.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.imgBackground.setAnchorPoint(0.5, 0.5)
        this.addChild(this.imgBackground, 0);


        this.basePlayer = new cc.Sprite(res.baseWeapon_png);
        this.basePlayer.attr({
            x: size.width / 2,
            y: 40
        });
        this.basePlayer.setAnchorPoint(0.5, 0.5)
        this.addChild(this.basePlayer, 2);

        this.player = new cc.Sprite(res.weapon_png);
        this.player.attr({
            x: size.width / 2,
            y: 80
        });
        this.player.setAnchorPoint(0.5, 0.1);
        this.player.setName("player");
        this.addChild(this.player, 2);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {

                this.target = event.getCurrentTarget();
                this.player = sharedGameScene.getChildByName("player");
                
                x = touches[0].getLocationX();
                y = touches[0].getLocationY();

                this.bala = new cc.Sprite(res.point_png);
                this.bala.attr({
                    x: this.player.getPosition().x,
                    y: this.player.getPosition().y
                });

                sharedGameScene.addChild(this.bala, 1);
                
                this.angulo = calcularAnguloDoisPontos(this.player.getPosition(), touches[0].getLocation());
                var action = cc.rotateTo(0.1, this.angulo);
                this.player.runAction(action);
               
                this.posicaoFinal = calcularPosicaoFinalDoTiro(touches[0].getLocation(), this.player.getPosition());
                this.distancia = calcularDistanciaEntrePontos(touches[0].getLocation(), this.player.getPosition());
                this.tempo = this.distancia / velocidadeTiro;
                
                var moveAction = cc.moveTo(this.tempo, this.posicaoFinal);
                this.bala.runAction(moveAction);
            }
        }, this);
        

        return true;
    }
});


var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    },

    onUpdate: function () {

    }
});

function  calcularAnguloDoisPontos(p1, p2) {
    var deltaX = parseFloat(p2.x - p1.x);
    var deltaY = parseFloat(p2.y - p1.y);
    var angleRadians = Math.atan2(deltaY, deltaX);
    var angleDegress = cc.radiansToDegrees(angleRadians);
    var cocosAngle = -1 * angleDegress;
    console.log(cocosAngle);
    return -1 * (270 - cocosAngle);
}

function calcularPosicaoFinalDoTiro(p1, p2) {
    var offset = new cc.p(p1.x - p2.x, p1.y - p2.y);
    var length = Math.sqrt((p1.x * p2.x) + (p1.y * p2.y));
    var direction = new cc.p(offset.x / length, offset.y / length);
    var shootAmount = new cc.p(direction.x * 10000, direction.y * 10000);
    return new cc.p(p2.x + shootAmount.x, p2.y + shootAmount.y);
}

function calcularDistanciaEntrePontos(p1,p2){
    var xDist = p2.x - p1.x;
    var yDist = p2.y - p1.y
    return Math.sqrt((xDist*xDist)+(yDist*yDist));
}

