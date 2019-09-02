import { LineChartComp } from './lineChart.component';

export function init(register) {
  register.cardComponent({
    name: 'ReLineChart',
    component: LineChartComp,
    // events: {
    //   onValueChanged: ACTION_TYPES.VALUE_CHANGED,
    //   onFormSubmit: ACTION_TYPES.FORM_SUBMIT
    // },
  });
}
