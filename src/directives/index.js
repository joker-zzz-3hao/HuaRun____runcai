// eslint-disable-next-line import/no-unresolved
import { formatNumber } from 'accounting-js';

export default (Vue) => {
  Vue.directive('money', (el, binding) => {
    const { value } = binding;
    let amount = value.value;
    let { precision } = value.precision;
    if (value instanceof Object) {
      amount = value.value;
      precision = value.precision;
    }
    if (value !== null && value !== undefined) {
      el.innerHTML = formatNumber(amount, { precision });
    }
  });
};