// wrk.js v1.3.0
// Protected under GNU General Public License v3.0

// Setup wrk instance

if (window.wrk !== undefined) {

    // This doesn't look like it should work (wrk is not defined yet in this file)...
    // ...but it will because wrk has already been defined (that's why we're warning the user!)
    wrk.internalWarn('An instance of wrk.js is already running');
}
else {
    var wrk = {}; // Create an object to be the basis of wrk
    wrk.VERSION = 'v1.3.0';
    wrk.consoleLogHeader = '  🔧🔧 ';
    wrk.consoleLogStyling = 'background-color: #9cc8ff; display: block';
    window.wrk = wrk; // Make it global

    // Make a 'hello' message
    console.log(`%c  \n${wrk.consoleLogHeader} wrk.js ${wrk.VERSION}  \n  `,
        wrk.consoleLogStyling);

    // Load the 'consts' from math
    Object.getOwnPropertyNames(Math).forEach(key => {
        wrk[key] = Math[key];
    });
}

wrk.internalLog = function(message) {
    var fullMessage = '%c' + wrk.consoleLogHeader + message;
    console.log(fullMessage, wrk.consoleLogStyling);
}

wrk.internalWarn = function(message) {
    var fullMessage = `${wrk.consoleLogHeader} wrk.js warning:\n  ${message}`;
    console.warn(fullMessage);
}

wrk.uniqueId = function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + wrk.random().toString(36).substr(2, 9);
}

wrk.randBoolean = function() {
    // Randomly return true or false

    return wrk.random() > 0.5;
}

wrk.doNothing = function() {
    // do nothing
}

wrk.constrain = function(num, min, max) {
    // Constrain num between min and max

    return Math.max(min, Math.min(num, max))
}

wrk.wrapAround = function(num, min, max) {
    // Make num wrap around from min to max and max to min if it goes over
    // Not complete !FIXME! if num < min is not correct! and it's also wrong if num > max

    var diff = max - min;
    if (num > max) num = num % diff + min;
    if (num < min) num = max;
    return num;
}

wrk.doNTimes = function(n, func) {
    // Run func n times, with the loop counter as a parameter
    for (var i = 0; i < n; i ++) {
        func(i);
    }
}

wrk.mapNum = function(num, oldMin, oldMax, newMin, newMax) {
    // Map num from the range [oldMin, oldMax] to the range [newMin, newMaxs]
    var slope = (newMax -  newMin) / (oldMax - oldMin);
    var output = newMin + slope * (num - oldMin);
    return output;
}

wrk.str = {};

wrk.str.lowerAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

wrk.str.upperAlphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

wrk.str.digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

wrk.str.symbols = ['~', '`', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_',
    '=', '+', '[', '{', ']', '}', '\\', '|', ';', ':', '\'', '"', ',', '<', '.', '>', '/', '?'];

wrk.str.randomFromArray = function(length=1, charsToUse=[]) {
    // Create a random string using the chars in charsToUse
    
    var result = '';
    for (var i = 0; i < length; i ++) {
        result += wrk.arr.choose(charsToUse);
    }
    return result;
}

wrk.str.random = function(length=1, lowercaseAllowed=true, uppercaseAllowed=true,
    digitsAllowed=true, symbolsAllowed=true) {
    
    var charsToUse = [];
    if (lowercaseAllowed) charsToUse = charsToUse.concat(wrk.str.lowerAlphabet);
    if (uppercaseAllowed) charsToUse = charsToUse.concat(wrk.str.upperAlphabet);
    if (digitsAllowed) charsToUse = charsToUse.concat(wrk.str.digits);
    if (symbolsAllowed) charsToUse = charsToUse.concat(wrk.str.symbols);

    return wrk.str.randomFromArray(length, charsToUse);
}

wrk.str.randomLetters = function(length=1, lowercaseAllowed=true, uppercaseAllowed=true) { 
    var charsToUse = wrk.str.symbols;
    if (lowercaseAllowed) charsToUse = charsToUse.concat(wrk.str.lowerAlphabet);
    if (uppercaseAllowed) charsToUse = charsToUse.concat(wrk.str.upperAlphabet);
    
    return wrk.str.randomFromArray(length, charsToUse);
}

wrk.str.randomSymbols = function(length=1, digitsAllowed=false) { 
    var charsToUse = wrk.str.symbols;
    if (digitsAllowed) charsToUse = charsToUse.concat(wrk.str.digits);
    
    return wrk.str.randomFromArray(length, charsToUse);
}

wrk.str.randomDigits = function(length=1) {
    return wrk.str.randomFromArray(length, wrk.str.digits);
}

wrk.str.breakHtmlTags = function(str) {
    return str.replace(/</g, '<\u200c');
}

wrk.str.mult = function(str, amount) {
    // return str repeated amount times
    var result = '';
    for (var i = 0; i < amount; i ++) {
        result += str;
    }
    return result;
}

wrk.str.replaceAll = function(str, pattern, replacement='') {
    // If string.replaceAll is supported, use it
    if (typeof str.replaceAll == 'function') {
        return str.replaceAll(pattern, replacement);
    }
    // Else do it the lazy way
    else {
        while (str.includes(pattern)) {
            str = str.replace(pattern, replacement);
        }
        return str;
    }
}

