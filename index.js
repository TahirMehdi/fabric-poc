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
const selectable = false; //object selection
const circleRad = ( wWidth < wHeight ? wWidth : wHeight) * 0.95 / 2; // radius multiplier, depends on canvas size
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
    return (new fabric.Path(str, createLines.params ));
}
createLines.params = {
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
    return new fabric.Circle(p);
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
function createWheel(count, circlesConfig) {
    let c = [];
    for (let i = 0; i < circlesConfig.length; i++) {
        if (i == 4) {
            c.push(createLines(count));
        }
        circlesList[circlesConfig[i].name] = addCircle(circlesConfig[i]);
        c.push(circlesList[circlesConfig[i].name]);
    }
    return c;
}

function fillBar(id, prc) {
    prc = prc || 0;
    id.setStrokeWidth((id.endRadius - id.startRadius) * 2 * prc / 100);
}
function createSegmentText(params, value) {
    const centerPoint = new fabric.Point(wWidth / 2, wHeight / 2);
    let circlePoint = () => new fabric.Point(centerPoint.x, centerPoint.y + params.radius);
    let rotatedPoint = fabric.util.rotatePoint(circlePoint(), centerPoint, params.startAngle);

    params.angle = params.startAngle * 180 / Math.PI + 180;
    params.left = rotatedPoint.x;
    params.top = rotatedPoint.y;
    return new fabric.Text(value, params);
}
function countLines(config) {
    let counter = 0;
    for (let i = 0; i < config.datasets.length; i++) {
        counter += config.datasets[i].metrics.length;
    }
    return counter
}
function createTextSector(startCircle, endCircle, sectorsCount, currSector, fillValue) {
    let startRadius = startCircle.getRadiusX();
    let endRadius = endCircle.getRadiusX();
    const angleStep = 2 * Math.PI / sectorsCount;
    createTextSector.params.startAngle = 3 / 2 * Math.PI + angleStep * currSector;
    createTextSector.params.angle = 0;
    createTextSector.params.endAngle = 3 / 2 * Math.PI + angleStep + angleStep * currSector;
    createTextSector.params.radius = startRadius + (endRadius - startRadius) / 2;
    createTextSector.params.startRadius = startRadius;
    createTextSector.params.endRadius = endRadius;
    return createSegmentText(createTextSector.params, fillValue);
}
function createBarSector(startCircle, endCircle, sectorsCount, currSector, fillValue) {
    let startRadius = startCircle.getRadiusX();
    let endRadius = endCircle.getRadiusX();
    const angleStep = 2 * Math.PI / sectorsCount;
    createTextSector.params.startAngle = 3 / 2 * Math.PI + angleStep * currSector;
    createTextSector.params.angle = 0;
    createTextSector.params.endAngle = 3 / 2 * Math.PI + angleStep + angleStep * currSector;
    createTextSector.params.radius = startRadius + (endRadius - startRadius) / 2;
    createTextSector.params.startRadius = startRadius;
    createTextSector.params.endRadius = endRadius;
    return createSegmentText(createTextSector.params, fillValue);
}
createTextSector.params = {
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

function createSectors(config) {
    let sectors = [];
    let c = circlesList;
    let n = countLines(config);
    let s1, s2, s3,s4;
    let currN = 0;
    let p = [0.2, 60.5, 77.1, 53.6, 55.8, 47, 92,
        49.7, 55.9, 40.1, 86.7, 98.6, 7.3, 49,
        56.9, 95.8, 18.4, 84.2, 22.7, 46, 71.7, 66.9];
    createTextSector.params.fontFamily = 'sans-serif';
    createTextSector.params.fontWeight = 'normal';
    createTextSector.params.fill = '#fff';
    createTextSector.params.fontSize = 100*circleRad/1000;
    createTextSector.params.opacity = 1;
    for (let i = 0; i < config.datasets.length; i++) {
        for (let z = 0; z < config.datasets[i].metrics.length; z++) {
            // sectors.push({
            //     datasetName: config.datasets[i].name,
            //     name: config.datasets[i].metrics[z].name,
            //     value: config.datasets[i].metrics[z].value,
            //     percent: p[currN]
            // });
            createTextSector.params.fontSize = 22*circleRad/1000;
            createTextSector.params.fill = '#75929E';
            createTextSector.params.opacity = 1;
            s1 = createTextSector(c.valueCircle, c.nameCircle, n, currN, config.datasets[i].metrics[z].name);

            createTextSector.params.opacity = 1;
            createTextSector.params.fill = '#F5F7F8';
            createTextSector.params.fontSize = 73*circleRad/1000;
            s3 = createTextSector(c.dataCircle, c.valueCircle, n, currN, config.datasets[i].metrics[z].value.toString());

            createTextSector.params.fontSize = 35*circleRad/1000;
            createTextSector.params.fill = '#5F8998';
            createTextSector.params.opacity = 1;//0.5;
            s2 = createTextSector(c.barCircle, c.dataCircle, n, currN, p[currN].toString() + '%');
            sectors.push(s1);
            sectors.push(s2);
            sectors.push(s3);
            if (z === Math.floor(config.datasets[i].metrics.length /2 )){
                createTextSector.params.fontSize = 25*circleRad/1000;
                createTextSector.params.fill = '#fff';
                createTextSector.params.opacity = 1;
                s4 = createTextSector(c.centerCircle, c.datasetCircle, n, currN, config.datasets[i].name);
                sectors.push(s4);
            }
            // if (z ===0 ){
            //     const centerPoint = new fabric.Point(0, 0);
            //     let rad = circlesConfig.find((el) => {
            //             return el.name === 'nameCircle';
            //         }).radius * addCircle.circleConfig.radiusMultpl;
            //     let g = (o) => `${o.x},${o.y}`;
            //     let circlePoint = () => new fabric.Point(centerPoint.x, centerPoint.y + rad);
            //     let str = ``;
            //     for (let x = 0, r = 0; x < count; x++, r += Math.PI * 2 / count) {
            //         let rotatedPoint = fabric.util.rotatePoint(circlePoint(), centerPoint, r);
            //         str += `M${g(centerPoint)}L${g(rotatedPoint)}`;
            //     }
            //     str += 'z';
            // }
            currN++;

        }

    }
    return sectors;

}

function widget(config) {
    let wheel = new fabric.Group(createWheel(countLines(config), circlesConfig), {
        left: wWidth / 2,
        top: wHeight / 2,
        selectable: selectable
    });
    canvas.add(wheel);

    let gz = createSectors(config);
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