$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });
});


function updateGraph(){
  var omega = parseInt($('.omega').val()) || 50;
  var tmin = parseFloat($('.tmin').val()) || -0.2;
  var tmax = parseFloat($('.tmax').val()) || 0.3;
  var deg = parseInt($('.deg').val()) || 90;
  var base = [];
  var shifted = [];
  var base_label = "cos("+omega+"x)";
  var shifted_label = "cos("+omega+"x+"+deg+")";
  for(var i = tmin*1000; i < tmax*1000; i += 1){
    base.push([i,Math.cos(omega*i/1000)]);
    shifted.push([i,Math.cos(omega*i/1000+deg*Math.PI/180)]);
  }
  var plot = $.plot('.plot',[
      {data: base, label: base_label},
      {data: shifted, label: shifted_label}
      ], {
    series: {
      lines: {
        show: true
      },
    },
    xaxes: [{
      axisLabel: 'Time (ms)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true
    }],
    yaxes: [{
      axisLabel: 'f(t)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true
    }]
  });
}
