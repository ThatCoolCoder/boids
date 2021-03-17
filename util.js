function getViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

function getViewportHeight() { 
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}

function randflt(min, max) {
    var diff = max - min;
    return Math.random() * diff + min;
}

function randint(min, max) {
    return Math.floor(randflt(min, max));
}

function darkenColorChannel(dataArray) {
    var darkenChannel = dataArray[0];
    var colorLimits = dataArray[1];
    
    switch(darkenChannel) {
        case 'r':
        colorLimits[0] = [0, 40];
        break;

        case 'g':
        colorLimits[1] = [0, 40];
        break;

        case 'b':
        colorLimits[2] = [0, 40];
        break;
    }

    return colorLimits;
}

function generateBrightColor() {
    // uses RGB 100 colors
    var colorChannels = ['r', 'g', 'b'];

    var colorLimits = [
        [40, 100], // r
        [40, 100], // g
        [40, 100]  // b
    ];
    
    // chooose how many color channels will be dark
    var darkColorAmount = randint(1, 3); // will be 1 or 2

    if (darkColorAmount == 1) {
        // pick a rand color channel and reduce its max brightness
        var darkColor = colorChannels[randint(0, 3)];
        colorLimits = darkenColorChannel([darkColor, colorLimits]);
    }
    else {
        // remove 1 color to be dark
        var darkColor1Idx = randint(0, 3);
        var darkColor1 = colorChannels[darkColor1Idx];
        colorChannels.splice(darkColor1Idx, 1);

        // remove another color to be dark
        var darkColor2Idx = randint(0, 3);
        var darkColor2 = colorChannels[darkColor2Idx];
        colorChannels.splice(darkColor2Idx, 1);

        var brightColor = colorChannels[0];

        // darken the two channels that need to be darkened
        colorLimits = darkenColorChannel([darkColor1, colorLimits]);
        colorLimits = darkenColorChannel([darkColor2, colorLimits]);

        // brighten the remaining color
        switch(colorChannels[0]) {
            case 'r':
            colorLimits[0] = [80, 100];
            break;

            case 'g':
            colorLimits[1] = [80, 100];
            break;

            case 'b':
            colorLimits[2] = [80, 100];
            break;
        }
    }
    
    var rLimits = colorLimits[0];
    var r = randint(rLimits[0], rLimits[1]);

    var gLimits = colorLimits[1];
    var g = randint(gLimits[0], gLimits[1]);

    var bLimits = colorLimits[2];
    var b = randint(bLimits[0], bLimits[1]);
    return [r, g, b];
}

function generateShadeOfGrey() {
    // assumes RGB 100 color mode
    var brightness = randint(0, 100);
    return [brightness, brightness, brightness];
}