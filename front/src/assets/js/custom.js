$(document).on('change','#CurrentResource',function(){

  $('#CurrentResource option:selected').val()
  var value = $('#CurrentResource option:selected').val()
  console.log(value);
  $('#CurrentResource option')
    .removeAttr('selected')
    .filter('[value='+value+']')
    .attr('selected', true);
  $('#resourceId').val(value);
  $('input[name=resourceId]').val(value);
});
