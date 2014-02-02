$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var omega = nanDefault(parseFloat($('.omega').val()),50);
  var tmin = nanDefault(parseFloat($('.tmin').val()),-0.2);
  var tmax = nanDefault(parseFloat($('.tmax').val()),0.3);
  var deg = nanDefault(parseFloat($('.deg').val()),90);
  deg = fixDeg(deg);
  $('.deg').val(deg);
  var base = [];
  var shifted = [];
  var coefficient = omega == 1 ? "" : omega;
  var base_label = "cos("+coefficient+"t)";
  var shifted_label = "";
  if(deg > 0){
    shifted_label = "cos("+coefficient+"t+"+deg+"°)";
  }else if (deg < 0){
    shifted_label = "cos("+coefficient+"t"+deg+"°)";
  }else{
    shifted_label = "cos("+coefficient+"t)";
  }
  var factor = omega/10;
  for(var i = tmin*1000; i < tmax*1000; i += 1/factor){
    base.push([i,Math.cos(omega*i/1000)]);
    shifted.push([i,Math.cos(omega*i/1000+deg*Math.PI/180)]);
  }
  var baseline = [[tmin*1000,0],[tmax*1000,0]];
  var plot = $.plot('.plot',[
      {data: baseline, color: 'black', shadowSize: 0},
      {data: base, label: base_label},
      {data: shifted, label: shifted_label}
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
      font: {size: 15, color: 'black'}
    }],
    grid: {
      borderWidth: {bottom: 2, left: 3, top:2, right: 2},
      borderColor: {left: 'black'},
      labelMargin: 10
    }
  });
  var ll = leadLag(deg,omega)
  $('.note').text('The function '+shifted_label+'  is '+ll.ll+' '+base_label+' by '+ll.delay+'  ms');
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

function leadLag(deg,omega){
  var ll = {ll: 'leading', delay: 0};
  ll.delay = (1000*(deg*Math.PI)/(180*omega));
  if(deg > 180){
    ll.ll = "lagging";
    ll.delay = 2*Math.PI/omega*1000 - ll.delay;
  }
  ll.delay = ll.delay.toFixed(2);
  return ll;
}
