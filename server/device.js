
// device = {
//  _id: '123'
//   name: 'reconhecedor_facial',
// }

let devices = [{
  id: '123',
  name: 'facial'
}];

const addDevice = (device) => {
  devices.push(device);
};

const findDevice = (name, password) => {
  return devices.find((device) => device.name === name && device.password === password);
};

module.exports = {
  addDevice,
  findDevice
}

