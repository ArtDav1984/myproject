$("#create-db").click(function () {
    $.ajax({
        url     : 'databases/chars',
        type    : 'GET',
        async   : true,
        headers : {
            getCharsList: true
        },
        dataType: "JSON",
    }).done(response => {
        if (response.type === 'success'){
            var newDb = '<div id="new-db">' +
                '<form method="post">' +
                '<label for="db-name">' +
                '<i class="fas fa-database"></i> Create Database </label> <br /><br />' +
                '<input type="text" name="name" id="db-name" placeholder="Database name" required/>' +
                '<select id="charsets" name="charsets" aria-expanded="false"></select>' +
                '<button type="submit" id="db-submit">Create</button> </form> </div>';
            $("#content").html(newDb);
            response.data.forEach(function (charset) {
                var option = document.createElement('OPTION');
                option.innerHTML = charset;
                setAttributes(option, {"class": "charset", "value": charset});
                $("#charsets").append(option);
            })
        }
    }).fail(error => {
        console.log(error)
    })
});

$("#content").on('click', '#db-submit',function (event) {
    event.preventDefault();
    var dbName = $("#db-name").val();
    var charName = $(".charset").val();

    if (dbName !== '') {
        $.ajax({
            url     : 'databases/create',
            type    : 'POST',
            async   : true,
            dataType: "JSON",
            data    : {
                name    : dbName,
                charsets: charName
            }
        }).done(response => {
            if (response.type === 'success') {
                var newTable = `<div id="new-table" data-base="${response.data}">` +
                    '<form method="post">' +
                    '<fieldset>' +
                    '<legend><i class="far fa-list-alt"></i> Create table</legend>' +
                    '<span>Name:</span> <input type="text" name="tableName" id="tableName"/>' +
                    '<span id="columns-title">Number of columns:</span> ' +
                    '<input type="number" name="numberColumn" id="numberColumn" value="4"/>' +
                    '<br /><br />' +
                    '<button type="submit" id="table-submit">Go</button>' +
                    '</fieldset>' +
                    '</form>' +
                    '</div>';
                $("#content").html(newTable);

                var newDbLine = '<div class="vertical-line">' +
                    `<li class="database-list" aria-expanded="false" data-base="${response.data}">` +
                    '<i class="fas fa-plus-square db-name"></i><i class="fas fa-minus-square db-name"></i>' +
                    `<span class="horizontal-line">-</span><i class="fas fa-database"></i>` +
                    `<span class="db-name database">&nbsp;${response.data}</span>` +
                    '<div class="hide-line"> <ul class="tables-list"> </ul> </div> </li> </div>';
                $(".databases").append(newDbLine);
            }
        }).fail(error => {
            console.log(error);
        })
    }
});

var database = '';
var currentDbName = '';
$(".databases").on('click', '.database', function () {
    var parent = $(this).parent("li");
        currentDbName = parent.attr("data-base");
        database = $(this);
    var dbSettings = document.createElement('DIV');

    var createTable = `<div id="new-table">` +
        '<form method="post">' +
        '<fieldset>' +
        '<legend><i class="far fa-list-alt"></i> Create table</legend>' +
        '<span>Name:</span> <input type="text" name="tableName" id="tableName"/>' +
        '<span id="columns-title">Number of columns:</span> <input type="number" name="numberColumn" id="numberColumn" value="4"/>' +
        '<br /><br />' +
        '<button type="submit" id="table-submit">Go</button>' +
        '</fieldset>' +
        '</form>' +
        '</div>';

    var updateDb = `<div id="update-db">` +
        '<form method="post">' +
        '<fieldset>' +
        '<legend><i class="fas fa-pencil-alt"></i> Rename database to</legend>' +
        '<input type="text" name="tableName" id="dbName"/>' +
        '<br /><br />' +
        '<button type="submit" id="update-db-submit">Go</button>' +
        '</fieldset>' +
        '</form>' +
        '</div>';

    var deleteDb = `<div id="del-db">` +
        '<form method="post">' +
        '<fieldset>' +
        '<legend><i class="far fa-calendar-times"></i> Remove database</legend>' +
        '<button id="delete-db-submit">Drop the database (DROP)</button>' +
        '</fieldset>' +
        '</form>' +
        '</div>';

    dbSettings.innerHTML = createTable + updateDb + deleteDb;
    $("#content").html(dbSettings);
});

var newDbName = '';
$("#content").on('click','#update-db-submit',function (event){
    event.preventDefault();
    newDbName = $("#dbName").val();

    if (newDbName !== '') {
        $("#update-db-modal").show();
        $("#update-db-modal > #modal-body > p").html(`CREATE DATABASE ${newDbName} / DROP DATABASE ${currentDbName}`);
        var button = $(".confirm-db");
        $(button).attr("id", "confirm-db-update");
    }
});

$("#update-db-modal").on('click', '#confirm-db-update', function (event) {
    event.preventDefault();

    $.ajax({
        url: 'databases/update',
        type: 'POST',
        async: true,
        dataType: "JSON",
        data: {
            newDbName: newDbName,
            currentDbName: currentDbName
        }
    }).done(response => {
        if (response.type === 'success') {
            database.html(` ${response.data}`);
            var li = database.parent('li');
            li.removeAttr("data-base");
            li.attr("data-base", response.data);
            $("#update-db-modal").hide();
            var createTable = `<div id="new-table" data-base="${response.data}">` +
                '<form method="post">' +
                '<fieldset>' +
                '<legend><i class="far fa-list-alt"></i> Create table</legend>' +
                '<span>Name:</span> <input type="text" name="tableName" id="tableName"/>' +
                '<span id="columns-title">Number of columns:</span> <input type="number" name="numberColumn" id="numberColumn" value="4"/>' +
                '<br /><br />' +
                '<button type="submit" id="table-submit">Go</button>' +
                '</fieldset>' +
                '</form>' +
                '</div>';
            $("#content").html(createTable);
        }
    }).fail(error => {
        console.log(error)
    })
});

