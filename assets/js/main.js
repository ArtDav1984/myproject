var database = '';
var dbName = '';
var newDbName = '';
var tableName = '';
var article = $(".article");

$("#create-db").click(function () {
	article.hide();
	$("#new-db").show();
	$("#db-name").val('');
});

$("#content").on('click', '#db-submit',function (event) {
    event.preventDefault();
    var charName = $(".charset").val();
	var loadContent = $(".load-content");
	dbName = $("#db-name").val();

    if (dbName !== '') {
        loadContent.show();
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
                setTimeout(load, 300);
                function load() {
                    loadContent.hide();
                    article.hide();
                    $("#new-table").show();

                    var newDbLine = '<div class="vertical-line">' +
                        `<li class="database-list" aria-expanded="false" data-base="${response.data}">` +
                        '<image class="load-aside" src="assets/img/load.gif" />' +
                        '<i class="fas fa-plus-square db-name"></i><i class="fas fa-minus-square db-name"></i>' +
                        `<span class="horizontal-line">-</span><i class="fas fa-database"></i>` +
                        `<span class="db-name database">&nbsp;${response.data}</span>` +
                        '<div class="hide-line"> <ul class="tables-list"> </ul> </div> </li> </div>';
                    $(".databases").append(newDbLine);
                }
            }
        }).fail(error => {
            console.log(error);
        })
    }
});

$(".databases").on('click', '.database', function () {
    var parent = $(this).parent("li");
        dbName = parent.attr("data-base");
        database = $(this);
        article.hide();
        $("#new-table").show();
        $("#update-db").show();
        $("#del-db").show();
});

$("#content").on('click','#update-db-submit',function (event){
    event.preventDefault();
    newDbName = $("#dbName").val();

    if (newDbName !== '') {
        $("#update-db-modal").show();
        $("#update-db-modal > #modal-body > p").html(`CREATE DATABASE ${newDbName} / DROP DATABASE ${dbName}`);
        var button = $(".confirm-db");
        $(button).attr("id", "confirm-db-update");
    }
});

$("#update-db-modal").on('click', '#confirm-db-update', function (event) {
    event.preventDefault();
    var loadContent = $(".load-content");
    loadContent.show();

    $.ajax({
        url: 'databases/update',
        type: 'POST',
        async: true,
        dataType: "JSON",
        data: {
            newDbName: newDbName,
            dbName: dbName
        }
    }).done(response => {
        if (response.type === 'success') {
            $("#update-db-modal").hide();
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                database.html(` ${response.data}`);
                var li = database.parent('li');
                li.removeAttr("data-base");
                li.attr("data-base", response.data);
                article.hide();
                $("#new-table").show();
            }
        }
    }).fail(error => {
        console.log(error)
    })
});

$("#content").on('click','#delete-db-submit',function (event){
    event.preventDefault();

    $("#update-db-modal").show();
    $("#update-db-modal > #modal-body > p").html(`You are about to DESTROY a complete database! Do you really want to execute "DROP DATABASE ${dbName}"?`);
    var button = $(".confirm-db");
    $(button).attr("id", "confirm-db-delete");
});

$("#update-db-modal").on('click', '#confirm-db-delete', function (event) {
    event.preventDefault();
    var loadContent = $(".load-content");
    loadContent.show();

    $.ajax({
        url: 'databases/delete',
        type: 'POST',
        async: true,
        dataType: "JSON",
        data: {
            dbName: dbName
        }
    }).done(response => {
        if (response.type === 'success') {
            $("#update-db-modal").hide();
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                var parent = database.parent('li').parent('div');
                $(parent).remove();
                article.hide();
                $("#new-db").show();
				$("#db-name").val('');
            }
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
    var loadAside = parent.find('.load-aside');

    ul.slideToggle();
    plus.toggle();
    minus.toggle();

    if (expended === 'false') {
        loadAside.show();
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
                setTimeout(load, 300);
                function load() {
                    loadAside.hide();
                    var newTable       = document.createElement("LI");
                    var newIcon        = '<i class="far fa-list-alt"></i>';
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
    dbName = parent.attr("data-base");
    var loadContent = $(".load-content");
    loadContent.show();

    $.ajax({
        url     : 'tables/column',
        type    : 'GET',
        async   : true,
        dataType: "JSON",
        headers    : {
            table: tableName,
            dbName: dbName
        }
    }).done(response => {
        if (response.type === 'success') {
            setTimeout(load, 300);
            function load() {
                loadContent.hide();
                var table = document.createElement('TABLE');
                var tr    = document.createElement('TR');
                table.append(tr);
                $(window).scrollTop(0);
                response.data.forEach(function (column) {
                    var th       = document.createElement('TH');
                    th.innerHTML = column;
                    tr.append(th)
                });
                var tableColumn = $("#table-columns");
				article.hide();
				$(tableColumn).html(table);
				$(tableColumn).show();
            }
        }
    }).fail(error => {
        console.log(error);
    })
});

$(".tables-list").on('click', '.new-table', function () {
    var parent = $(this).parent('ul').parent('div').parent('li');
    dbName = parent.attr("data-base");
    article.hide();
    $("#new-table").show();
});

$("#content").on('click','#table-submit',function (event) {
    event.preventDefault();
    tableName = $("#tableName").val();
    var numberColumn = $("#numberColumn").val();

    if (tableName !== '' && numberColumn !== '') {
    	$("#update-name").attr("value", tableName);
    	article.hide();
    	$("#table").show();
    }
});

function setAttributes(el, attrs) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}
