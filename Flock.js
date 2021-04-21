class Flock extends wrk.GameEngine.Entity {
    constructor(size, boidHeightRange, boidAspectRatio, speedRange, behaviour, is3d=false, boidColor=0xffffff) {
        // Behaviour is a dict with keys:
        // cohesionDist, cohesionStrength, alignmentDist, alignmentStrength,
        // avoidanceDist, avoidanceStrength

        super('flock', wrk.v(0, 0), 0);
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
            var canvasSize = wrk.GameEngine.canvasSize;
            var maxBoidPos = wrk.v(canvasSize.x, canvasSize.y, wrk.mean(canvasSize.x, canvasSize.y));
        }
        else {
            var maxBoidPos = wrk.GameEngine.canvasSize;
        }

        wrk.doNTimes(this.size, i => {
            var height = wrk.randint(this.boidHeightRange.min, this.boidHeightRange.max);
            var size = wrk.v(height * this.boidAspectRatio, height);
            var position = wrk.v.random(wrk.v(0, 0), maxBoidPos);
            var maxSpeed = wrk.randint(this.speedRange.min, this.speedRange.max);
            var vel = wrk.v(0, wrk.randint(0, maxSpeed));
            wrk.v.rotate(vel, wrk.randint(0, 360), true);

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