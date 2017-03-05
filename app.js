var itemTemplate = $('#templates .item');
var list = $('#list');
var apiUrl = "https://listalous.herokuapp.com/lists/";
var listName = 'PattisList';
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
function setFocusOnNewItem () {
    $('#create').focus();    
}

var loadRequest = $.ajax({
    type: 'GET',
    url: apiUrl + listName + "/"
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
     setFocusOnNewItem ();
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
        url: apiUrl + listName + "/items",
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
        setFocusOnNewItem ();
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
        url: apiUrl + listName + "/items/" + itemId,
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

// Clicking on the delete mark 
$('#list').on('click', '.delete-button', itemDelete);

function itemDelete(event) {
    var item = $(event.target).parent();
    var itemId = item.attr('data-id');
    //alert('clicked item ' + itemId + ', which has completed currently set to ' + isItemCompleted);
    var updateRequest = $.ajax({
        type: 'DELETE',
        url: apiUrl + listName + "/items/" + itemId,
        data: {
            id: itemId
        }
    });
    updateRequest.done(function (itemData) {
        //alert('Should remove ' + itemData.id);
        // Delete item from DOM here!
        var itemToDelete = $( '[data-id="' + itemData.id + '"]' );
        itemToDelete.remove();
    })
}