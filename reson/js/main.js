$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var v0 = nanDefault(parseFloat($('.volt').val()),1);
  var res = nanDefault(parseFloat($('.res').val()),50);
  var ind = nanDefault(parseFloat($('.ind').val()),50);
  var cap = nanDefault(parseFloat($('.cap').val()),50);
  var base = [];


  var grid = {labelMargin: 10};

  for(var i = 0; i < 100000; i += 1){
    base.push([i/10,(v0)/(Math.sqrt(Math.pow(res,2)+Math.pow((i/10)*(ind/1000)-1/((i/10)*cap/1000000),2)))]);
  }

  var baseline = [[0,0],[10000,0]];
  var plot = $.plot('.plot',[
      {data: baseline, color: 'black', shadowSize: 0},
      {data: base},
      ], {
    series: {
      lines: {
        show: true
      },
    },
    xaxes: [{
      axisLabel: 'omega, (rad/s)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'I(t)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    grid: grid
      });
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}
