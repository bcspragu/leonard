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
  var period = nanDefault(parseFloat($('.period').val()),1);

  var tmin = nanDefault(parseFloat($('.tmin').val()),-1);
  var tmax = nanDefault(parseFloat($('.tmax').val()),2);

  var range = highest_and_lowest(pulse);
  var pulse = generatePulse(pulse,period,tmin,tmax);

  var baseline = [[tmin,0],[tmax,0]];
  var yaxis = [[0,range.lowest-1],[0,range.highest+1]];
  
  var plot = $.plot('.plot',[{data: pulse},
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

function generatePulse(pulse,period,tmin,tmax){
  var pulses = [];
  var pattern = pulse.split(' ');
  for(var i = 0; i < pattern.length; i++){
    pattern[i] = parseInt(pattern[i]);
  }

  var index = 0;
  for(var i = tmin; i < tmax; i += period/pattern.length){
    pulses.push([i,pattern[index % pattern.length]]);
    pulses.push([i+period/pattern.length,pattern[index % pattern.length]]);
    index++;
  }
  return pulses;
}

function highest_and_lowest(pulse){
  var pattern = pulse.split(' ');
  var range = {highest: -1000, lowest: 1000};
  for(var i = 0; i < pattern.length; i++){
    var amplitude = parseInt(pattern[i]);
    if(amplitude > range.highest){
      range.highest = amplitude;
    }
    if(amplitude < range.lowest){
      range.lowest = amplitude;
    }
  }
  return range;
}
