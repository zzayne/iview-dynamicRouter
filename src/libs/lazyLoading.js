export default (url) => resolve => { require([`@/views/${url}.vue`], resolve); };
