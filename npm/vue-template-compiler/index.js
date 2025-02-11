let data;
try {
  data = require('vue-template-compiler2/build');
  console.log('vue-template-compiler2/build', data);
} catch (e) {
  console.log(e);

}
module.exports = data;