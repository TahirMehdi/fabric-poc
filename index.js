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
    selectable: true,
    renderOnAddRemove: false,
    skipTargetFind: false,
    width: wWidth,
    height: wHeight
});
const selectable = false; //object selection
const circleRad = ( wWidth < wHeight ? wWidth : wHeight) * 0.95 / 2; // radius multiplier, depends on canvas size
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

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
        metrics: [{name: "CENTRAL\n TEAMS", value: 225}, {
            name: "LONDON & SE",
            value: 135
        }, {name: "MIDLANDS\n & WALES", value: 111}, {name: "NORTH", value: 151}, {

            name: "OTHER",
            value: 232
        }, {name: "SCOTLAND, NI \n& NE ENGLAND", value: 28}, {name: "   THAMES\nVALLEY & SW", value: 31}]
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
        }).radius * addCircle.params.radiusMultpl;
    let g = (o) => `${o.x},${o.y}`;
    let circlePoint = () => new fabric.Point(centerPoint.x, centerPoint.y + rad);
    let str = ``;
    for (let x = 0, r = 0; x < count; x++, r += Math.PI * 2 / count) {
        let rotatedPoint = fabric.util.rotatePoint(circlePoint(), centerPoint, r);
        str += `M${g(centerPoint)}L${g(rotatedPoint)}`;
    }
    str += 'z';
    return (new fabric.Path(str, createLines.params));
}
createLines.params = {
    stroke: '#fff',
    strokeWidth: 0.1,
    opacity: 1,
    selectable: selectable,
    originY: 'center',
    originX: 'center',
    left: 0,
    top: 0
};
function addCircle(params) {
    params = Object.assign({}, addCircle.params, params) || Object.assign({}, addCircle.params);
    params.radius = params.radius * params.radiusMultpl;
    return new fabric.Circle(params);
}
addCircle.params = {
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
    let c1 = [];
    for (let i = 0; i < circlesConfig.length; i++) {
        if (i == 4) {
            c.push(createLines(count));
        }
        circlesList[circlesConfig[i].name] = addCircle(circlesConfig[i]);
        if (circlesConfig[i].name === 'centerCircle' || circlesConfig[i].name === 'datasetCircle') {
            c1.push(circlesList[circlesConfig[i].name]);
        } else {
            c.push(circlesList[circlesConfig[i].name]);
        }
    }
    let g = {
        left: wWidth / 2,
        top: wHeight / 2,
        selectable: selectable
    };
    c = new fabric.Group(c, g);
    canvas.add(c);
    c1 = new fabric.Group(c1, g);
    canvas.add(c1);
    return [c, c1];
}

function fillBar(id, prc) {
    prc = prc || 0;
    id.setStrokeWidth((id.radius) * 5 * circleRad / 1000 * prc / 100);
}

function countLines(config) {
    let counter = 0;
    for (let i = 0; i < config.datasets.length; i++) {
        counter += config.datasets[i].metrics.length;
    }
    return counter;
}
function createBarSector(circle, sectorsCount, currSector, params) {
    const angleStep = 2 * Math.PI / sectorsCount;
    const m = 0.044;
    addCircle.params.startAngle = angleStep * currSector - m * Math.PI;
    addCircle.params.angle = 0;
    addCircle.params.endAngle = angleStep + angleStep * currSector - 1.05 * m * Math.PI;
    addCircle.params.radius = circle.radius;
    params = Object.assign({}, addCircle.params, params);
    return new fabric.Circle(params);

}
function createSegmentText(value, params) {
    const centerPoint = new fabric.Point(wWidth / 2, wHeight / 2);
    let circlePoint = () => new fabric.Point(centerPoint.x, centerPoint.y + params.radius);
    let rotatedPoint = fabric.util.rotatePoint(circlePoint(), centerPoint, params.startAngle);

    params.angle = params.startAngle * 180 / Math.PI + 180;
    params.left = rotatedPoint.x;
    params.top = rotatedPoint.y;
    return new fabric.Text(value, params);
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
    return createSegmentText(fillValue, createTextSector.params);
}
createTextSector.params = {
    selectable: selectable
};

