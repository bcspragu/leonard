$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph(); 

  $('.update-graph').click(function(){
    updateGraph();
  });

  $('.coefficient').click(function(e){
    e.preventDefault();
    var t = $(this);
    t.toggleClass('alert');
    if(t.hasClass('alert')){
      t.text('$b_n\\text{ Coefficient}$');
    }else{
      t.text('$a_n\\text{ Coefficient}$');
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  });
});


function updateGraph(){
  var pulse = $('.pulse').val() || "0 1 0 0 0";
  pulse = pulseToNum(pulse);
  var period = nanDefault(parseFloat($('.period').val()),1);
  var bn = $('.coefficient').hasClass('alert');

  var n_val = nanDefault(parseFloat($('.nval').val()),-1);

  var coef = generateCoef(pulse,n_val,bn);
  var range = highest_and_lowest(pulse);
  var pulses = generatePulse(pulse);
  var fourier = generateFourier(pulse,n_val,bn,coef);
  var avg = averagePulse(pulse);

  var baseline = [[0,0],[1,0]];
  var graphs = [{data: pulses, color: 'lightblue'},
    {data: baseline, color: 'black', shadowSize: 0}];
  
  if(n_val > 0){
    graphs.push({data: fourier[0]});
    for(var i = 1; i < fourier.length; i++){
      graphs.push({data: fourier[i], lines: {fill: true}, color: 'red'});
    }
  }else if(n_val == 0){
    graphs.push({data: [[0,avg],[1,avg]], color: 'red'});
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
  var note = $('.note');
  if(n_val > 0){
    if(bn){
      note.text("\\[\\large{b_n = "+coef.toFixed(5)+"}\\]");
    }else{
      note.text("\\[\\large{a_n = "+coef.toFixed(5)+"}\\]");
    }
  }else if(n_val == 0){
    note.text("\\[\\large{a_0 = "+avg.toFixed(5)+"}\\]");
  }
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
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

function generateCoef(pulses,n,bn){
  var coef = 0
  var w_0 = 2*Math.PI;

  if(bn){
    for(var j = 0; j < pulses.length; j++){
      coef += pulses[j]*(Math.cos(n*w_0*j/pulses.length)-Math.cos(n*w_0*(j+1)/pulses.length));
    }
  }else{
    for(var j = 0; j < pulses.length; j++){
      coef += pulses[j]*(Math.sin(n*w_0*(j+1)/pulses.length)-Math.sin(n*w_0*j/pulses.length));
    }
  }
  return coef*2/(w_0*n);
}
function generateFourier(pulses,n,bn,coef){
  var trig_fn;
  var w_0 = 2*Math.PI;

  if(bn){
    trig_fn = function(t){
      return Math.sin(n*w_0*t);
    };
  }else{
    trig_fn = function(t){
      return Math.cos(n*w_0*t);
    };
  }

  var factor = 1000;
  var fxns = [[],[]];
  var index = 1;
  for(var i = 0; i < 1; i += 1/factor){
    fxns[0].push([i,trig_fn(i)]);
    if(i != 0 && pulses[Math.floor((i-1/factor)*pulses.length)] == 0 && pulses[Math.floor(i*pulses.length)] != 0){
      index++;
      fxns[index] = [];
    }
    if(pulses[Math.floor(i*pulses.length)] != 0){
      fxns[index].push([i,pulses[Math.floor(i*pulses.length)]*coef*trig_fn(i)]);
    }
  }
  return fxns;
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

function averagePulse(pulses){
  var sum = 0;
  for(var i = 0; i < pulses.length; i++){
    sum += pulses[i];
  }
  return sum/pulses.length;
}
