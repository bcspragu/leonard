$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2.5);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });

  $('.graph-select').on('click','.button',function(){
    $(this).toggleClass('success');
  });
});


function updateGraph(){
  var amp1 = nanDefault(parseFloat($('.amp1').val()),1);
  var omega1 = nanDefault(parseFloat($('.omega1').val()),50);
  var deg1 = nanDefault(parseFloat($('.deg1').val()),0);

  var amp2 = nanDefault(parseFloat($('.amp2').val()),1);
  var omega2 = nanDefault(parseFloat($('.omega2').val()),50);
  var deg2 = nanDefault(parseFloat($('.deg2').val()),0);

  var coef1 = omega1 == 1 ? "" : omega1;
  var coef2 = omega2 == 1 ? "" : omega2;
  var coef3 = omega1-omega2 == 1 ? "" : omega1-omega2;
  var coef4 = omega1+omega2 == 1 ? "" : omega1+omega2;
  var tmax = 0.5;

  var glob = {a1: amp1, a2: amp2, o1: omega1, o2: omega2, d1: deg1, d2: deg2, t: tmax};
  var base1 = [];
  var base2 = [];
  var res = [];

  var baseline = [[0,0],[tmax*1000,0]];
  var graphs_to_display = [];

  graphs_to_display.push({data: baseline, color: 'black', shadowSize: 0});

  $('.success').each(function(){
    graphs_to_display.push(genGraph($(this).text(),glob));
  });

  var grid = {labelMargin: 10};

  grid.borderWidth = {bottom: 2, left: 3, top:2, right: 2},
  grid.borderColor = {left: 'black'};
  
  var plot = $.plot('.plot',graphs_to_display, {
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
    }],
    grid: grid
      });

  $('.note').text('The product of two sinusoids can always be written as the sum of two sinusoids. In this case, '+ampString(amp1)+'cos('+coef1+'t'+degString(deg1)+' * '+ampString(amp2)+'cos('+coef2+'t'+degString(deg2)+' = '+ampString(amp1*amp2*0.5)+'cos('+coef3+'t) + '+ampString(amp1*amp2*0.5)+'cos('+coef4+'t).');
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

function ampString(amp){
  var amp_str = "";
  if(amp == -1){
    amp_str = "-"
  }else if(amp != 1){
    amp_str = amp;
  }
  return amp_str;
}

function degString(deg){
  var deg_str = ")";
  if(deg > 0){
    deg_str = '+'+deg+'°)';
  }else if(deg < 0){
    deg_str = deg+'°)';
  }
  return deg_str;
}

function genGraph(type,glob){
  var data = [];
  var obj = {};
  var label;
  if(type == "Input 1"){
    for(var i = 0; i < glob.t*1000; i += 1/glob.o1){
      data.push([i,glob.a1*Math.cos(glob.o1*i/1000+glob.d1*Math.PI/180)]);
    }
    var coef = glob.o1 == 1 ? "" : glob.o1;
    obj.label = ampString(glob.a1)+"cos("+coef+"t"+degString(glob.d1);
  }

  if(type == "Input 2"){
    for(var i = 0; i < glob.t*1000; i += 1/glob.o2){
      data.push([i,glob.a2*Math.cos(glob.o2*i/1000+glob.d2*Math.PI/180)]);
    }
    var coef = glob.o2 == 1 ? "" : glob.o2;
    obj.label = ampString(glob.a2)+"cos("+coef+"t"+degString(glob.d2);
  }

  if(type == "Sum 1"){
    var o = Math.abs(glob.o1-glob.o2);
    for(var i = 0; i < glob.t*1000; i += 1/o){
      data.push([i,(glob.a1*glob.a2/2)*Math.cos(o*i/1000)]);
    }
    var coef = o == 1 ? "" : o;
    obj.label = ampString(glob.a1*glob.a2/2)+"cos("+coef+"t)";
  }

  if(type == "Sum 2"){
    var o = Math.abs(glob.o1+glob.o2);
    for(var i = 0; i < glob.t*1000; i += 1/o){
      data.push([i,(glob.a1*glob.a2/2)*Math.cos(o*i/1000)]);
    }
    var coef = o == 1 ? "" : o;
    obj.label = ampString(glob.a1*glob.a2/2)+"cos("+coef+"t)";
  }

  if(type == "Product"){
    for(var i = 0; i < glob.t*1000; i += 2/(glob.o1+glob.o2)){
      data.push([i,(glob.a1*Math.cos(glob.o1*i/1000+glob.d1*Math.PI/180))*(glob.a2*Math.cos(glob.o2*i/1000+glob.d2*Math.PI/180))]);
    }
    var coef1 = glob.o1 == 1 ? "" : glob.o1;
    var coef2 = glob.o2 == 1 ? "" : glob.o2;
    obj.label = ampString(glob.a1)+"cos("+coef1+"t"+degString(glob.d1)+' * '+ampString(glob.a2)+"cos("+coef2+"t"+degString(glob.d2);
  }

  obj.data = data;
  return obj;
}
