$(document).ready(function(){
  $('#currMapSwitcher').on('change', function(e){
    $('#maps div[id ^= "map"]').hide();
    $('[id ^= "'+this.value+'"]').show();
  });
  addListeners();
});

function addListeners(elem){
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
    // TODO: this is a bit buggy, it should have a cleaner implementation. Select and deselect active items
    clearFilter();
  });
  $('.search').on("keyup",function(e){
    filterList(e);
  });
  $('li').on('click', {event}, highlightRelated);
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
    var item    = $(e.target).closest("li"),
        year    = item.data("year"),
        cohort  = item.data("class"),
        courses = item.data("course"),
        weeks   = item.data("week"),
        events  = item.data("event"),
        tag     = item.data("tag");
    vex.dialog.open({
        message: 'Set the linkages for this item here:',
        input: [
            '<label>Year</label> <input name="year" type="text" placeholder="Year"/>',
            '<div>Current Year is: '+year+'</div>',
            '<label>Cohort</label> <input name="cohort" type="text" placeholder="cohort" />',
            '<div>Current Cohort is: '+cohort,
            '<label>Courses</label> <input name="courses" type="text" placeholder="Courses"  />',
            '<div>Current Courses are: '+courses+'</div>',
            '<label>Weeks</label> <input name="weeks" type="text" placeholder="Weeks"  />',
            '<div>Current Weeks are: '+weeks+'</div>',
            '<label>Learning Events</label> <input name="events" type="text" placeholder="Event"  />',
            '<div>Current Events are: '+events+'</div>',
            '<label>Tags</label> <input name="tags" type="text" placeholder="Add a tag"  />',
            '<div>Current Tags are: '+tag+'</div>'
        ].join(''),
        buttons: [
            $.extend({}, vex.dialog.buttons.YES, { text: 'Done' }),
            $.extend({}, vex.dialog.buttons.NO, { text: 'Exit' })
        ],
        callback: function (data) {
            if (!data) {
                console.log('Cancelled')
            } else {
              //user has opted to keep changes
              // store values in an object
              var values = {
                year    : data.year,
                cohort  : data.cohort,
                courses : data.courses,
                weeks   : data.weeks,
                events  : data.events,
                tag     : data.tag };
                // loop through stored values and update the item
                for (var key in values) {
                  if (values.hasOwnProperty(key)){
                    if (values[key] != undefined){
                      //set the data and the attribute so other filtering functions work, update reference in memory and the dom
                      $.data(item,key,values[key]);
                      $(item).attr('data-'+key,values[key]);
                    }
                  }
                }
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
  console.log("add active",target);
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
    hideElem($('li:not([class*="active"])'));
}
function applyFilter(target,cohort) {
  var string = "(^|,)"+cohort+"(,|$)";
  var re = new RegExp(string,'g');
  $('*[data-'+target+']').addClass("filtered-out");
  // $('ul.year').find('li[data-year~="1"]').removeClass("filtered-out");
  $('*[data-'+target+']').closest("ul").find('li[data-'+target+'~="'+cohort+'"]').removeClass("filtered-out");
  // $('ul.year').find('li[data-'+target+'~="'+cohort+'"]').css('display','list-item');
  // $('*[data-year]').find('li[data-year~="1"]').show();//removeClass("filtered-out");
  // $('ul.year').find('li[data-year~="1"]').removeClass("filtered-out");
  // $('*[data-'+target+']').find('li[data-'+target+'~="'+cohort+'"]').addClass("fuck");
}
// Hide all non active elements and show the active ones
// takes a jquery object
function hideElem(elem) {
  elem.css('display','none');
  $(".active").css('display','list-item');
}

function clearFilter(){
  console.log("clearFilter()");
  // $('.active').removeClass("active");
  // $('li').not('.filtered-out').css('display','list-item');
}
function filterList(e){
  // get the search box text and filter it's related list, set in in the data-type attribute of the search box
  var list = $(e.target).data("type");
  var value = $(e.currentTarget).val().toLowerCase();
  $("."+list+" li").each(function(){
    dis = $(this);
    if (dis.text().toLowerCase().search(value) > -1){
      dis.removeClass("filtered-out");
    } else {
      dis.addClass("filtered-out");
    }
  });
}
// Regex from stackoverflow answer:
// http://stackoverflow.com/questions/7344361/how-to-select-elements-with-jquery-that-have-a-certain-value-in-a-data-attribute
