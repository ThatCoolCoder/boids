class Boid extends wrk.GameEngine.DrawableEntity {
    static texture = wrk.GameEngine.Texture.fromUrl('/boid.png');

    constructor(position, velocity, maxSpeed, size, behaviour, maxZDepth=0) {
        super('boid', position, 0, Boid.texture, size);
        this.velocity = wrk.v.copy(velocity);
        this.maxSpeed = maxSpeed;
        this.acceleration = wrk.v(0, 0);
        this.trueSize = wrk.v.copy(size);
        this.behaviour = behaviour;
        this.maxZDepth = maxZDepth;
    }

    fastDistSq(v1, v2) {
        // This is a faster version of wrk.v.distSq()
        // Using this QUADRUPLES the frame rate!
        // I think I need to speed up wrk.v.distSq()

        var dx = v2.x - v1.x;
        var dy = v2.y - v1.y;
        var dz = v2.z - v1.z;

        return dx ** 2 + dy ** 2 + dz ** 2;
    }

    applyAcceleration(acceleration) {
        if (wrk.v.mag(acceleration) > 0.05) {
            wrk.v.normalize(acceleration);
            wrk.v.mult(acceleration, 0.05);
        }
        wrk.v.add(this.velocity, acceleration);
    }

    steerTowards(position, speedMult=1) {
        var direction = wrk.v.copySub(position, this.localPosition);
        wrk.v.normalize(direction);
        wrk.v.mult(direction, this.maxSpeed * speedMult);
        wrk.v.sub(direction, this.velocity);
        this.applyAcceleration(direction);
    }

    cohesionRule(boidList) {
        var meanPos = wrk.v(0, 0);
        var boidCount = 0;
        for (var boid of boidList) {
            if (boid == this) continue;
            if (this.fastDistSq(this.localPosition, boid.localPosition) <
                this.behaviour.cohesionDist ** 2) {
                wrk.v.add(meanPos, boid.localPosition);
                boidCount ++;
            }
        }

        if (boidCount > 0) {
            wrk.v.div(meanPos, boidCount);
            wrk.v.sub(meanPos, this.localPosition);
            wrk.v.mult(meanPos, this.behaviour.cohesionStrength);
            wrk.v.add(this.acceleration, meanPos);
        }
    }

    avoidanceRule(boidList) {
        var desiredVelocity = wrk.v(0, 0);
        var boidCount = 0;

        for (var boid of boidList) {
            if (boid == this) continue;
            var distSq = this.fastDistSq(this.localPosition, boid.localPosition);
            if (distSq < this.behaviour.avoidanceDist ** 2 && distSq > 0) {
                wrk.v.add(desiredVelocity, this.localPosition);
                wrk.v.sub(desiredVelocity, boid.localPosition)
                boidCount ++;
            }
        }

        // Average the steering amount to steer away from all boids
        if (boidCount > 0) {
            wrk.v.div(desiredVelocity, boidCount);

            wrk.v.mult(desiredVelocity, this.behaviour.avoidanceStrength);
            wrk.v.add(this.acceleration, desiredVelocity);
        }
    }

    alignmentRule(boidList) {
        var meanVel = wrk.v(0, 0);
        var boidCount = 0;
        for (var boid of boidList) {
            if (boid == this) continue;
            var distSq = this.fastDistSq(boid.localPosition, this.localPosition);
            if (distSq < this.behaviour.alignmentDist ** 2) {
                wrk.v.add(meanVel, boid.velocity);
                boidCount ++;
            }
        }

        if (boidCount > 0) {
            wrk.v.div(meanVel, boidCount);
            wrk.v.sub(meanVel, this.velocity);
            wrk.v.mult(meanVel, this.behaviour.alignmentStrength);
            wrk.v.add(this.acceleration, meanVel);
        }
    }

    limitSpeed() {
        if (wrk.v.magSq(this.velocity) > this.maxSpeed ** 2) {
            wrk.v.normalize(this.velocity);
            wrk.v.mult(this.velocity, this.maxSpeed);
        }
    }

    wrapAround() {
        // If you hit the canvas border, wrap around to other side
        // But if you hit the z-Border, then just be constrained

        if (this.localPosition.x < 0) {
            this.localPosition.x = wrk.GameEngine.canvasSize.x;
        }
        if (this.localPosition.x > wrk.GameEngine.canvasSize.x) {
            this.localPosition.x = 0;
        }
        if (this.localPosition.y < 0) {
            this.localPosition.y = wrk.GameEngine.canvasSize.y;
        }
        if (this.localPosition.y > wrk.GameEngine.canvasSize.y) {
            this.localPosition.y = 0;
        }
        if (this.maxZDepth != 0) {
            if (this.localPosition.z < 0) {
                this.localPosition.z = 0;
            }
            if (this.localPosition.z > this.maxZDepth) {
                this.localPosition.z = this.maxZDepth;
            }
        }
    }

    pointInTravelDirection() {
        // If we are moving at a noticable speed, point in that direction
        if (wrk.v.mag(this.velocity) > 0.2) {
            this.setLocalAngle(wrk.v.heading(this.velocity) - wrk.PI / 2);
        }
    }

    shrinkFor3dEffect() {
        if (this.maxZDepth != 0) {
            var distanceFromFromFront = (this.localPosition.z / this.maxZDepth) / 2 + 0.5;
            this.setTextureSize(wrk.v.copyMult(this.trueSize, distanceFromFromFront));
        }
    }

    move(boidList) {
        this.avoidanceRule(boidList);
        this.cohesionRule(boidList);
        this.alignmentRule(boidList);

        wrk.v.mult(this.acceleration, 1);
        wrk.v.add(this.velocity, this.acceleration);
        this.limitSpeed();
        var movement = wrk.v.copyMult(this.velocity, 1);
        wrk.v.add(this.localPosition, movement);

        this.acceleration.x = 0;
        this.acceleration.y = 0;
        this.acceleration.z = 0;

        this.wrapAround();

        this.pointInTravelDirection();

        this.shrinkFor3dEffect();
    }
}