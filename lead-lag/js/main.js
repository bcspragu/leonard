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
  var tmax = parseInt($('.tmax').val()) || 0.3;
  var deg = parseInt($('.deg').val()) || 90;
  var base = [];
  var shifted = [];
  for(var i = tmin*100; i < tmax*100; i += 1){
    base.push([i,Math.sin(omega*i)]);
    shifted.push([i,Math.sin(omega*i+deg*Math.PI/180)]);
  }
  var plot = $.plot('.plot',[base,shifted], {
    series: {
      lines: {
        show: true
      }
    }
  });
}
