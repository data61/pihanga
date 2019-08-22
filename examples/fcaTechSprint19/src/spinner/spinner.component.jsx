import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import styled from './spinner.style';

// https://stackoverflow.com/a/18473154
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function arc(x, y, radius, startAngle, endAngle){
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;       
}

export const SpinnerComponent = styled(({
  topPadding = 0,
  stepTick = 20,
  onCancelRequest,
  classes
}) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    function tick() {
      // reset when reaching 100%
      setProgress(oldProgress => (oldProgress >= 100 ? 0 : oldProgress + 1));
    }
    const timer = setInterval(tick, stepTick);
    // cleanup function
    return () => {
      clearInterval(timer);
    };
  });

  //const easeIn = v => v * v;
  const easeOut = t => (t -= 1) * t * t + 1;

  function Lock({progress}) {
    const off = {x: 6, y: 7.4}; // center diagram
    const angle = 360 * easeOut(progress / 100);
    const c = polarToCartesian(50, 50, 35, angle);
    const t = `translate(${c.x - off.x} ${c.y - off.y}) scale(0.5 0.5) `;
    return (
      <g transform={t}>
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
          fill='red' />
      </g>
    );
  }

  function Member({angle = 0, r = 5, fill = "green"}) {
    const c = polarToCartesian(50, 50, 35, angle);
    return (
      <circle cx={c.x} cy={c.y} r={r} fill={fill} />
    );
  }

  const lineStyle = {opacity: 0.5};
  function Spinner2({progress}) {
    return (
      <svg viewBox="0 0 100 100">
        <path id="arc1" 
          d={arc(50, 50, 35, 0, 360 * easeOut(progress / 100))}
          fill='none'
          stroke='red'
          strokeWidth='3'
          style={lineStyle}
        />
        <Lock progress={progress}/>
        <Member r={8} fill="blue"/>
        <Member angle={60} />
        <Member angle={120} />
        <Member angle={180} />
        <Member angle={240} />
        <Member angle={300} />
      </svg>
    )
  }

  return (
    <div className={classes.container} style={{paddingTop: topPadding}}>
        <Typography component="h1" variant="h4">
          Magic happens ...
        </Typography>
      <Spinner2 progress={progress}/>
      <Button
        fullWidth
        variant="contained"
        color="default"
        className={classes.cancelRequest}
        onClick={() => onCancelRequest()}
      >
        Cancel
      </Button>
    </div>
  );
});

SpinnerComponent.propTypes = {
};
