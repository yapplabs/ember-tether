let transitionModule = {
  className: 'transition',
  thresholdX: 50,
  thresholdY: 50,

  position(props) {
    let className = `${this.options.classPrefix}-${transitionModule.className}`;
    let hasClass = window.Tether.Utils.hasClass(this.element, className);
    let lastOffset = this._cacheOffset;

    let shouldAddClass = lastOffset &&
      Math.abs(props.left - lastOffset[0]) <= transitionModule.thresholdX &&
      Math.abs(props.top - lastOffset[1]) <= transitionModule.thresholdY;

    if (!hasClass && shouldAddClass) {
      window.Tether.Utils.addClass(this.element, className);
    } else if (hasClass && !shouldAddClass) {
      window.Tether.Utils.removeClass(this.element, className);
    }

    // Cache the offset
    this._cacheOffset = [props.left, props.top];
  }
};

export default transitionModule;
