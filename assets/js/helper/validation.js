var validation = {
 run: function () {
  $('.data-error').remove();
  var required = $('.required');
  console.log('required',required);
  var empty = 0;
  var is_valid = 1;  
  
  $.each(required, function () {
   var value = $(this).val();      
   if (value == '') {
    empty += 1;
    $(this).after('<p style="color:red" class="data-error">* ' + $(this).attr('error') + ' Harus Diisi</p>');
   }
  });

  if (empty > 0) {
   is_valid = 0;
  }

  return is_valid;
 }
};