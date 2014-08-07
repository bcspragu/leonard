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
  var c1 = nanWithOff($('.c1').val(),50)/1000000;
  var r2 = nanDefault(parseFloat($('.r2').val()),50);
  var l2 = nanDefault(parseFloat($('.l2').val()),50)/1000;
  var c2 = nanWithOff($('.c2').val(),50)/1000000;

  var base = [];

  for(var i = 0; i < 5000; i += 1){
    base.push([i,Math.sqrt((Math.pow(r2,2)+Math.pow(l2*i-1/(c2*i),2))/(Math.pow(r1+r2,2)+Math.pow((l1+l2)*i-(1/c1+1/c2)/i,2)))]);
  }

  var options = {
    xaxes: [{
      axisLabel: 'Angular Frequency ω (rad/s)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'Amplitude of H(jω)',
      axisLabelPadding: 10,
      axisLabelUseCanvas: true,
      font: {size: 15, color: 'black'}
    }],
    grid: {labelMargin: 10}
      };

  if($('.log-log').hasClass('success')){
    options.yaxes[0].transform = function(v) {return Math.log(v+0.0001); /*move away from zero*/};
    options.yaxes[0].tickDecimals = 3;
    options.xaxes[0].transform = function(v) {return Math.log(v+0.0001); /*move away from zero*/};
    options.xaxes[0].tickDecimals = 3;
    options.yaxes[0].ticks = 3;
    options.xaxes[0].ticks = 3;
  }else{
    options.yaxes[0].min = 0;
    options.yaxes[0].max = 0;
  }

  var plot = $.plot('.plot',[
      {data: base}
      ], options);
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}

function nanWithOff(value,def){
  if(value.trim().toLowerCase() == 'off'){;
    return 9*Math.pow(10,99);
  }
  value = parseFloat(value);
  return isNaN(value) ? def : value;
}
