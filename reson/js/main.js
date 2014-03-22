$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.scale').click(function(){
    $(this).toggleClass('success');
    $('.gmax').parents('.columns').toggleClass('invisible');
  });

  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var v0 = nanDefault(parseFloat($('.volt').val()),1);
  var res = nanDefault(parseFloat($('.res').val()),50);
  var ind = nanDefault(parseFloat($('.ind').val()),50)/1000;
  var cap = nanDefault(parseFloat($('.cap').val()),50)/1000000;
  var gmax = nanDefault(parseFloat($('.gmax').val()),0.05);
  var max_amp = (v0*1.0/res);
  var res_freq = (1/Math.sqrt(ind*cap));
  //
  // Only scale if they've turned on autoscale
  var scale = !$('.scale').hasClass('success');
  var base = [];


  for(var i = 0; i < 100000; i += 1){
    base.push([i/10,(v0)/(Math.sqrt(Math.pow(res,2)+Math.pow((i/10)*ind-1/((i/10)*cap),2)))]);
  }

  var options = {
    series: {
      lines: {
        show: true
      },
    },
    xaxes: [{
      axisLabel: 'ω, (rad/s)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'I(t)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'},
      min: 0
    }],
    grid: {labelMargin: 10}
      };

  if(scale){
    options.yaxes[0].max = gmax;
  }

  var max_res = [[res_freq,0],[res_freq,max_amp]];

  var plot = $.plot('.plot',[
      {data: max_res, color: 'black', shadowSize: 0},
      {data: base},
      ], options);
  $('.note').text('Maximum amplitude of current is '+max_amp.toFixed(3)+' A at ω = '+res_freq.toFixed(2)+' rad/s.');
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}
