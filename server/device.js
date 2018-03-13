
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
} ;

module.exports = {
  addDevice
}