wrk._180DIVPI = 180 / wrk.PI; // speeds up degrees -> radians and vice versa

wrk.round = function(num, decimalPlaces=0) {
    var numToRound = num * 10**decimalPlaces;
    return Math.round(numToRound) / 10**decimalPlaces;
}

wrk.floor = function(num, decimalPlaces=0) {
    var numToRound = num * 10**decimalPlaces;
    return Math.floor(numToRound) / 10**decimalPlaces;
}

wrk.ceiling = function(num, decimalPlaces=0) {
    var numToRound = num * 10**decimalPlaces;
    return Math.ceil(numToRound) / 10**decimalPlaces;
}

wrk.randflt = function(min, max) {
    // Create a random float between min and max [min, max)
    var diff = max - min;
    return Math.random() * diff + min;
}

wrk.randint = function(min, max) {
    // Create a random integer between min and max [min, max)
    return Math.floor(wrk.randflt(min, max));
}

wrk.sigmoid = function(x) {
    // Do sigmoid
    return 1 / (1 + Math.exp(-x)); // f(x) = 1 / (1 + e^(-x))
}

wrk.invSigmoid = function(x) {
    // Do inverse sigmoid
    return wrk.sigmoid(x) * (1 - wrk.sigmoid(x)); // f'(x) = f(x) * (1 - f(x))
}

wrk.degrees = function(radians) {
    // Convert an angle in radians to degrees

    return radians * wrk._180DIVPI;
}

wrk.radians = function(degrees) {
    // Convert an angle in degrees to radians

    return degrees / wrk._180DIVPI;
}

// Should this be in math? !FIXME
wrk.mean = function(a, b) {
    return (a + b) / 2;
}

wrk.dom = {};

wrk.dom.logPara = undefined;

wrk.dom.id = function(id) {
    return document.getElementById(id);
}

wrk.dom.viewportWidth = function() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

wrk.dom.viewportHeight = function() { 
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}

wrk.dom.viewportSize = function() {
    return wrk.v(wrk.dom.viewportWidth(), wrk.dom.viewportHeight());
}

wrk.dom.clearLogPara = function() {
    if (wrk.dom.logPara !== undefined) {
        wrk.dom.logPara.innerText = '';
    }
}

wrk.dom.logToPara = function(data, label='No label') {
    if (wrk.dom.logPara === undefined) {
        wrk.dom.logPara = document.createElement('p');
        document.body.appendChild(wrk.dom.logPara);
    }
    else {
        wrk.dom.logPara.innerText += `${label} : ${data}\n`;
    }
}

// Create an empty object to add methods to
wrk.arr = {};

wrk.arr.removeItem = function(array, item) {
    var index = array.indexOf(item);
    if (index == -1) {
        wrk.internalWarn(`Could not remove item ${item} from array as it is not in the array`);
    }
    else {
        wrk.arr.removeIndex(array, index);
    }
}

wrk.arr.removeIndex = function(array, index) {
    if (index < 0 || index >= array.length) {
        wrk.internalWarn(`Could not remove item at ${index} from array as the index is out of bounds`);
    }
    else {
        array.splice(index, 1);
    }
}

wrk.arr.highestIndex = function(array=[]) {
    // Find the index of the highest number in the array
    // (only intended for numbers)

    var highestIdx = null;
    var highestItem = 0;
    array.forEach((item, i) => {
        if (item >= highestItem) {
            highestItem = item;
            highestIdx = i;
        }
    });
    return highestIdx;
}

wrk.arr.lowestIndex = function(array=[]) {
    // Find the index of the lowest number in the array
    // (only intended for numbers)

    var lowestIdx = null;
    var lowestItem = 0;
    array.forEach((item, i) => {
        if (item <= lowestItem) {
            lowestItem = item;
            lowestIdx = i;
        }
    });
    return lowestIdx;
}

wrk.arr.choose = function(array=[]) {
    // Choose a random item from the array
    // (only intended for numbers)

    return array[wrk.randint(0, array.length)];
}

wrk.arr.sum = function(array=[]) {
    // Get the total of all of the items in the array added together
    // (only intended for numbers)

    var sum = array.reduce(function(a, b){
        return a + b;
    }, 0);
    return sum;
}

wrk.arr.product = function(array=[]) {
    // Get the total of all of the items in the array multiplied together
    // (only intended for numbers)

    var product = array.reduce(function(a, b){
        return a * b;
    }, 1);
    return product;
}

wrk.arr.mean = function(array=[]) {
    // Get the mean (average) value of all of the items in the array
    // (only intended for numbers)

    var sum = wrk.arr.sum(array);
    var mean = sum / array.length;
    return mean;
}

wrk.arr.median = function(array=[]) {
    // Get the item in the middle of the array
    // (works for arrays of any type)

    // If it's even find the two middle numbers and find their mean
    if (array.length % 2 == 0) {
        var justBelowMiddle = array[array.length / 2 - 1];
        var justOverMiddle = array[array.length / 2];
        return wrk.mean(justBelowMiddle, justOverMiddle);
    }
    // If it's odd find the middle index
    else {
        var middleIndex = array.length / 2 - 0.5;
        return array[middleIndex];
    }
}

wrk.arr.mode = function(){}; // do nothing because thinking about whether this should do objects and strings, not just numbers !FIXME

