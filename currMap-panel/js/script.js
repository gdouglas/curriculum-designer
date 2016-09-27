var text="";
var textSlug = "";
var level="";
var num = 0;
var item;


function updateItem(){
   return '<div id="'+textSlug+'" class="item '+level+'"+ data-level="'+level+'">'+
'  <div>'+
'    <div class="controls">'+
'        <button class="btn btn-default btn-minus" data-level="program"'+
'        type="button"><span class='+
'        "glyphicon glyphicon-minus"></span></button>'+
'        <button class='+
'        "btn btn-default btn-number btn-plus" data-level="program"'+
'        type="button"><span class="glyphicon glyphicon-plus"></span></button>'+
'        <button class="btn btn-default btn-number btn-collapse"'+
'        type="button"><span class="glyphicon glyphicon-sort"></span></button>'+
'    </div>'+
    '<p contenteditable="true">'+text+'<a href="#" target="_blank"><span class="glyphicon glyphicon-new-window"></span></a></p>'+
'  </div>'+
'</div>';
}






var p = "program";
$(document).ready(function(){
  // listenForCourseClick(elem);
  listenForCourseClicks(p);
  $('#currMapSwitcher').on('change', function(e){
    $('#maps div[id ^= "map"]').hide();
    $('[id ^= "'+this.value+'"]').show();
    console.log(this.value);
  });
});


function createChild(e){
  var sourceID = $(e.target).closest('.item').attr("id");
  var sourceElem = $(e.target).closest('.item');
  level = sourceElem.data("level");
  var container = "";
  switch (level) {
    case "program":
      text= prompt("Please enter the year", "Year ");
      level ="year";
      break;
    case "year":
      text= prompt("Please enter the Course Name", "Med 410 ");
      level="course";
      break;
    case "course":
      text= prompt("What is the week","1");
      level="week";
      break;
    case "week":
      text= prompt("What is the name of the event", "Lecture");
      level="event";
      break;
    case "event":
      alert("Events cannot contain items");
      return;
    default:
      alert("Error: Cannot create item");
      return;
  }
  textSlug = createSlug(text);
  item = updateItem();
  sourceElem.append(item);
  listenForCourseClicks(textSlug);

}

function listenForCourseClicks(elem){

  $('#'+elem+" .btn-plus").on("click", function(e){
    createChild(e);
  });
  $('#'+elem+" .btn-minus").on("click", function(e){
    var sourceElem = $(e.target).closest('.item');
    sourceElem.remove();
  });
  $('#'+elem+" .btn-collapse").on("click", function(e){
    var elems = $(e.target).closest('.item').children('.item');
    elems.toggle();
  });

  //select menu
  $('#cohort-chooser').on('change',function(e){
    var cohort = $(this).val();
    filterCohort("class",cohort)
  });
  $('#curriculum-layout-select').on('change',function(e){
    var cohort = $(this).val();
    console.log(cohort);
    filterCohort("year",cohort)
  });
}

function removeItem(e){
  e.removeChild();
}

function createSlug(k){
  //strip out whitespace and add time to create a unique id
  var d = new Date();
  var n = d.getTime();
  return k.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')+n;            // Trim - from end of text
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

function applyFilter(target,cohort) {
  console.log(target);
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
    .show();
}


// Regex from stackoverflow answer:
// http://stackoverflow.com/questions/7344361/how-to-select-elements-with-jquery-that-have-a-certain-value-in-a-data-attribute
