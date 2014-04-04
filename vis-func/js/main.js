$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/1.75);
  updateGraph(); 

  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var pulse = $('.pulse').val() || "0 1 0 0 0";
  pulse = pulseToNum(pulse);
  var period = nanDefault(parseFloat($('.period').val()),1);

  var n_val = nanDefault(parseFloat($('.nval').val()),-1);

  var range = highest_and_lowest(pulse);
  var pulses = generatePulse(pulse);
  var fourier = generateFourier(pulse,n_val);

  var baseline = [[0,0],[1,0]];
  var graphs = [{data: pulses, color: 'lightblue'},
    {data: baseline, color: 'black', shadowSize: 0}];
  
  if(n_val >= 0){
    graphs.push({data: fourier[0]});
    graphs.push({data: fourier[1], lines: {fill: true}});
  }

  
  var plot = $.plot('.plot',graphs, {
    series: {
      lines: {
        show: true
      },
    },
    xaxis: {
      show: true,
      axisLabel: 't/T',
      axisLabelPadding: 20,
      axisLabelUseCanvas: true,
      axisLabelFontSizePixels: 25,
      font: {size: 20, color: 'black'},
      min: 0,
      max: 1,
      transform: function(x){return x/period;}
    },
    yaxis: {
      show: true,
      axisLabel: 'f(t)',
      axisLabelPadding: 20,
      axisLabelUseCanvas: true,
      axisLabelFontSizePixels: 25,
      font: {size: 20, color: 'black'}
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

function generatePulse(pattern){
  var pulses = [];

  var index = 0;
  for(var i = 0; i < 1; i += 1/pattern.length){
    pulses.push([i,pattern[index % pattern.length]]);
    pulses.push([i+1/pattern.length,pattern[index % pattern.length]]);
    index++;
  }
  return pulses;
}

function generateFourier(pulses,n){
  var a_n = 0;
  var b_n = 0;
  var w_0 = 2*Math.PI;

  for(var j = 0; j < pulses.length; j++){
    a_n += pulses[j]*(Math.sin(n*w_0*(j+1)/pulses.length)-Math.sin(n*w_0*j/pulses.length));
    //b_n += pulses[j]*(Math.cos(n*w_0*j/pulses.length)-Math.cos(n*w_0*(j+1)/pulses.length));
  }

  a_n *= 2/(w_0*n);
  b_n *= 2/(w_0*n);

  console.log(a_n)
  var factor = 1000;
  var fxn = [];
  var fxn2 = [];
  for(var i = 0; i < 1; i += 1/factor){
    fxn.push([i,a_n*Math.cos(n*w_0*i)]);
    //fxn.push([i,a_n*Math.cos(n*w_0*i)+b_n*Math.sin(n*w_0*i)]);
    if(pulses[Math.floor(i*pulses.length)] != 0){
      fxn2.push([i,pulses[Math.floor(i*pulses.length)]*a_n*Math.cos(n*w_0*i)+b_n*Math.sin(n*w_0*i)])
    }
  }
  return [fxn,fxn2];
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