$("#content").on('click','#delete-db-submit',function (event){
    event.preventDefault();

    $("#update-db-modal").show();
    $("#update-db-modal > #modal-body > p").html(`You are about to DESTROY a complete database! Do you really want to execute "DROP DATABASE ${currentDbName}"?`);
    var button = $(".confirm-db");
    $(button).attr("id", "confirm-db-delete");
});

$("#update-db-modal").on('click', '#confirm-db-delete', function (event) {
    event.preventDefault();

    $.ajax({
        url: 'databases/delete',
        type: 'POST',
        async: true,
        dataType: "JSON",
        data: {
            dbName: currentDbName
        }
    }).done(response => {
        if (response.type === 'success') {
            var parent = database.parent('li').parent('div');
            $(parent).remove();
            $("#update-db-modal").hide();
            var newDb = '<div id="new-db">' +
                '<form method="post">' +
                '<label for="db-name">' +
                '<i class="fas fa-database"></i> Create Database </label> <br /><br />' +
                '<input type="text" name="name" id="db-name" placeholder="Database name" required/>' +
                '<select id="charsets" name="charsets" aria-expanded="false"></select>' +
                '<button type="submit" id="db-submit">Create</button> </form> </div>';
            $("#content").html(newDb);
        }
    }).fail(error => {
        console.log(error)
    })
});

$(".cancel-db-update").click(function () {
    $("#update-db-modal").hide()
});

$(".databases").on('click', '.db-name', function () {
    var parent = $(this).parent('li');
    var plus = parent.find('.fa-plus-square');
    var minus = parent.find('.fa-minus-square');
    var ul = parent.find('.tables-list');
    var expended = parent.attr('aria-expanded');
    var databaseName = parent.attr("data-base");

    ul.slideToggle();
    plus.toggle();
    minus.toggle();

    if (expended === 'false') {
        $.ajax({
            url     : 'tables',
            type    : 'GET',
            async   : true,
            dataType: "JSON",
            headers    : {
                dbName: databaseName
            }
        }).done(response => {
            if (response.type === 'success') {
                var newTable = document.createElement("LI");
                var newIcon  = '<i class="far fa-list-alt"></i>';
                newTable.innerHTML = "‐‐‐" + newIcon + " " + "New";
                setAttributes(newTable, {"class": "new-table"});
                ul.append(newTable);
                response.data.forEach(function (table) {
                    var li   = document.createElement('LI');
                    var icon = '<i class="far fa-list-alt"></i>';
                    setAttributes(li, {"class": "table-name", "data-table": table, "aria-expanded": "false"});
                    li.innerHTML = "‐‐‐" + icon + " " + table;
                    ul.append(li);
                });
            }
        }).fail(error => {
            console.log(error);
        })
    }

    parent.attr('aria-expanded', 'true');
});

$(".tables-list").on('click', '.table-name', function () {
    var expended = $(this).attr('aria-expanded');
    var tableName = $(this).attr("data-table");
    var parent = $(this).parent('ul').parent('div').parent('li');
    var databaseName = parent.attr("data-base");

    $.ajax({
        url     : 'tables/column',
        type    : 'GET',
        async   : true,
        dataType: "JSON",
        headers    : {
            table: tableName,
            databaseName: databaseName
        }
    }).done(response => {
        if (response.type === 'success') {
            var table       = document.createElement('TABLE');
            var tr          = document.createElement('TR');
            table.append(tr);
            $("#content").html(table);
            $(window).scrollTop(0);
            response.data.forEach(function (column) {
                var th       = document.createElement('TH');
                th.innerHTML = column;
                tr.append(th)
            });
        }
    }).fail(error => {
        console.log(error);
    })
});

$(".tables-list").on('click', '.new-table', function () {
    var parent = $(this).parent('ul').parent('div').parent('li');
    var dbName = parent.attr("data-base");
    var newTable = `<div id="new-table" data-base="${dbName}">` +
        '<form method="post">' +
        '<fieldset>' +
        '<legend><i class="far fa-list-alt"></i> Create table</legend>' +
        '<span>Name:</span> <input type="text" name="tableName" id="tableName"/>' +
        '<span id="columns-title">Number of columns:</span> ' +
        '<input type="number" name="numberColumn" id="numberColumn" value="4"/>' +
        '<br /><br />' +
        '<button type="submit" id="table-submit">Go</button>' +
        '</fieldset>' +
        '</form>' +
        '</div>';
    $("#content").html(newTable);
});

$("#content").on('click','#table-submit',function (event) {
    event.preventDefault();
    var tableName = $("#tableName").val();
    var numberColumn = $("#numberColumn").val();

    if (tableName !== '' && numberColumn !== '') {
        var table = '<div id="table">' +
            '<form method="post">' +
            `Table name: <input type="text" id="update-name" value="${tableName}">` + " " + " " +
            'Add: <input type="number" id="update-number" value="1">' + " " + " " +
            '<button type="submit" id="add-submit">Submit</button>' +
            '<div class="line"></div>' +
            '<table class="table">' +
            '<tr> <th>Name</th> <th>Type</th> <th>Length</th> <th>Default</th> <th>Index</th> </tr>' +
            '</table>' +
            '</form></div>';
        $("#content").html(table);
    }
});

function setAttributes(el, attrs) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}