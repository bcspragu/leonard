$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var time = nanDefault(parseFloat($('.time').val()),10);
  var n = nanDefault(parseFloat($('.n').val()),1);
  var wave = [];

  var grid = {labelMargin: 10};

  grid.borderWidth = {bottom: 2, left: 3, top:2, right: 2},
  grid.borderColor = {left: 'black'};

  for(var i = 0; i < time; i += 1/1000){
    wave.push([i,Math.cos(n*i*2*Math.PI/time)]);
  }

  var baseline = [[0,0],[time,0]];
  var plot = $.plot('.plot',[
      {data: baseline, color: 'black', shadowSize: 0},
      {data: wave},
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
    }],
    grid: grid
      });
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}
