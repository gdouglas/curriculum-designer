$(document).ready(function(){
  $('#currMapSwitcher').on('change', function(e){
    $('#maps div[id ^= "map"]').hide();
    $('[id ^= "'+this.value+'"]').show();
  });
  addListeners();
});

function addListeners(elem){
  //select menu
  $('.search').on("keyup",function(e){
    filterList(e);
  });
  $('#cohort-chooser').on('change',function(e){
    var cohort = $(this).val();
    filterCohort("class",cohort)
  });
  $('#curriculum-layout-select').on('change',function(e){
    var cohort = $(this).val();
    filterCohort("year",cohort)
  });
  $('body').on('click', function(e){
    clearFilter();
    console.log("click");
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
    console.log("click");
    var year    = $(e.target).closest("li").data("year"),
        cohort  = $(e.target).closest("li").data("class"),
        courses = $(e.target).closest("li").data("course"),
        weeks   = $(e.target).closest("li").data("week"),
        events  = $(e.target).closest("li").data("event"),
        tag     = $(e.target).closest("li").data("tag");
    vex.dialog.open({
        message: 'Set the linkages for this item here:',
        input: [
            '<label>Year</label> <input name="year" type="text" placeholder="Year" required />',
            '<div>Current Year is: '+year+'</div>',
            '<label>Cohort</label> <input name="cohort" type="text" placeholder="cohort" required />',
            '<div>Current Cohort is: '+cohort,
            '<label>Courses</label> <input name="courses" type="text" placeholder="Courses" required />',
            '<div>Current Courses are: '+courses+'</div>',
            '<label>Weeks</label> <input name="weeks" type="text" placeholder="Weeks" required />',
            '<div>Current Weeks are: '+weeks+'</div>',
            '<label>Learning Events</label> <input name="events" type="text" placeholder="Event" required />',
            '<div>Current Events are: '+events+'</div>',
            '<label>Tags</label> <input name="tags" type="text" placeholder="Add a tag" required />',
            '<div>Current Tags are: '+tag+'</div>'
        ].join(''),
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: 'Save' }),
            $.extend({}, vex.dialog.buttons.NO, { text: 'Cancel' })
        ],
        callback: function (data) {
            if (!data) {
                console.log('Cancelled')
            } else {
                year    = data.year,
                cohort  = data.cohort,
                courses += data.courses,
                weeks   += data.weeks,
                events  += data.events,
                tags    += data.tags;

                console.log(year,courses,weeks,events,tags);
            }
        }
    })


  });
}
/*on course, week or learning event click match all items and add a active class*/

function highlightRelated(e){
  e.stopPropagation();
  var t = e.target;
  var type = $(t).parent().data("type");
  var data = $(t).data();
  var arr = [];
  $(".active").removeClass("active");
  // console.log($(t).parent().data("type"),data);

  // use type and check all data attributes for the type, then add active if the params match
  var selected = $(t).data(type);
  addActive(type,selected);
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
  console.log(target);
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
    hideElem($('li:not([class*="active"])'));
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
// Hide all non active elements and show the active ones
// takes a jquery object
function hideElem(elem) {
  elem.css('min-height','0').slideUp();
  $(".active").css('min-height','60px').slideDown();
}

function clearFilter(){
  $('.active').removeClass("active");
  $('li').slideDown().css('min-height','60px');
}
function filterList(e){
  // get the search box text and filter it's related list, set in in the data-type attribute of the search box
  var list = $(e.target).data("type");
  var value = $(e.currentTarget).val().toLowerCase();
  $("."+list+" li").each(function(){
    dis = $(this);
    if (dis.text().toLowerCase().search(value) > -1){
      dis.show();
    } else {
      dis.hide();
    }
  });
}
// Regex from stackoverflow answer:
// http://stackoverflow.com/questions/7344361/how-to-select-elements-with-jquery-that-have-a-certain-value-in-a-data-attribute
