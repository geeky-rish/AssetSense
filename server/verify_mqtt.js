import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
    console.log('Test Client Connected');

    const payload = {
        nodeId: 'pump-01',
        temp: 75.5,
        vib: 2.1,
        current: 12.5,
        timestamp: Date.now()
    };

    client.publish('assetsense/nodes/pump-01', JSON.stringify(payload), () => {
        console.log('Test Message Published:', payload);
        client.end();
    });
});
