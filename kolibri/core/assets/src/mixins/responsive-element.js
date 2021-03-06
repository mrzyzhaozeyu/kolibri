
/*
  Apply this mixin to your vue components to get reactive information
  about the component's size.

  For example:

    <script>

      const responsiveElement = require('./responsive-element-mixin.js')

      export default {
        mixins: [responsiveElement],
        props: {
    ...

  This adds a new reactive property called `elSize` to your vue model:

    elSize: {
      width: 0,    // component's $el width (px)
      height: 0,   // component's $el height (px)
    },
*/


const ResizeSensor = require('css-element-queries/src/ResizeSensor');

module.exports = {
  data() {
    return {
      // becomes available for use
      elSize: { width: 0, height: 0 },
    };
  },
  methods: {
    _updateEl() {
      this.elSize.width = this.$el.clientWidth;
      this.elSize.height = this.$el.clientHeight;
    },
  },
  mounted() {
    this._updateEl();
    this.$options._resizeSensor = new ResizeSensor(this.$el, this._updateEl);
  },
  beforeDestroy() {
    this.$options._resizeSensor.detach(this.$el, this.update);
  },
};

