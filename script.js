document.body.style.backgroundColor = '#' + ('00000' + config.bgColor.toString(16)).slice(-6);

function resizeCanvas() {
    var size = spnr.v(spnr.dom.viewportWidth() * config.windowProportionTaken.x,
        spnr.dom.viewportHeight() * config.windowProportionTaken.y);
    spnr.GameEngine.setCanvasSize(size);
}

spnr.GameEngine.init(spnr.v(1, 1), 1, config.bgColor);

resizeCanvas();

window.addEventListener('resize', resizeCanvas);

var flock = new Flock(config.flockSize, config.heightRange, config.aspectRatio, config.speedRange, config.behaviour, config.is3d, config.boidColor);

var scene = new spnr.GameEngine.Scene('scene');
scene.addChild(flock);

spnr.GameEngine.selectScene(scene);