wrk.obj = {};

wrk.obj.keys = function(obj) {
    return Object.keys(obj);
}

wrk.obj.values = function(obj) {
    return Object.values(obj);
}

wrk.obj.setValues = function(obj, values) {
    // change the values of an object without changing the keys
    // assumes that keys and values are same length, etc
    var keys = wrk.obj.keys(obj);
    keys.forEach((key, i) => {
        obj[key] = values[i];
    });
}

wrk.obj.oneLevelCopy = function(obj) {
    var newObj = {};
    var keys = wrk.obj.keys(obj);
    keys.forEach(key => {
        newObj[key] = obj[key];
    });
    return newObj;
}

// You'll notice that a lot of the functions in this file could use the other ones
// But this carries a severe speed penalty, so I've put things inline if that speeds it up
// Vector operations are often the slowest thing in an application,
// so making them fast is critical

wrk.v = function(x, y, z=0) {
    // simple and (hopefully) fast
    return {x : x, y : y, z : z};
}

wrk.v.random = function(min, max, floatsAllowed=true) {
    if (floatsAllowed) {
        return new wrk.v(wrk.randflt(min.x, max.x),
            wrk.randflt(min.y, max.y),
            wrk.randflt(min.z, max.z));
    }
    else {
        return new wrk.v(wrk.randint(min.x, max.x),
            wrk.randint(min.y, max.y),
            wrk.randint(min.z, max.z));
    }
}

wrk.v.copy = function(v) {
    return wrk.v(v.x, v.y, v.z);
}

wrk.v.equal = function(v1, v2) {
    return (v1.x == v2.x && v1.y == v2.y && v1.z == v1.z);
}

wrk.v.add = function(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
    v1.z += v2.z;
}

wrk.v.copyAdd = function(v1, v2) {
    var v3 = wrk.v(
        v1.x + v2.x,
        v1.y + v2.y,
        v1.z + v2.z);
    return v3;
}

wrk.v.sub = function(v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
    v1.z -= v2.z;
}

wrk.v.copySub = function(v1, v2) {
    var v3 = wrk.v(
        v1.x / v2.x,
        v1.y / v2.y,
        v1.z / v2.z);
    return v3;
}

wrk.v.mult = function(v, amount) {
    v.x *= amount;
    v.y *= amount;
    v.z *= amount;
}

wrk.v.copyMult = function(v, amount) {
    var v2 = wrk.v(
        v.x * amount,
        v.y * amount,
        v.z * amount);
    return v2;
}

wrk.v.div = function(v, amount) {
    v.x /= amount;
    v.y /= amount;
    v.z /= amount;
}

wrk.v.copyDiv = function(v, amount) {
    var v2 = wrk.v(
        v.x / amount,
        v.y / amount,
        v.z / amount);
    return v2;
}

wrk.v.magSq = function(v) {
    return v.x ** 2 + v.y ** 2 + v.z ** 2;
}

wrk.v.mag = function(v) {
    return wrk.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

wrk.v.distSq = function(v1, v2) {
    var displacementX = v2.x - v1.x;
    var displacementY = v2.y - v1.y;
    var displacementZ = v2.z - v1.z;
    return displacementX ** 2 + displacementY ** 2 + displacementZ ** 2;
}

wrk.v.dist = function(v1, v2) {
    var displacementX = v2.x - v1.x;
    var displacementY = v2.y - v1.y;
    var displacementZ = v2.z - v1.z;
    return wrk.sqrt(displacementX ** 2 + displacementY ** 2 + displacementZ ** 2);
}

wrk.v.mean = function(v1, v2) {
    var halfDisplacementX = (v2.x - v1.x) / 2;
    var halfDisplacementY = (v2.y - v1.y) / 2;
    var halfDisplacementZ = (v2.z - v1.z) / 2;

    return wrk.v(
        v1.x + halfDisplacementX,
        v1.y + halfDisplacementY,
        v1.z + halfDisplacementZ);
}

wrk.v.normalize = function(v) {
    var mag = wrk.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2)
    v.x /= mag;
    v.y /= mag;
    v.z /= mag;
}

wrk.v.rotate = function(v, angle=0, useDegrees=false) {
    if (useDegrees) {
        angle /= wrk._180DIVPI;
    }
    
    var cos = wrk.cos(angle);
    var sin = wrk.sin(angle);

    // Assign to a temp variable to avoid messing with the v.x below
    var newX = v.x * cos - v.y * sin;
    // Don't assign to a temp variable because v.y isn't used again
    v.y = v.x * sin + v.y * cos;
    // Read from the temp variable
    v.x = newX;
}

wrk.v.heading = function(v, useDegrees=false) {
    var heading = wrk.atan2(v.y, v.x);
    if (useDegrees) heading = heading * wrk._180DIVPI;
    return heading;
}

wrk.v.dot = function(v1, v2) {
    var result = v1.x * v2.x;
    result += v1.y * v2.y;
    result += v1.z * v2.z;
    return result;
}

wrk.v.cross = function(v1, v2) {
    var crossP = wrk.v(0, 0, 0);
    crossP.x = v1.y * v2.z - v1.z * v2.y;
    crossP.y = v1.z * v2.x - v1.x * v2.z;
    crossP.z = v1.x * v2.y - v1.y * v2.x;
    return crossP;
}

