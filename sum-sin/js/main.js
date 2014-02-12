$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
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
  var omega1 = nanDefault(parseFloat($('.omega').val()),50);
  var deg1 = nanDefault(parseFloat($('.deg1').val()),0);

  var amp2 = nanDefault(parseFloat($('.amp2').val()),1);
  var omega2 = nanDefault(parseFloat($('.omega').val()),50);
  var deg2 = nanDefault(parseFloat($('.deg2').val()),0);

  var gmax = Math.abs(nanDefault(parseFloat($('.graph-max').val()),1.5));
  var tmin = nanDefault(parseFloat($('.tmin').val()),0);
  var tmax = nanDefault(parseFloat($('.tmax').val()),0.5);

  var coef1 = omega1 == 1 ? "" : omega1;
  var coef2 = omega2 == 1 ? "" : omega2;
  var coef3 = Math.abs(omega1-omega2) == 1 ? "" : Math.abs(omega1-omega2);
  var coef4 = omega1+omega2 == 1 ? "" : omega1+omega2;

  var glob = {a1: amp1, a2: amp2, o1: omega1, o2: omega2, d1: deg1, d2: deg2, tmin: tmin, tmax: tmax};
  var base1 = [];
  var base2 = [];
  var res = [];

  var baseline = [[tmin*1000,0],[tmax*1000,0]];
  var graphs_to_display = [];

  var non_zero_axis = tmin < 0 && tmax >= 0;
  if(non_zero_axis){
    graphs_to_display.push({data: [[0,-gmax],[0,gmax]], color: 'black', shadowSize: 0});
  }

  graphs_to_display.push({data: baseline, color: 'black', shadowSize: 0});

  $('.success').each(function(){
    graphs_to_display.push(genGraph($(this).text(),glob));
  });

  var grid = {labelMargin: 10};

  if(non_zero_axis){
    grid.borderWidth = {bottom: 2, left: 2, top:2, right: 2},
    grid.borderColor = {};
  }else{
    grid.borderWidth = {bottom: 2, left: 3, top:2, right: 2},
    grid.borderColor = {left: 'black'};
  }
  
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
      min: -gmax,
      max: gmax 
    }],
    grid: grid,
    legend: {
      container: $('.legend')
    }
      });

  var note_string = 'The sum of two sinusoids with the same frequency is a single sinusoid with the same frequency. In this case, '
  //Function 1
  note_string += ampString(amp1)+'cos('+coef1+'t'+degString(deg1);
  note_string += ' + ';
  //Function 2
  note_string += ampString(amp2)+'cos('+coef2+'t'+degString(deg2)
  note_string += ' = '
  var coef = generateCoef(glob.a1,glob.a2,glob.d1,glob.d2);
  coef = coef == 1 ? "" : coef;
  var angle = generateAngle(glob.a2,glob.d1,glob.d2);
  note_string += ampString(coef.toFixed(3))+"cos("+coef1+"t"+degString(angle.toFixed(3));")."
  $('.note').text(note_string);
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}

function fixDeg(deg){
  while(deg <= -180){
    deg += 360;
  }
  while(deg > 180){
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
  if(type == "Term 1"){
    var increment = Math.abs(1/glob.o1);
    for(var i = glob.tmin*1000; i < glob.tmax*1000; i += increment){
      data.push([i,glob.a1*Math.cos(glob.o1*i/1000+glob.d1*Math.PI/180)]);
    }
    var coef = glob.o1 == 1 ? "" : glob.o1;
    obj.label = ampString(glob.a1)+"cos("+coef+"t"+degString(glob.d1);
    obj.color = "#EDC240";
  }

  if(type == "Term 2"){
    var increment = Math.abs(1/glob.o2);
    for(var i = glob.tmin*1000; i < glob.tmax*1000; i += increment){
      data.push([i,glob.a2*Math.cos(glob.o2*i/1000+glob.d2*Math.PI/180)]);
    }
    var coef = glob.o2 == 1 ? "" : glob.o2;
    obj.label = ampString(glob.a2)+"cos("+coef+"t"+degString(glob.d2);
    obj.color = "#AFD8F8";
  }

  if(type == "Product"){
    var increment = Math.abs(2/(glob.o1+glob.o2));
    for(var i = glob.tmin*1000; i < glob.tmax*1000; i += increment){
      data.push([i,(glob.a1*Math.cos(glob.o1*i/1000+glob.d1*Math.PI/180))*(glob.a2*Math.cos(glob.o2*i/1000+glob.d2*Math.PI/180))]);
    }
    var coef1 = glob.o1 == 1 ? "" : glob.o1;
    var coef2 = glob.o2 == 1 ? "" : glob.o2;
    obj.label = ampString(glob.a1)+"cos("+coef1+"t"+degString(glob.d1)+' * '+ampString(glob.a2)+"cos("+coef2+"t"+degString(glob.d2);
    obj.color = "darkred";
  }

  obj.data = data;
  return obj;
}

function generateCoef(a1,a2,p1,p2){
  return Math.sqrt(Math.pow((a1*Math.cos(p1*Math.PI/180)+a2*Math.cos(p2*Math.PI/180)),2)+Math.pow((a1*Math.sin(p1*Math.PI/180)+a2*Math.sin(p2*Math.PI/180)),2));
}

function generateAngle(p1,p2){
  if(p1 >= 0){
    return Math.atan(-p2/p1)*180/Math.PI;
  }else{
    p1 += 180;
    p1 = fixDeg(p1);
    return Math.atan(-p2/p1)*180/Math.PI;
  }
}
