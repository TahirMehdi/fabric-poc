/**
 * Created by tairmehdi on 30.01.17.
 */
let fab = fabric;
fabric = fab;
let scale = 0.95;
const wWidth = window.innerWidth * scale;
const wHeight = window.innerHeight * scale;
const canvas = new fabric.Canvas('widgetRadar', {
    stateful: false,
    selectable: false,
    renderOnAddRemove: false,
    skipTargetFind: false,
    width: wWidth,
    height: wHeight
});
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
// canvas.setWidth(wWidth);
// canvas.setHeight(wHeight);
// canvas.renderOnAddRemove = false;
// canvas.skipTargetFind = false;
// canvas.stateful = false;
// canvas.selectable = false;

// let config1: function (e) {
// e.setConfig({
// animation: {active: !0},
// font: {family: "sans-serif", size: "0.7em", weight: "normal"},
// title: {color: "#f00"},
// datasetGrid: {color: "#215866", lineWidth: 5},
// dataGrid: {color: "#387486", lineWidth: .9},
// centerCircle: {color: "#fff", backgroundColor: "#0F262D"},
// datasetCircle: {color: "#A2AFB3", backgroundColor: "#1F4D59"},
// barCircle: {backgroundColor: "#57c66c"},
// dataCircle: {
// color: "#5F8998",
// backgroundColor: "#2c6e80",
// gradient: {startColor: "#2A6C7F", endColor: "#2A6C7F"}
// },
// valueCircle: {color: "#F5F7F8", backgroundColor: "#2A6A7D"},
// nameCircle: {
// color: "#75929E",
// backgroundColor: "#16596E",
// selected: {color: "#80959D", backgroundColor: "#0E4A5B"}
// }
// })
// }

const selectable = true; //object selection
const circleRad = ( wWidth < wHeight ? wWidth : wHeight) * 0.75 / 2; // radius multiplier, depends on canvas size
const circlesList = {};
const config = {
    title: "Radar widget",
    totals: {name: "Radar\nwidget", value: 1491.5},
    datasets: [{
        name: "Sector",
        metrics: [{name: "Accom.&Food", value: 147}, {
            name: "Educ.&HH",
            value: 227
        }, {name: "Manufacturing", value: 7}, {name: "Other", value: 73}, {
            name: "Real Est. & Con.",
            value: 402
        }, {name: "Services", value: 20}, {name: "Whols. & Retail", value: 36}]
    }, {
        name: "Region",
        metrics: [{name: "CENTRAL TEAMS", value: 225}, {
            name: "LONDON & SE",
            value: 135
        }, {name: "MIDLANDS & WALES", value: 111}, {name: "NORTH", value: 151}, {
            name: "OTHER",
            value: 232
        }, {name: "SCOTLAND, NI & NE ENGLAND", value: 28}, {name: "THAMES VALLEY & SW", value: 31}]
    }, {
        name: "Rating",
        metrics: [{name: "1 to 3", value: 600}, {name: "4 to 6", value: 166}, {
            name: "7 to 9",
            value: 0
        }, {name: "Unrated", value: 148}]
    }, {
        name: "Performance",
        metrics: [{name: "FEVE Monitor", value: 0}, {name: "FEVE Seriour", value: 0}, {
            name: "NPL",
            value: 913
        }, {name: "UTD", value: 0}]
    }]
};
const circlesConfig = [
    {
        name: 'nameCircle',
        textColor: '#75929E',
        fill: '#16596E',
        radius: 1,
        selected: {color: "#80959D", backgroundColor: "#0E4A5B"}
    }, {
        name: 'valueCircle',
        textColor: '#F5F7F8',
        fill: '#2A6A7D',
        radius: 0.91
    }, {
        name: 'dataCircle',
        textColor: '#5F8998',
        fill: '#2c6e80',
        radius: 0.78,
        gradient: {startColor: "#2A6C7F", endColor: "#2A6C7F"},
    }, {
        name: 'barCircle',
        fill: '',
        radius: 0.66
    }, {
        name: 'datasetCircle',
        textColor: '#A2AFB3',
        fill: '#1F4D59',
        //stroke: '#1F4D59',
        radius: 0.33,
    }, {
        name: 'centerCircle',
        textColor: '#fff',
        fill: '#0F262D',
        radius: 0.25
    }];
const linesConfig = {
    stroke: '#fff',
    strokeWidth: 0.5,
    opacity: 0.5,
    selectable: selectable,
    originY: 'center',
    originX: 'center',
    left: 0,
    top: 0
};

function addCircle(params) {
    let p = addCircle.circleConfig;
    p = Object.assign({}, p, params);
    p.radius = params.radius * p.radiusMultpl;
    let c = new fabric.Circle(p);
    circlesList[p.name] = c;
    return c;
}

addCircle.circleConfig = {
    radius: 0,
    fill: '#f00',
    stroke: '#ff0',
    strokeWidth: 0,
    left: 0,
    top: 0,
    originY: 'center',
    originX: 'center',
    radiusMultpl: circleRad,
    selectable: selectable,
    textColor: ''
};

function createSectors(config) {
    let sectors = [];

    for (let i = 0; i < config.datasets.length; i++) {
        for (let z = 0; z < config.datasets[i].metrics.length; z++) {
            sectors.push({
                datasetName: config.datasets[i].name,
                name: config.datasets[i].metrics[z].name,
                value: config.datasets[i].metrics[z].value,
                percent:(Math.random()*100)
            });
        }
    }
    return sectors;
    // let counter = 0;
    // for (let i = 0; i < config.datasets.length; i++) {
    //     counter += config.datasets[i].metrics.length;
    // }
    // return counter
}