wrk.attitude = function(heading, pitch, roll) {
    return {heading : heading, pitch : pitch, roll : roll};
}

wrk.attitude.copy = function(a) {
    return wrk.attitude(a.heading, a.pitch, a.roll);
}

wrk.attitude.add = function(a1, a2) {
    a1.heading += a2.heading;
    a1.pitch += a2.pitch;
    a1.roll += a2.roll;
}

wrk.attitude.copyAdd = function(a1, a2) {
    var a3 = wrk.attitude.copy(a1);
    wrk.attitude.add(a3, a2);
    return a3;
}

wrk.attitude.sub = function(a1, a2) {
    a1.heading -= a2.heading;
    a1.pitch -= a2.pitch;
    a1.roll -= a2.roll;
}

wrk.attitude.copySub = function(a1, a2) {
    var a3 = wrk.attitude.copy(a1);
    wrk.attitude.sub(a3, a2);
    return a3;
}

wrk.attitude.mult = function(a, amount) {
    a.heading *= amount;
    a.pitch *= amount;
    a.roll *= amount;
}

wrk.attitude.copyMult = function(a, amount) {
    var a2 = wrk.attitude.copy(a);
    wrk.attitude.mult(a2, amount);
    return a2;
}

wrk.attitude.div = function(a, amount) {
    a.heading /= amount;
    a.pitch /= amount;
    a.roll /= amount;
}

wrk.attitude.copyDiv = function(a, amount) {
    var a2 = wrk.attitude.copy(a);
    wrk.attitude.div(a2, amount);
    return a2;
}

/*
wrk.Sound = class {
    constructor(data, dataIsUrl=true) {
        // Create a sound using data
        // If dataIsUrl is true, then treat data as a url and load the sound from there
        // else treat data as a fileBlob and use that to create sound
        console.log('reciever', data, dataIsUrl)
        if (dataIsUrl) {
            fetch(data)
                .then(response => {return response.blob()})
                .then(blob => {
                    this.fileBlob = URL.createObjectURL(blob);
                    this.audio = new Audio(this.fileBlob); // forces a request for the blob
                });
        }
        else {
            this.fileBlob = data;
            this.audio = new Audio(this.fileBlob);
        }
        console.log('receiver', this.fileBlob);
    }

    play() {
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.onended = () => {};
    }

    pause() {
        this.audio.pause();
    }

    loop() {
        this.play();
        this.onended = () => this.play();
    }

    set onended(val) {
        this.audio.onended = val;
    }

    copy() {
        console.log('copyer', this.fileBlob);
        return new wrk.Sound(this.fileBlob, false);
    }
}
*/

wrk.Sound = class {
    constructor(url) {
        this.url = url;
        this.audio = new Audio(url);
    }

    play() {
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.onended = () => {};
    }

    pause() {
        this.audio.pause();
    }

    loop() {
        this.play();
        this.onended = () => this.play();
    }

    set onended(val) {
        this.audio.onended = val;
    }

    copy() {
        return new wrk.Sound(this.url);
    }
}

wrk.KeyWatcher = class {
    constructor(elem=document) {
        this.elem = elem;

        this.keysDown = {};
        this.setupListeners();
    }

    setupListeners() {
        this.elem.addEventListener('keydown', event => {
            this.keysDown[event.code] = true;
        });
        this.elem.addEventListener('keyup', event => {
            this.keysDown[event.code] = false;
        });
    }

    keyIsDown(code) {
        if (this.keysDown[code] != undefined) return this.keysDown[code];
        else return false;
    }
}

wrk.MouseWatcher = class {
    constructor(elem=document) {
        this.elem = elem;

        this.position = wrk.v(0, 0);

        this.pointerDown = false;
        this.mouseDown = false;
        this.touchDown = false;
        
        this.elem.addEventListener('mousemove', e => {
            var rect = e.target.getBoundingClientRect();
            this.position.x = e.x - rect.left;
            this.position.y = e.y - rect.top;
        });

        this.elem.addEventListener('mousedown', e => {
            this.mouseDown = true;
        });

        this.elem.addEventListener('mouseup', e => {
            this.mouseDown = false;
        });

        this.elem.addEventListener('touchstart', e => {
            this.touchDown = true;
        });

        this.elem.addEventListener('touchend', e => {
            this.touchDown = false;
        });

        this.elem.addEventListener('pointerdown', e => {
            this.pointerDown = true;
        });

        this.elem.addEventListener('pointerup', e => {
            this.pointerDown = false;
        });
    }
}

wrk.FunctionGroup = class {
    /** Warning! This is undocumented.
     * It is basically a collection of functions that can be 
    */
    constructor(initialFunctions=[]) {
        this.functions = new Set(initialFunctions);
    }

    add(f) {
        this.functions.add(f);
    }

    addBulk(functionArray) {
        functionArray.forEach(f => this.add(f));
    }

    remove(f) {
        return this.functions.delete(f);
    }

    /** Call this with the arguments for the functions. */
    call() {
        this.functions.forEach(f => {
            f.call(...arguments);
        });
    }
}

