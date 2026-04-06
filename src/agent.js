import axios from 'axios'; console.log('!!! AGENT LOADED WITH PORT 3333 !!!'); export default axios.create({ baseURL: 'http://localhost:3333/' });
