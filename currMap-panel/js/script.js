// flags
var filterApplied = false;

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
  //search menues
  $('.search').on("keyup",function(e){
    filterList(e);
  });
  //text filter
  $('li .glyphicon-filter').on('click', {event}, highlightRelated);
  //item controls
  $('.btn-cal').on('click',function(e){
    e.stopPropagation();
   vex.dialog.alert("This will allow you to filter the events based on date.")
  });
  $('.btn-plus').on('click',function(e){
    e.stopPropagation();
    vex.dialog.prompt({
      message: "This will allow you to add a new item to the list below. I'm not sure what we need to capture in here beside title.",
      placeholder: 'Course Title',
      callback: function (value) {
        console.log(value);
      }
    });
  });
  //item settings
  $('.glyphicon-wrench').on('click',{event}, itemSettings);
  //item click
  $(".content li").on('click',{event},itemClick);
}

//get the item and build the info panel in the header
function itemClick(e) {
  e.preventDefault();
  var t = $(e.target).closest("li");
  var type = getType(t);
  // show item as selected, max 2 items can be selected at a time
  if ($(e.currentTarget).hasClass("selected")){
    $(e.currentTarget).removeClass("selected primary secondary");
    updateClasses();
    updateInfoPanel();
    return;
  } else if ($("."+type+ " li").hasClass("selected")){
    console.log(type);
    updateClasses();
    $(".secondary").removeClass("secondary").addClass("primary");
  }
  if ($(".selected").length>1){
    vex.dialog.alert("Only two items can be selected. Please unselect an item. note- this should have a button to deselect one of the items");
  } else if ($(".selected").length>0) {
    t.addClass("selected secondary");
    updateInfoPanel();
  } else {
    t.addClass("selected");
    var item = $(".selected")[0];
    $(item).addClass("primary");
    updateInfoPanel();
  }
}
function updateClasses() {
  $(".secondary").removeClass("secondary").addClass("primary");
}
function updateInfoPanel() {
  //get data based on class elements
  var primaryData = $('.primary').data(),
      secondaryData = $('.secondary').data();
  //format data for presentation
  var primaryContent = getContent(primaryData);
  secondaryContent = getContent(secondaryData);

  //add data to the DOM
  $('#item1').html(primaryContent);
  $('#item2').html(secondaryContent);
  //reveal the panel
  showPanel();
}

function getContent(t) {
  if (t != undefined){
    return t =
      '<div class="info-panel-item"><label>Year is: &nbsp;</label><span class="info-panel-item-atom">'+t.year+'</span></div>'+
      '<div class="info-panel-item"><label>Cohort is:&nbsp; </label><span class="info-panel-item-atom">'+t.class+'</span></div>'+
      '<div class="info-panel-item"><label>Courses are:&nbsp; </label><span class="info-panel-item-atom">'+t.course+'</span></div>'+
      '<div class="info-panel-item"><label>weeks are:&nbsp; </label><span class="info-panel-item-atom">'+t.week+'</span></div>'+
      '<div class="info-panel-item"><label>Learning Events are:&nbsp; </label><span class="info-panel-item-atom">'+t.event;'</span></div>';
  } else {
    return t = '<div class="info-panel-item">Please Make a selection</div>';
  }
}
function showPanel(){
  if ($(".selected").length>0){
    console.log("updateInfoPanel()");
    $(".info-container").removeClass("hidden");
    return;
  } else {
    $(".info-container").addClass("hidden");
  }
}
function itemSettings(e){
  e.stopPropagation();
  var item    = $(e.target).closest("li"),
      year    = item.attr("data-year"),
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
                    console.log("get",item.data());
                    //set the data and the attribute so other filtering functions work, update reference in memory and the dom
                    $(item).attr('data-'+key,values[key]);
                    $(item).data(key,values[key]);
                  }
                }
              }
          }
      }
  })
};
/*on course, week or learning event click match all items and add a active class*/
function highlightRelated(e){
  console.log("highlightRelated()");
  //toggle the filter flag
  filterApplied = !filterApplied;
  var t = $(e.target).closest("li");
  var type = getType(t);
  var data = $(t).data();

  $(".active, .cancel").removeClass("active cancel");
  /*filtered-out class is used to hide elements from the text, year and layout filter*/
  $('li').not('.filtered-out').css('display','list-item');
  if (filterApplied) {
    // use type and check all data attributes for the type, then add active if the params match
    var selected = $(t).data(type);
    addActive(type,selected);
  }
}
/*get the parent type, needs an li*/
function getType(target){
  return $(target).parent().data("type");
}

function filterCohort(target, cohort) {
  switch (cohort) {
    case "all":
    $('*[data-'+target+']').removeClass("filtered-out");
      return
    case "add":
      return
    default:
      applyFilter(target, cohort);
  }

}
function addActive(target,cohort) {
  console.log("addActive()");
  $('*[data-'+target+']').closest("ul").find('li[data-'+target+'~="'+cohort+'"]').addClass("active");
  $(".active .glyphicon-filter").addClass('cancel');
  $('li:not([class*="active"])').hide();
}
function applyFilter(target,cohort) {
  $('*[data-'+target+']').addClass("filtered-out");
  $('*[data-'+target+']').closest("ul").find('li[data-'+target+'~="'+cohort+'"]').removeClass("filtered-out");
}
// Hide all non active elements and show the active ones
// takes a jquery object
function hideElem(elem) {
  elem.css('display','none');
  $(".active").css('display','list-item');
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