wrk.NeuralNetwork = class {
    constructor() {
        this.inputs = [];
        this.hiddenLayers = [];
        this.outputs = [];
    }

    createInputLayer(size) {
        this.inputs = [];
        for (var i = 0; i < size; i ++) {
            this.inputs.push(new wrk.Neuron());
        }
    }

    addHiddenLayer(size) {
        var newLayer = [];
        for (var i = 0; i < size; i ++) {
            newLayer.push(new wrk.Neuron());
        }
        this.hiddenLayers.push(newLayer);
    }

    createOutputLayer(size) {
        this.outputs = [];
        for (var i = 0; i < size; i ++) {
            this.outputs.push(new wrk.Neuron());
        }
    }

    connect() {
        // connect input to first hidden
        this._connect2Layers(this.inputs, this.hiddenLayers[0]);
        // connect last hidden to output
        this._connect2Layers(this.hiddenLayers[this.hiddenLayers.length - 1], this.outputs);

        // connect hidden layers to each other
        for (var i = 0; i < this.hiddenLayers.length - 1; i ++) {
            var firstLayer = this.hiddenLayers[i];
            var secondLayer =  this.hiddenLayers[i + 1];
            this._connect2Layers(firstLayer, secondLayer);
        }
    }

    activate(input) {
        this.inputs.forEach((neuron, i) => neuron.activate(input[i]));
        this.hiddenLayers.forEach(layer => {
            layer.forEach(neuron => neuron.activate());
        });
        return this.outputs.map(neuron => neuron.activate());
    }

    train(dataset, iterations=1) {
        while(iterations > 0) {
            dataset.forEach(datum => {
                this.activate(datum.inputs);
                this.propagate(datum.outputs);
            });
            iterations--;
        }
    }

    propagate(target) {
        this.outputs.forEach((neuron, i) => neuron.propagate(target[i]));
        for (var i = this.hiddenLayers.length - 1; i >= 0; i --) {
            var layer = this.hiddenLayers[i];
            layer.forEach(neuron => neuron.propagate());
        }
        return this.inputs.forEach(neuron => neuron.propagate());
    }

    saveTraining() {
        var savedTraining = [];

        savedTraining.push(this._saveLayer(this.inputs));
        this.hiddenLayers.forEach(layer => {
            savedTraining.push(this._saveLayer(layer));
        });
        savedTraining.push(this._saveLayer(this.outputs));

        return savedTraining;
    }

    loadTraining(savedTraining) {
        this._loadLayer(savedTraining[0], this.inputs);
        this.hiddenLayers.forEach((layer, i) => {
            this._loadLayer(savedTraining[i + 1], layer);
        });
        this._loadLayer(savedTraining[this.hiddenLayers.length + 1], this.outputs);
    }

    _saveLayer(layer) {
        var savedLayer = [];
        layer.forEach(neuron => {
            var savedNeuron = [];
            savedNeuron.push(neuron.bias);

            var incomingWeights = Object.values(neuron.incoming.weights);
            savedNeuron.push(incomingWeights);
            var outgoingWeights = Object.values(neuron.outgoing.weights);
            savedNeuron.push(outgoingWeights);

            savedLayer.push(savedNeuron);
        });
        return savedLayer;
    }

    _loadLayer(savedLayer, neuronObjs) {
        for (var i = 0; i < neuronObjs.length; i ++) {
            var neuron = neuronObjs[i];
            var values = savedLayer[i];

            // set the bias (the first item in a saved neuron)
            neuron.bias = values.shift();
            
            // then set the weights of the connections
            setValues(neuron.incoming.weights, values[0]);
            setValues(neuron.outgoing.weights, values[1]);
        }
    }

    _connect2Layers(layer1, layer2) {
        layer1.forEach(neuron => {
            layer2.forEach(neuron2 => {
                neuron.connect(neuron2);
            });
        });
    }
}

wrk.Neuron = class {
    constructor(bias=wrk.randflt(-1, 1)) {
        this.id = wrk.uniqueId();
        this.bias = bias;

        this.incoming = {
            weights : {},
            targets : {}
        }

        this.outgoing = {
            weights : {},
            targets : {}
        }

        this._output;
        this.output;
        this.error;
    }
    
    connect(neuron, weight=wrk.randflt(0, 1)) {
        this.outgoing.targets[neuron.id] = neuron;
        neuron.incoming.targets[this.id] = this;
        neuron.incoming.weights[this.id] = weight;
        
        if (neuron.incoming.weights[this.id] == undefined) {
            this.outgoing.weights[neuron.id] = wrk.randflt(-1, 1);
        }
        else {
            this.outgoing.weights[neuron.id] = weight;
        }
    }

    activate(input) {
        if (input != undefined) {
            this._output = 1;
            this.output = input;
        }
        else {
            var targetIds = Object.keys(this.incoming.targets);
            var sum = targetIds.reduce((total, target) => {
                return total += this.incoming.targets[target].output * this.incoming.weights[target];
            }, this.bias);
            
            this._output = wrk.invSigmoid(sum);
            this.output = wrk.sigmoid(sum);
        }

        return this.output;
    }
    
    propagate(target, rate=0.3) {
        var outgoingIds = Object.keys(this.outgoing.targets);     
        
        if (target == undefined) {
            var sum = outgoingIds.reduce((total, target, index) => {
                var targetObj = this.outgoing.targets[target];
                this.outgoing.weights[target] -= rate * targetObj.error * this.output;
                this.outgoing.targets[target].incoming.weights[this.id] = this.outgoing.weights[target];
                
                total += targetObj.error * this.outgoing.weights[target];
                return total;
            }, 0);
        }
        else {
            var sum = this.output - target;
        }
        
        // 𝛿squash/𝛿sum
        this.error = sum * this._output
        
        // Δbias
        this.bias -= rate * this.error;
        
        return this.error;
    }
}

