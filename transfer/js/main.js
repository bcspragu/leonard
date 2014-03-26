var plot, ymax,xmax;
$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });

  $('.log-log').click(function(){
    $(this).toggleClass('success');
  })
});


function updateGraph(){
  var r1 = nanDefault(parseFloat($('.r1').val()),50);
  var l1 = nanDefault(parseFloat($('.l1').val()),50)/1000;
  var c1 = nanDefault(parseFloat($('.c1').val()),50)/1000000;
  var r2 = nanDefault(parseFloat($('.r2').val()),50);
  var l2 = nanDefault(parseFloat($('.l2').val()),50)/1000;
  var c2 = nanDefault(parseFloat($('.c2').val()),50)/1000000;

  var base = [];

  for(var i = 0; i < 10000; i += 1){
    base.push([i,Math.sqrt(Math.pow(c1-c1*c2*l2*Math.pow(i,2),2)+Math.pow(c1*c2*r2*i,2))/Math.sqrt(Math.pow(c1+c2-c1*c2*l1*Math.pow(i,2)-c1*c2*l2*Math.pow(i,2),2)+Math.pow(c1*c2*r1*i+c1*c2*r2*i,2))]);
  }

  var options = {
    xaxes: [{
      axisLabel: 'f (Hz)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'Vout/Vin',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    grid: {labelMargin: 10}
      };

  if($('.log-log').hasClass('success')){
    options.yaxes[0].transform = function(v) {return Math.log(v+0.0001); /*move away from zero*/};
    options.yaxes[0].tickDecimals = 3;
  }

  var plot = $.plot('.plot',[
      {data: base}
      ], options);
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}
