$(document).ready(function(){
  $('#currMapSwitcher').on('change', function(e){
    $('#maps div[id ^= "map"]').hide();
    $('[id ^= "'+this.value+'"]').show();
  });
  listenForCourseClicks();
});

function listenForCourseClicks(elem){
  //select menu
  $('#cohort-chooser').on('change',function(e){
    var cohort = $(this).val();
    filterCohort("class",cohort)
  });
  $('#curriculum-layout-select').on('change',function(e){
    var cohort = $(this).val();
    filterCohort("year",cohort)
  });
  $('body').on('click', function(e){
    console.log("click");
    $('.active').removeClass("active");
  });
  $('dd,dt,li').on('click', {event}, highlightRelated);
  $('.btn-cal').on('click',function(e){
    e.stopPropagation();
    alert("This will allow you to filter the events based on date.")
  });
  $('.btn-plus').on('click',function(e){
    e.stopPropagation();
    alert("This will allow you to add a new item to the list below. I'm not sure what we need to capture in here besige title.")
  });
  $('.glyphicon-wrench').on('click',function(e){
    e.stopPropagation();

    vex.dialog.open({
        message: 'Set the linkages for this item here:',
        input: [
            'Year <input name="username" type="text" placeholder="Year" required />',
            'Courses <input name="password" type="text" placeholder="Courses" required />',
            'Weeks <input name="password" type="text" placeholder="Weeks" required />',
            'Learning Events <input name="password" type="text" placeholder="Event" required />'
        ].join(''),
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: 'Save' }),
            $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
        ],
        callback: function (data) {
            if (!data) {
                console.log('Cancelled')
            } else {
                console.log('Username', data.username, 'Password', data.password)
            }
        }
    })


  });
}
/*on course, week or learning event click match all items and add a active class*/

function highlightRelated(e){
  e.stopPropagation();
  var t = e.target;
  var data = $(t).data();
  var arr = [];
  $(".active").removeClass("active");
  //loop through each property of the object and build an array from the contents, split on , the loop through each array as a selector and highlight everything
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key].length > 1) {
        arr = data[key].split(',');
      } else {
        arr.push( data[key] );
      }
      for (var i = 0; i < arr.length; i++) {
          addActive(key, arr[i]);
        // console.log('*[data-'+key+'="'+arr[i]+'"]');
        // $('*[data-'+key+'="'+arr[i]+'"]').addClass("active");
      }
    }
  }
}

function filterCohort(target, cohort) {
  switch (cohort) {
    case "all":
    $('*[data-'+target+']').show();
      return
    case "add":
      return
    default:
      applyFilter(target, cohort);
  }

}
function addActive(target,cohort) {
  var string = "(^|,)"+cohort+"(,|$)";
  var re = new RegExp(string,'g');
  $('*[data-'+target+']')
    .filter( function(){
      if ( $(this).attr('data-'+target+'').match(re) ){
        //show if there is a match
        return true;
      } else {
        //leave hiden if there is no match
        return false;
      }
    })
    .addClass("active");
}
function applyFilter(target,cohort) {
  var string = "(^|,)"+cohort+"(,|$)";
  var re = new RegExp(string,'g');
  $('*[data-'+target+']').hide();
  $('*[data-'+target+']')
    .filter( function(){
      if ( $(this).attr('data-'+target+'').match(re) ){
        //show if there is a match
        return true;
      } else {
        //leave hiden if there is no match
        return false;
      }
    })
    .show().addClass("active");
}


// Regex from stackoverflow answer:
// http://stackoverflow.com/questions/7344361/how-to-select-elements-with-jquery-that-have-a-certain-value-in-a-data-attribute