wrk.GameEngine = class {
    static pixiApp;
    static canvasSize;
    
    static globalPosition;
    static globalAngle;
    static globalScale;

    static crntScene;

    static deltaTime;

    static init(canvasSize, globalScale, backgroundColor=0x000000) {
        wrk.internalWarn('wrk.GameEngine is an undocumented, untested festure. Use with caution');
        
        // Set these so the children know where they are
        this.globalPosition = wrk.v(0, 0);
        this.globalAngle = 0;

        this.setGlobalScale(globalScale);

        this.createPixiApp(canvasSize, backgroundColor);

        this.deselectCrntScene();

        this.keyboard = new wrk.KeyWatcher();
        this.mouse = new wrk.MouseWatcher(this.pixiApp.view);
    }

    // Pixi stuff and canvas stuff
    // ---------------------------

    static createPixiApp(canvasSize, backgroundColor) {
        this.pixiApp = new PIXI.Application({
            width : canvasSize.x * this.globalScale,
            height : canvasSize.y * this.globalScale,
            backgroundColor : backgroundColor,
            resolution : window.devicePixelRatio || 1
        });
        document.body.appendChild(this.pixiApp.view);

        this.pixiApp.ticker.add(() => this.update());

        this.pixiApp.stage.pivot.set(0.5, 0.5);

        this.setCanvasSize(canvasSize);
        this.setGlobalScale(this.globalScale);
    }

    static setCanvasSize(size) {
        this.canvasSize = wrk.v.copy(size);

        this.pixiApp.view.width = this.canvasSize.x * this.globalScale;
        this.pixiApp.view.height = this.canvasSize.y * this.globalScale;

        this.pixiApp.renderer.resize(this.canvasSize.x * this.globalScale,
            this.canvasSize.y * this.globalScale)
    }

    static setGlobalScale(scale) {
        this.globalScale = scale;
        if (this.pixiApp != undefined) {
            this.pixiApp.stage.scale.set(this.globalScale, this.globalScale);
        }
        if (this.canvasSize != undefined) {
            this.setCanvasSize(this.canvasSize);
        }
    }

    static removeChildrenFromPixiApp() {
        while(this.pixiApp.stage.children.length > 0) { 
            this.pixiApp.stage.removeChild(this.pixiApp.stage.children[0]);
        }
    }

    static get backgroundColor() {
        return this.pixiApp.renderer.backgroundColor;
    }

    static setBackgroundColor(color) {
        this.pixiApp.renderer.backgroundColor = color;
    }

    // Scenes
    // ------

    static selectScene(scene) {
        this.deselectCrntScene();
        
        this.crntScene = scene;
        
        if (scene != null) {
            scene.select(this.pixiApp);
            scene.setParent(this);
        }
    }

    static deselectCrntScene() {
        if (this.crntScene != null) {
            this.crntScene.deselect();
            this.removeChildrenFromPixiApp();
        }

        this.crntScene = null;
    }

    // Main method
    // -------------

    static update() {
        this.deltaTime = this.pixiApp.ticker.elapsedMS / 1000;

        if (this.crntScene != null) {
            this.crntScene.internalUpdate();
        }
    }
}

