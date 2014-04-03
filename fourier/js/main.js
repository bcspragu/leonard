$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/1.5);
  updateGraph(); 
  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var pulse = $('.pulse').val() || "0 1 0 0 0";
  pulse = pulseToNum(pulse);
  var period = nanDefault(parseFloat($('.period').val()),1);

  var tmin = nanDefault(parseFloat($('.tmin').val()),-1);
  var tmax = nanDefault(parseFloat($('.tmax').val()),2);
  var n_val = nanDefault(parseFloat($('.nval').val()),1);

  var range = highest_and_lowest(pulse);
  var pulses = generatePulse(pulse,period,tmin,tmax);
  var fourier = generateFourier(pulse,period,tmin,tmax,n_val);

  var baseline = [[tmin,0],[tmax,0]];
  var yaxis = [[0,range.lowest-1],[0,range.highest+1]];
  
  var plot = $.plot('.plot',[{data: pulses},{data: fourier},
      {data: baseline, color: 'black', shadowSize: 0},
      {data: yaxis, color: 'black', shadowSize: 0}], {
    series: {
      lines: {
        show: true
      },
    },
    xaxis: {
      show: true,
      axisLabel: 't/T',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'},
      min: tmin,
      max: tmax
    },
    yaxis: {
      show: true,
      axisLabel: 'f(t)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'},
      min: range.lowest-1,
      max: range.highest+1,
    },
    grid: {labelMargin: 10, borderWidth: 0},
    });

}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}

function pulseToNum(pulse){
  var pattern = pulse.split(' ');
  for(var i = 0; i < pattern.length; i++){
    pattern[i] = parseFloat(pattern[i]);
  }
  return pattern;
}

function generatePulse(pattern,period,tmin,tmax){
  var pulses = [];

  var index = 0;
  for(var i = tmin; i < tmax; i += period/pattern.length){
    pulses.push([i,pattern[index % pattern.length]]);
    pulses.push([i+period/pattern.length,pattern[index % pattern.length]]);
    index++;
  }
  return pulses;
}

function generateFourier(pulses,period,tmin,tmax,n){
  var a_0 = averagePulse(pulses);
  var a_ns = [];
  var b_ns = [];
  var w_0 = 2*Math.PI/period;
  for(var i = 0; i < n; i++){
    var a_n = 0;
    var b_n = 0;
    for(var j = 0; j < pulses.length; j++){
      a_n += pulses[j]*i*w_0*(Math.sin(i*w_0*(j+1)*period/pulses.length)-Math.sin(i*w_0*j*period/pulses.length));
      b_n += pulses[j]*i*w_0*(Math.cos(i*w_0*j*period/pulses.length)-Math.cos(i*w_0*(j+1)*period/pulses.length));
    }
    a_ns.push(a_n*2/period);
    b_ns.push(b_n*2/period);
  }
  var fxn = [];
  var index = 0;
  var val;
  for(var i = tmin; i < tmax; i += 1/100){
    val = a_0;
    for(var j = 0; j < n; j++){
      val += a_ns[j]*Math.cos(j*w_0*i)+b_ns[j]*Math.sin(j*w_0*i);
    }
    fxn.push([i,val]);
  }
  return fxn;
}

function averagePulse(pulses){
  var sum = 0;
  for(var i = 0; i < pulses.length; i++){
    sum += pulses[i];
  }
  return sum/pulses.length;
}

function highest_and_lowest(pulse){
  var range = {highest: -1000, lowest: 1000};
  for(var i = 0; i < pulse.length; i++){
    var amplitude = pulse[i];
    if(amplitude > range.highest){
      range.highest = amplitude;
    }
    if(amplitude < range.lowest){
      range.lowest = amplitude;
    }
  }
  return range;
}
