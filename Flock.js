class Flock extends spnr.GameEngine.Entity {
    constructor(size, boidHeightRange, boidAspectRatio, speedRange, behaviour, is3d=false, boidColor=0xffffff) {
        // Behaviour is a dict with keys:
        // cohesionDist, cohesionStrength, alignmentDist, alignmentStrength,
        // avoidanceDist, avoidanceStrength

        super('flock', spnr.v(0, 0), 0);
        this.size = size;
        this.boidHeightRange = boidHeightRange;
        this.boidAspectRatio = boidAspectRatio;
        this.speedRange = speedRange;
        this.behaviour = behaviour;
        this.boidColor = boidColor;
        this.createBoids(is3d);
    }

    createBoids(is3d) {
        this.removeChildren();

        if (is3d) {
            var canvasSize = spnr.GameEngine.canvasSize;
            var maxBoidPos = spnr.v(canvasSize.x, canvasSize.y, spnr.mean(canvasSize.x, canvasSize.y));
        }
        else {
            var maxBoidPos = spnr.GameEngine.canvasSize;
        }

        spnr.doNTimes(this.size, i => {
            var height = spnr.randint(this.boidHeightRange.min, this.boidHeightRange.max);
            var size = spnr.v(height * this.boidAspectRatio, height);
            var position = spnr.v.random(spnr.v(0, 0), maxBoidPos);
            var maxSpeed = spnr.randint(this.speedRange.min, this.speedRange.max);
            var vel = spnr.v(0, spnr.randint(0, maxSpeed));
            spnr.v.rotate(vel, spnr.randint(0, 360), true);

            var boid = new Boid(position, vel, maxSpeed, size, this.behaviour, maxBoidPos.z);
            boid.setTint(this.boidColor);
            this.addChild(boid);
        });
    }

    update() {
        this.children.forEach((child) => {
            child.move(this.children);
        })
    }
}