wrk.GameEngine.Entity = class {
    constructor(name, localPosition, localAngle) {
        this.rename(name);

        this.setLocalPosition(localPosition);
        this.setLocalAngle(localAngle);

        this.setParentContainer(null); // specify that this 
        
        this.children = [];
    }

    // Misc
    // ----

    rename(name) {
        this.name = name;
    }

    // Pixi
    // ----

    addToPixiContainer(container) {
        // do nothing except add children - overwrite in drawable entities
        this.setParentContainer(container);
        this.addChildrenToPixiContainer(container);
    }

    /** Do not call directly, call through wrk.GameEngine.Entity.addToPixiContainer */
    addChildrenToPixiContainer(container) {
        this.children.forEach(child => {
            child.addToPixiContainer(container);
        });
    }

    removeFromPixiContainer() {
        this.removeChildrenFromPixiContainer();
        this.setParentContainer(null)
    }

    removeChildrenFromPixiContainer() {
        this.children.forEach(child => {
            child.removeFromPixiContainer()
        });
    }

    setParentContainer(container=null) {
        // Internal

        this.parentContainer = container;
    }

    // Position
    // --------

    /** Try not to use this extensively because it's recursive and laggy */
    get globalPosition() {
        var rotatedLocalPosition = wrk.v.copy(this.localPosition);
        wrk.v.rotate(rotatedLocalPosition, this.parent.localAngle);
        return wrk.v.copyAdd(this.parent.globalPosition, rotatedLocalPosition);
    }

    setLocalPosition(position) {
        this.localPosition = wrk.v.copy(position);
    }

    setGlobalPosition(position) {
        this.setLocalPosition(wrk.v.copySub(position, this.parent.globalPosition));
    }

    // Angle
    // -----

    get globalAngle() {
        return this.parent.globalAngle + this.localAngle;
    }

    setLocalAngle(angle) {
        this.localAngle = angle;
    }

    setGlobalAngle(angle) {
        this.setLocalAngle(angle - this.parent.globalAngle);
    }

    // Children/parents
    // ----------------

    removeChildren() {
        // While there are children, remove the first child
        while (this.children.length > 0) {
            this.removeChild(this.children[0]);
        }
    }

    addChild(entity) {
        // If the entity is already a child, then don't do anything
        if (this.children.includes(entity)) {
            wrk.internalWarn(`Could not add entity '${entity.name}' to entity '${this.name}' as it is already a child`);
            return false;
        }
        else {
            this.children.push(entity);
            entity.setParent(this);
            return true;
        }
    }

    removeChild(entity) {
        var indexOfEntity = this.children.indexOf(entity);

        // If the entity is not a child, then do nothing
        if (indexOfEntity == -1) {
            wrk.internalWarn(`Could not remove entity '${entity.name}' from entity '${this.name}' as it is not a child`);
            return false;
        }
        else {
            wrk.arr.removeItem(this.children, entity);
            entity.removeFromPixiContainer();
            entity.removeParent();
            return true;
        }
    }

    setParent(parent) {
        this.parent = parent;
        
        if (this.parent != null) {
            this.setParentContainer(this.parent.parentContainer);

            if (this.parent.parentContainer != null) {
                this.addToPixiContainer(this.parent.parentContainer);
            }

        }
        else {
            this.setParentContainer(null);
        }
    }

    removeParent() {
        this.setParent(null);
        this.setParentContainer(null);
    }

    // Update

    updateChildren() {
        this.children.forEach(child => {
            child.internalUpdate();
        });
    }

    internalUpdate() {
        this.updateChildren();
        this.update();
    }

    // To be overwritten by the libarry user - just here as a safety
    update() {}
}

wrk.GameEngine.Scene = class extends wrk.GameEngine.Entity {
    constructor(name, localPosition=wrk.v(0, 0), localAngle=0) {
        super(name, localPosition, localAngle);

        this.container = new PIXI.Container();
        this.setParentContainer(this.container);

        this.isSelected = false;
    }

    get globalAngle() {
        return 0;
    }

    setBackgroundSound(sound) {
        this.backgroundSound = sound;
        wrk.internalLog('Does this need a copy or something?');

        if (this.isSelected) {
            this.startBackgroundSound();
        }
    }

    startBackgroundSound() {
        if (this.backgroundSound != null) {
            this.backgroundSound.loop();
        }
    }

    stopBackgroundSound() {
        if (this.backgroundSound != null) {
            this.backgroundSound.stop();
        }
    }

    addChild(child) {
        var inheritedFunc = wrk.GameEngine.Entity.prototype.addChild.bind(this);
        var childAdded = inheritedFunc(child);

        if (childAdded) {
            child.addToPixiContainer(this.container);
        }
    }

    /** Do not call this directly, call through wrk.GameEngine.selectScene() */
    select(pixiApp) {
        this.isSelected = true;

        this.parentAppPointer = pixiApp;
        
        pixiApp.stage.addChild(this.container);

        this.startBackgroundSound();
    }

    /** Do not call this directly, call through wrk.GameEngine.deselectCrntScene() */
    deselect() {
        this.isSelected = false;
        this.parentAppPointer.stage.removeChild(this.container);
        this.parentAppPointer = null;

        this.stopBackgroundSound();
    }

    setParent(gameEngine) {
        this.parent = gameEngine;
    }

    internalUpdate() {
        this.updateChildren();
        this.update();

        this.container.rotation = this.localAngle;
    }
}

wrk.GameEngine.Texture = {};

wrk.GameEngine.Texture.fromUrl = function(url) {
    return PIXI.Texture.from(url);
}

