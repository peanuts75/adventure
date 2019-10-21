
var currentArea = 0

const clearInput = () => {document.getElementById("parsebox").value = ""}

const getArea = (num) => {
    var area = ""
    jQuery.ajax({
      url: "areas.json",
      success: function(html) {
        area = html},
      async:false})
    return area[num]}
  
const draw = (num) => {
    currentArea = num
    console.log("current area is now "+num)
    document.getElementById("titleName").innerText = getArea(num).title
    document.getElementById("subtitleName").innerText = getArea(num).subtitle
    document.getElementById("gametext").innerText = getArea(num).desc}

const myfunc = () => {
    var input = document.getElementById("parsebox").value.toLowerCase()

    if (getArea(currentArea).hasOwnProperty(input) && input != 'title' && input != 'subtitle' && input != 'desc'){
        draw(getArea(currentArea)[input])
    }
    else if (input == 'restart'){draw(0)}
    else if (input == 'info'){draw(3)}
    clearInput()
}

