$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var amp = nanDefault(parseFloat($('.amp').val()),1);
  var omega = nanDefault(parseFloat($('.omega').val()),50);
  var deg = nanDefault(parseFloat($('.deg').val()),0);
  var amp_min = -Math.abs(amp);
  var amp_max = Math.abs(amp);
  var base = [];
  var vertical = [];
  var tmin = -0.2;
  var tmax = 0.3;
  var non_zero_axis = tmin < 0 && tmax > 0;

  if(non_zero_axis){
    vertical.push([0,amp_min]);
    vertical.push([0,amp_max]);
  }

  var amp_str = "";
  if(amp == -1){
    amp_str = "-"
  }else if(amp != 1){
    amp_str = amp;
  }
  var coefficient = omega == 1 ? "" : omega;
  var base_label = amp_str+"cos("+coefficient+"t";

  if(deg > 0){
    base_label += '+'+deg+'°)';
  }else if(deg < 0){
    base_label += deg+'°)';
  }else{
    base_label += ')';
  }

  var factor = omega/10;
  var grid = {labelMargin: 10};

  if(non_zero_axis){
    grid.borderWidth = {bottom: 2, left: 2, top:2, right: 2},
    grid.borderColor = {};
  }else{
    grid.borderWidth = {bottom: 2, left: 3, top:2, right: 2},
    grid.borderColor = {left: 'black'};
  }

  for(var i = tmin*1000; i < tmax*1000; i += 1/factor){
    base.push([i,amp*Math.cos(omega*i/1000+deg*Math.PI/180)]);
  }

  var baseline = [[tmin*1000,0],[tmax*1000,0]];
  var plot = $.plot('.plot',[
      {data: baseline, color: 'black', shadowSize: 0},
      {data: vertical, color: 'black', shadowSize: 0, lineWidth: 3},
      {data: base, label: base_label},
      ], {
    series: {
      lines: {
        show: true
      },
    },
    xaxes: [{
      axisLabel: 'time, t (ms)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'f(t)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'},
      min: amp_min,
      max: amp_max
    }],
    grid: grid
      });
  $('.note').text('The function '+base_label+' has a period of T = '+(1000*2*Math.PI/omega).toFixed(2)+' ms.');
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}

function fixDeg(deg){
  while(deg < 0){
    deg += 360;
  }
  while(deg >= 360){
    deg -= 360;
  }
  return deg;
}