wrk.GameEngine.DrawableEntity = class extends wrk.GameEngine.Entity {
    constructor(name, localPosition, localAngle, texture, textureSize, anchor=wrk.v(0.5, 0.5)) {
        super(name, localPosition, localAngle);

        this.setTexture(texture, textureSize);
        this.setAnchor(anchor);
        this.setTint(0xffffff);

        this.setupMouseInteraction();
    }

    setupMouseInteraction() {
        this.mouseHovering = false;

        this.sprite.interactive = true;

        this.mouseDownCallbacks = new wrk.FunctionGroup();
        this.sprite.mousedown = data => this.mouseDownCallbacks.call(data);
        this.sprite.touchstart = data => this.mouseDownCallbacks.call(data);
        
        this.mouseUpCallbacks = new wrk.FunctionGroup();
        this.sprite.mouseup = data => this.mouseUpCallbacks.call(data);
        this.sprite.touchend = data => this.mouseUpCallbacks.call(data);

        this.mouseOverCallbacks = new wrk.FunctionGroup();
        this.sprite.mouseover = data => {
            this.mouseHovering = true;
            this.mouseOverCallbacks.call(data);
        }

        this.mouseOutCallbacks = new wrk.FunctionGroup();
        this.sprite.mouseout = data => {
            this.mouseHovering = false;
            this.mouseOutCallbacks.call(data);
        }
    }

    setTextureSize(size) {
        this.textureSize = wrk.v.copy(size);
        this.sprite.width = this.textureSize.x;
        this.sprite.height = this.textureSize.y;
    }

    addToPixiContainer(container) {
        container.addChild(this.sprite);
        this.setParentContainer(container);
        this.addChildrenToPixiContainer(container);
    }

    removeFromPixiContainer() {
        var container = this.sprite.parent;
        this.setParentContainer(null);
        if (container != undefined) {
            container.removeChild(this.sprite);
            this.removeChildrenFromPixiContainer();
        }
    }

    setTexture(texture, textureSize=null) {
        if (this.sprite != undefined) {
            var container = this.sprite.parent;

            var anchor = this.sprite.anchor;

            if (container != undefined) {
                this.removeFromPixiContainer(); // remove old sprite
            }
        }

        this.sprite = new PIXI.Sprite(texture);
        if (textureSize != null) {
            this.setTextureSize(textureSize);
        }
        if (this.tint != undefined) {
            this.setTint(this.tint);
        }

        if (container != undefined) {
            this.addToPixiContainer(container); // add new container
        }
        if (anchor != undefined) {
            this.setAnchor(anchor);
        }
    }

    setAnchor(position) {
        // from 0,0 to 1, 1

        this.sprite.anchor.x = position.x;
        this.sprite.anchor.y = position.y;
    }

    setTint(tint) {
        this.tint = tint;
        this.sprite.tint = tint;
    }

    setVisible(state) {
        this.sprite.visible = state;
    }

    internalUpdate() {
        var globalPosition = this.globalPosition;
        this.sprite.position.set(globalPosition.x, globalPosition.y);
        this.sprite.rotation = this.globalAngle + wrk.PI;

        // This needs to be after the block above - 
        // otherwise, if this entity's parent gets removed in update(),
        // the call to globalPosition above will break
        this.updateChildren();
        this.update();
    }
}

wrk.GameEngine.Label = class extends wrk.GameEngine.Entity {
    constructor(name, text, localPosition, localAngle,
        format={}, anchor=wrk.v(0.5, 0.5)) {
        super(name, localPosition, localAngle);

        this.setTextFormat(format);
        this.setText(text);
        this.setAnchor(anchor);
    }

    addToPixiContainer(container) {
        container.addChild(this.textSprite);
        this.addChildrenToPixiContainer(container);
        this.setParentContainer(container);
    }

    removeFromPixiContainer() {
        var container = this.textSprite.parent;
        this.setParentContainer(null);
        if (container != undefined) {
            container.removeChild(this.textSprite);
            this.removeChildrenFromPixiContainer();
        }
    }

    setTextFormat(format) {
        this.textFormat = wrk.obj.oneLevelCopy(format);
        
        // Protection for before the text is set
        if (this.text != undefined) {
            
            this.updateTextSprite();
        }
    }

    setText(text) {
        this.text = text;

        // Protection for before the text format is set
        if (this.text != undefined) {
            
            this.updateTextSprite();
        }
    }

    setAnchor(position) {
        // from 0,0 to 1,1

        this.textSprite.anchor.x = position.x;
        this.textSprite.anchor.y = position.y;
    }

    setVisible(state) {
        this.textSprite.visible = state;
    }

    internalUpdate() {
        this.updateChildren();
        this.update();

        var globalPosition = this.globalPosition;
        this.textSprite.position.set(globalPosition.x, globalPosition.y);
        this.textSprite.rotation = this.globalAngle + wrk.PI;
    }

    updateTextSprite() {
        // Quite slow so don't call if you don't need to

        if (this.textSprite != undefined) {
            if (this.textSprite.parent != undefined) {
                // Remove the old sprite
                var oldParent = this.textSprite.parent;
                oldParent.removeChild(this.textSprite);
            }
            var oldAnchor = this.textSprite.anchor;
        }
        this.textSprite = new PIXI.Text(this.text, this.textFormat);

        if (oldAnchor != undefined) {
            this.setAnchor(oldAnchor);
        }

        if (oldParent != undefined) {
            oldParent.addChild(this.textSprite);
        }
    }
}

wrk.GameEngine.Button = class extends wrk.GameEngine.DrawableEntity {
    constructor(name, localPosition, localAngle, size, background=null,
        text='', textFormat={}, anchor) {

        if (background === null) background = PIXI.Texture.Empty;

        super(name, localPosition, localAngle, background, size, anchor);
        
        this.label = new wrk.GameEngine.Label(this.name + ' label', text,
            wrk.v(0, 0), 0, textFormat);
        this.addChild(this.label)
    }
}

wrk.GameEngine.BaseCollider = class extends wrk.GameEngine.Entity {
    constructor(name, localPosition, localAngle) {
        super(name, localPosition, localAngle);

        this.colliding = false;

        this.collideStartCallbacks = new wrk.FunctionGroup();
        this.collideEndCallbacks = new wrk.FunctionGroup();
    }
}

wrk.GameEngine.CircleCollider = class extends wrk.GameEngine.BaseCollider {
    constructor(name, localPosition, radius) {
        super(name, localPosition, 0);

        this.radius = radius;
    }

    isTouching(collider) {
        var distSq = wrk.v.distSq(this.globalPosition, collider.globalPosition);
        return (distSq < this.radius ** 2 + collider.radius ** 2);
    }
}

