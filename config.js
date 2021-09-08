const config = {
    bgColor : 0x000000,
    windowProportionTaken : spnr.v(0.98, 0.98),
    is3d : false,

    flockSize : 150,
    heightRange : new Range(12, 12),
    aspectRatio : 0.5,
    speedRange : new Range(2, 4),
    behaviour : {
        cohesionDist : 100,
        cohesionStrength : 0.001,
        avoidanceDist : 20,
        avoidanceStrength : 0.025,
        alignmentDist : 100,
        alignmentStrength : 0.05
    }
}