function createLines(count) {
    const centerPoint = new fabric.Point(0, 0);
    let rad = circlesConfig.find((el) => {
            return el.name === 'nameCircle';
        }).radius * addCircle.circleConfig.radiusMultpl;
    let g = (o) => `${o.x},${o.y}`;
    let circlePoint = () => new fabric.Point(centerPoint.x, centerPoint.y + rad);
    let str = ``;
    for (let x = 0, r = 0; x < count; x++, r += Math.PI * 2 / count) {
        let rotatedPoint = fabric.util.rotatePoint(circlePoint(), centerPoint, r);
        str += `M${g(centerPoint)}L${g(rotatedPoint)}`;
    }
    str += 'z';
    return (new fabric.Path(str, linesConfig));
}

function createWheel(count) {
    let c = [];
    addCircle.circleConfig.left = 0;
    addCircle.circleConfig.top = 0;

    for (let i = 0; i < circlesConfig.length; i++) {
        if (i == 4) {
            c.push(createLines(count));
        }
        c.push(addCircle(circlesConfig[i]));
    }
    return c;
}
function createSegmentText(params, value) {
    console.log(value)
    const centerPoint = new fabric.Point(wWidth / 2, wHeight / 2);
    let circlePoint = () => new fabric.Point(centerPoint.x, centerPoint.y + params.radius);
//    let circlePoint = () => new fabric.Point(centerPoint.x, centerPoint.y + Math.floor(params.radius));
    let rotatedPoint = fabric.util.rotatePoint(circlePoint(), centerPoint, params.startAngle);

    params.angle = params.startAngle * 180 / Math.PI + 180;
    params.left = rotatedPoint.x;
    params.top = rotatedPoint.y;
    return new fabric.Text(value, params);
}
function fillBar(id, prc) {
    prc = prc || 0;
    id.setStrokeWidth((id.endRadius - id.startRadius) * 2 * prc / 100);
}

// function drawElement(params) {
//     params = Object.assign(createSector.params, params);
//     let c = new fabric.Circle(params);
//     fillBar(c, 1);
//     return c;
// }

function createSector(startCircle, endCircle, sectors) {
    let startRadius = startCircle.getRadiusX();
    let endRadius = endCircle.getRadiusX();
    const angleStep = 2 * Math.PI / sectors.length;
    const startAngle = 3 / 2 * Math.PI;
    const angle = 0;
    const endAngle = 3 / 2 * Math.PI + angleStep;

    createSector.params.radius = startRadius + (endRadius - startRadius) / 2;
    createSector.params.startAngle = startAngle;
    createSector.params.angle = angle;
    createSector.params.endAngle = endAngle;
    createSector.params.startRadius = startRadius;
    createSector.params.endRadius = endRadius;
    createSector.params.fill = '#fff';
    createSector.params.fontSize = 25;

    let g = [];
    for (let i = 0; i < sectors.length; i++) {
        createSector.params.startAngle += angleStep;
        createSector.params.endAngle += angleStep;
        g.push(createSegmentText(createSector.params, sectors[i].name));
    }
    return new fabric.Group(g, {left: 0, top: 0});
}
createSector.params = {
    name: '',
    value: 0,
    radius: 0,
    angle: 0,
    startAngle: 0,
    endAngle: 0,
    stroke: '#fff',
    strokeWidth: 0,
    startRadius: 0,
    endRadius: 0,
    selectable: selectable
};

function widget(config) {
    let sectors = createSectors(config);
    let wheel = new fabric.Group(createWheel(sectors.length), {
        left: wWidth / 2,
        top: wHeight / 2,
        selectable: true
    });
    canvas.add(wheel);

    let n = sectors.length;
    let gz = [];
    let startCircle = circlesList['valueCircle'];
    let endCircle = circlesList['nameCircle'];
    gz.push(createSector(startCircle, endCircle, sectors));

    startCircle = circlesList['barCircle'];
    endCircle = circlesList['dataCircle'];
    gz.push(createSector(startCircle, endCircle, sectors));

    startCircle = circlesList['dataCircle'];
    endCircle = circlesList['valueCircle'];
    gz.push(createSector(startCircle, endCircle, sectors));

    let data = new fabric.Group((gz), {left: wWidth / 2, top: wHeight / 2, selectable: selectable});
    canvas.add(data);
}
widget(config);
console.log(canvas.getObjects());
canvas.renderAll();

// function draw() {
//     circlesList['centerCircle'].title = wConfig.title;
//     circlesList['centerCircle'].totals = wConfig.totals;
// }

// let circle = drawElement({
//     radius: 500,
//     startAngle: 0,
//     angle: 270 + 360 / 22 * 2 + 0.5,
//     endAngle: 2 * Math.PI / 22,
//     fill:'#fff',
//     // startAngle: 3/2*Math.PI + 2*Math.PI/22,
//     // angle:0,
//     // endAngle: 3/2*Math.PI + 2*Math.PI/22+ 2*Math.PI/22,
//     stroke: '#57c66c',
//     startRadius: 500,
//     endRadius: 800,
// });
// fillBar(circle, 100);
// canvas.add(circle);
// fillBar(circle, 50);
//  console.log(circle);
//circle.moveTo(4);  //zindex between datasetCircle and barCircle
// config.datasets
//     .reduce((total, el) => {
//         return total + el['metrics'].length;
//     })
//     .map()
//console.log(canvas.getObjects());
//canvas.deactivateAll();
