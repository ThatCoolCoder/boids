function resizeCanvas() {
    var size = wrk.v(wrk.dom.viewportWidth() * config.windowProportionTaken.x,
        wrk.dom.viewportHeight() * config.windowProportionTaken.y);
    wrk.GameEngine.setCanvasSize(size);
}

wrk.GameEngine.init(wrk.v(1, 1), 1, config.bgColor);

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

var flock = new Flock(config.flockSize, config.heightRange, config.speedRange, config.behaviour, config.is3d, config.boidColor);

var scene = new wrk.GameEngine.Scene('scene');
scene.addChild(flock);

wrk.GameEngine.selectScene(scene);