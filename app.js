var itemTemplate = $('#templates .item');
var list = $('#list');
// the above variables are jquery objects but they are tied to DOM elements
var addItemToPage = function (itemData) {
    var item = itemTemplate.clone();
    item.attr('data-id', itemData.id);
    item.find('.description').text(itemData.description)
    if (itemData.completed) {
        item.addClass('completed');
    }
    list.append(item);
}
var loadRequest = $.ajax({
    type: 'GET',
    url: "https://listalous.herokuapp.com/lists/PattisList/"
});
// loadRequest.done(function(dataFromServer) {
//   var itemsData = dataFromServer.items

//   itemsData.forEach(function(itemData) {
//     addItemToPage(itemData)
//   })
// });
// This does the same as above
loadRequest.done(GetListSuccess);

function GetListSuccess(dataFromServer) {
    var itemsData = dataFromServer.items

    itemsData.forEach(function (itemData) {
        addItemToPage(itemData)
    });
}
// Listener for submit 
$('#add-form').on('submit', newItemSubmit);

// Function that is the listener for the submit 
function newItemSubmit(event) {
    // Event is a jquery object. Target is one of its attributes
    //debugger; // This starts debugger (more or less a breakpoint)
    var itemDescription = event.target.itemDescription.value;
    event.preventDefault();
    //alert('trying to create a new item with a description ' + itemDescription);
    var saveNewItem = $.ajax({
        type: 'POST',
        url: "http://listalous.herokuapp.com/lists/PattisList/items",
        data: {
            description: itemDescription,
            completed: false
        }
    });

    saveNewItem.done(function (itemDataFromServer) {
        //console.log($('#create'));
        addItemToPage(itemDataFromServer);
        // Clears the input on the form
        $('#create').val('').blur();
    });
}

// Clicking on the check mark
$('#list').on('click', '.complete-button', itemCompleted);

function itemCompleted(event) {
    var item = $(event.target).parent();
    var isItemCompleted = item.hasClass('completed');
    var itemId = item.attr('data-id');
    //alert('clicked item ' + itemId + ', which has completed currently set to ' + isItemCompleted);
    var updateRequest = $.ajax({
        type: 'PUT',
        url: "https://listalous.herokuapp.com/lists/PattisList/items/" + itemId,
        data: {
            completed: !isItemCompleted
        }
    });
    updateRequest.done(function (itemData) {
        if (itemData.completed) {
            item.addClass('completed')
        } else {
            item.removeClass('completed')
        }
    })
}