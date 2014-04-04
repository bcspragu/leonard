$(function(){
  var graph = $('.plot');
  graph.height(graph.width()/2);
  updateGraph();

  $('.update-graph').click(function(){
    updateGraph();
  });

  $('.sincos').click(function(){
    var t = $(this);
    t.toggleClass('alert');
    t.text(t.hasClass('alert') ? 'Sin' : 'Cos');
  });
});


function updateGraph(){
  var time = nanDefault(parseFloat($('.time').val()),10);
  var note1 = "f(t) = ";
  var note2 = "t)";
  var sin = $('.sincos').hasClass('alert');
  var n = nanDefault(parseFloat($('.n').val()),1);
  var wave = [];

  var grid = {labelMargin: 10};

  grid.borderWidth = {bottom: 2, left: 3, top:2, right: 2},
  grid.borderColor = {left: 'black'};

  if(sin){
    for(var i = 0; i < time; i += 1/1000){
      wave.push([i,Math.sin(n*i*2*Math.PI/time)]);
    }
    note1 += 'sin';
  }else{
    for(var i = 0; i < time; i += 1/1000){
      wave.push([i,Math.cos(n*i*2*Math.PI/time)]);
    }
    note1 += 'cos';
  }
  note1 += '('+(n == 1 ? '' : n)+'ω';
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
      axisLabelPadding: 20,
      axisLabelUseCanvas: true,
      axisLabelFontSizePixels: 25,
      font: {size: 20, color: 'black'}
    }],
    yaxes: [{
      axisLabel: 'f(t)',
      axisLabelPadding: 20,
      axisLabelUseCanvas: true,
      axisLabelFontSizePixels: 25,
      font: {size: 20, color: 'black'},
    }],
    grid: grid
  });
  $('.t1').text(note1);
  $('.t2').text(note2);
}

function nanDefault(value,def){
  return isNaN(value) ? def : value
}
