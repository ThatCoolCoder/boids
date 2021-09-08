class Boid extends spnr.GameEngine.DrawableEntity {
    static texture = spnr.GameEngine.Texture.fromUrl('boid.png');

    constructor(position, velocity, maxSpeed, size, behaviour, maxZDepth=0) {
        super('boid', position, 0, Boid.texture, size);
        this.velocity = spnr.v.copy(velocity);
        this.maxSpeed = maxSpeed;
        this.acceleration = spnr.v(0, 0);
        this.trueSize = spnr.v.copy(size);
        this.behaviour = behaviour;
        this.maxZDepth = maxZDepth;
    }

    fastDistSq(v1, v2) {
        // This is a faster version of spnr.v.distSq()
        // Using this QUADRUPLES the frame rate!
        // I think I need to speed up spnr.v.distSq()

        var dx = v2.x - v1.x;
        var dy = v2.y - v1.y;
        var dz = v2.z - v1.z;

        return dx ** 2 + dy ** 2 + dz ** 2;
    }

    applyAcceleration(acceleration) {
        if (spnr.v.mag(acceleration) > 0.05) {
            spnr.v.normalize(acceleration);
            spnr.v.mult(acceleration, 0.05);
        }
        spnr.v.add(this.velocity, acceleration);
    }

    steerTowards(position, speedMult=1) {
        var direction = spnr.v.copySub(position, this.localPosition);
        spnr.v.normalize(direction);
        spnr.v.mult(direction, this.maxSpeed * speedMult);
        spnr.v.sub(direction, this.velocity);
        this.applyAcceleration(direction);
    }

    cohesionRule(boidList) {
        var meanPos = spnr.v(0, 0);
        var boidCount = 0;
        for (var boid of boidList) {
            if (boid == this) continue;
            if (this.fastDistSq(this.localPosition, boid.localPosition) <
                this.behaviour.cohesionDist ** 2) {
                spnr.v.add(meanPos, boid.localPosition);
                boidCount ++;
            }
        }

        if (boidCount > 0) {
            spnr.v.div(meanPos, boidCount);
            spnr.v.sub(meanPos, this.localPosition);
            spnr.v.mult(meanPos, this.behaviour.cohesionStrength);
            spnr.v.add(this.acceleration, meanPos);
        }
    }

    avoidanceRule(boidList) {
        var desiredVelocity = spnr.v(0, 0);
        var boidCount = 0;

        for (var boid of boidList) {
            if (boid == this) continue;
            var distSq = this.fastDistSq(this.localPosition, boid.localPosition);
            if (distSq < this.behaviour.avoidanceDist ** 2 && distSq > 0) {
                spnr.v.add(desiredVelocity, this.localPosition);
                spnr.v.sub(desiredVelocity, boid.localPosition)
                boidCount ++;
            }
        }

        // Average the steering amount to steer away from all boids
        if (boidCount > 0) {
            spnr.v.div(desiredVelocity, boidCount);

            spnr.v.mult(desiredVelocity, this.behaviour.avoidanceStrength);
            spnr.v.add(this.acceleration, desiredVelocity);
        }
    }

    alignmentRule(boidList) {
        var meanVel = spnr.v(0, 0);
        var boidCount = 0;
        for (var boid of boidList) {
            if (boid == this) continue;
            var distSq = this.fastDistSq(boid.localPosition, this.localPosition);
            if (distSq < this.behaviour.alignmentDist ** 2) {
                spnr.v.add(meanVel, boid.velocity);
                boidCount ++;
            }
        }

        if (boidCount > 0) {
            spnr.v.div(meanVel, boidCount);
            spnr.v.sub(meanVel, this.velocity);
            spnr.v.mult(meanVel, this.behaviour.alignmentStrength);
            spnr.v.add(this.acceleration, meanVel);
        }
    }

    limitSpeed() {
        if (spnr.v.magSq(this.velocity) > this.maxSpeed ** 2) {
            spnr.v.normalize(this.velocity);
            spnr.v.mult(this.velocity, this.maxSpeed);
        }
    }

    wrapAround() {
        // If you hit the canvas border, wrap around to other side
        // But if you hit the z-Border, then just be constrained

        if (this.localPosition.x < 0) {
            this.localPosition.x = spnr.GameEngine.canvasSize.x;
        }
        if (this.localPosition.x > spnr.GameEngine.canvasSize.x) {
            this.localPosition.x = 0;
        }
        if (this.localPosition.y < 0) {
            this.localPosition.y = spnr.GameEngine.canvasSize.y;
        }
        if (this.localPosition.y > spnr.GameEngine.canvasSize.y) {
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
        if (spnr.v.mag(this.velocity) > 0.2) {
            this.setLocalAngle(spnr.v.heading(this.velocity) - spnr.PI / 2);
        }
    }

    fake3dEffect() {
        if (this.maxZDepth != 0) {
            var distanceFromFromFront = (this.localPosition.z / this.maxZDepth) / 2 + 0.5;

            var squishFactorVector = spnr.v(this.velocity.z,
                spnr.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2));
            var squishFactor = spnr.abs(spnr.v.heading(squishFactorVector)) / (spnr.PI / 2);
            squishFactor = spnr.max(0.1, squishFactor); // restrict maximum squishing

            var textureSize = spnr.v.copyMult(this.trueSize, distanceFromFromFront); // make smaller ones further
            textureSize.y *= squishFactor; // make turning ones look short
            this.setTextureSize(textureSize);
        }
    }

    move(boidList) {
        this.avoidanceRule(boidList);
        this.cohesionRule(boidList);
        this.alignmentRule(boidList);

        spnr.v.mult(this.acceleration, 1);
        spnr.v.add(this.velocity, this.acceleration);
        this.limitSpeed();
        var movement = spnr.v.copyMult(this.velocity, 1);
        spnr.v.add(this.localPosition, movement);

        this.acceleration.x = 0;
        this.acceleration.y = 0;
        this.acceleration.z = 0;

        this.wrapAround();

        this.pointInTravelDirection();

        this.fake3dEffect();
    }
}