function createSectors(config) {
    let sectors = [];
    let circles = [];
    let c = circlesList;
    let n = countLines(config);
    let s1, s2, s3, s4;
    let currN = 0;
    let p;
    let maxVal = config.datasets.reduce((val, el) => {
        let t = el.metrics.reduce((vl, l) => {
            return vl > l.value ? vl : l.value;
        },0);
        return val > t ? val : t;
    });
    createTextSector.params.fontFamily = 'sans-serif';
    createTextSector.params.fontWeight = 'normal';
    createTextSector.params.fill = '#fff';
    createTextSector.params.fontSize = 100 * circleRad / 1000;
    createTextSector.params.opacity = 1;
    for (let i = 0; i < config.datasets.length; i++) {
        for (let z = 0; z < config.datasets[i].metrics.length; z++) {
            createTextSector.params.fontSize = 22 * circleRad / 1000;
            createTextSector.params.fill = '#75929E';
            createTextSector.params.opacity = 1;
            s1 = createTextSector(c.valueCircle, c.nameCircle, n, currN, config.datasets[i].metrics[z].name);

            createTextSector.params.opacity = 1;
            createTextSector.params.fill = '#F5F7F8';
            createTextSector.params.fontSize = 73 * circleRad / 1000;
            s3 = createTextSector(c.dataCircle, c.valueCircle, n, currN, config.datasets[i].metrics[z].value.toString());
            p = Math.floor(config.datasets[i].metrics[z].value / maxVal * 1000) / 10;

            createTextSector.params.fontSize = 35 * circleRad / 1000;
            createTextSector.params.fill = '#5F8998';
            createTextSector.params.opacity = 1;
            s2 = createTextSector(c.barCircle, c.dataCircle, n, currN, p.toString() + '%');
            sectors.push(s1);
            sectors.push(s2);
            sectors.push(s3);
            if (z === Math.floor(config.datasets[i].metrics.length / 2)) {
                createTextSector.params.fontSize = 35 * circleRad / 1000;
                createTextSector.params.fill = '#fff';
                createTextSector.params.opacity = 1;
                s4 = createTextSector(c.centerCircle, c.datasetCircle, n, currN, config.datasets[i].name);
                sectors.push(s4);
            }

            let circle = createBarSector(c.datasetCircle, n, currN, {
                stroke: '#57c66c',
                fill: '',
            });
            circles.push(circle);
            fillBar(circle, p);

            if (z === 0) {
                const centerPoint = new fabric.Point(wWidth / 2, wHeight / 2);
                let rad = circlesConfig.find((el) => {
                        return el.name === 'nameCircle';
                    }).radius * addCircle.params.radiusMultpl;
                let circlePoint = () => new fabric.Point(centerPoint.x + rad, centerPoint.y);
                let r = (currN) * (2 * Math.PI / n) - (2 * Math.PI / n) / 2;
                let rotatedPoint = fabric.util.rotatePoint(circlePoint(), centerPoint, r);
                let line = new fabric.Line([centerPoint.x, centerPoint.y, rotatedPoint.x, rotatedPoint.y], {
                    stroke: '#215866',
                    strokeWidth: 5,
                    selectable: selectable
                });
                canvas.add(line);
                line.moveTo(1);
            }
            currN++;
        }
    }

    let t = new fabric.Group(circles, {left: wWidth / 2, top: wHeight / 2, selectable: selectable});
    canvas.add(t);
    t.moveTo(1);
    return sectors;

}

function widget(config) {
    let wheel = createWheel(countLines(config), circlesConfig);

    let gz = [...createSectors(config)];
    let data = new fabric.Group((gz), {left: wWidth / 2, top: wHeight / 2, selectable: selectable});
    canvas.add(data);
}
widget(config);
console.log(canvas.getObjects());
canvas.renderAll();