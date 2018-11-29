const os = require('os-utils');
const q = require('daskeyboard-applet')

const colors = ['#00FF00', '#00FF00', '#00FF00', '#00FF00', '#FFFF00', '#FFFF00', '#FF0000', '#FF0000', '#FF0000', '#FF0000']

const logger = q.logger;

class CpuUsage extends q.DesktopApp {
    constructor() {
        super();

        this.pollingInterval = 3000;
        logger.info("CPU Usage Meter ready to go!")
    }

    async run() {
        return this.getCpuUsage().then(percent => {
            return new q.Signal({
                points: [this.generatePoints(percent)],
                name: "CPU Usage",
                message: Math.round(percent * 100) + "%",
                isMuted: true
            })
        })
    }

    async getCpuUsage() {
        return new Promise((resolve) => {
            os.cpuUsage(v => {
                resolve(v)
            })
        })
    }

    generatePoints(percent) {
        const numberOfKeys = 10;

        const numberOfKeysToLight = Math.round(numberOfKeys * percent);
        let points = [];

        for (let i = 0; i < numberOfKeys; i++) {
            points.push(new q.Point(this.getColor(i, numberOfKeysToLight)))
        }

        return points;
    }

    getColor(zoneIndex, numberOfKeysToLight) {
        if(zoneIndex >= numberOfKeysToLight) {
            return '#0000FF';
        } else {
            return colors[zoneIndex]
        }
    }
}

module.exports = {
    CpuUsage: CpuUsage
}

const cpuUsage = new CpuUsage();