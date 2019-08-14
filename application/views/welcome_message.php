<?php $this->load->helper('url'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
    <link rel="stylesheet" href="<?php echo base_url() ?>assets/css/main.css" type="text/css" media="screen" />
</head>
<body>

<section>

    <div id="aside">
        <h1><em><span>php</span>MyAdmin</em></h1>

        <ul class="databases">

            <div class="vertical-line">
                <li class="create-db"><span class="horizontal-line">--</span><i class="fas fa-database"></i>
                    <span id="create-db">New</span>
                </li>
            </div>
            
            <?php if (!is_null($databases)) : ?>
				
            <?php foreach ($databases as $database => $item) : ?>
                
                <div class="vertical-line">
                    <li class="database-list" aria-expanded="false" data-base="<?= $item['Database']; ?>">
                        <image class="load-aside" src="<?php echo base_url() ?>assets/img/load.gif" />
                        <i class="fas fa-plus-square db-name"></i><i class="fas fa-minus-square db-name"></i><span class="horizontal-line">-</span><i class="fas fa-database"></i>
                        <span class="db-name database"><?= $item['Database']; ?></span>
                        <div class="hide-line">
                            <ul class="tables-list" data-base="<?= $item['Database']; ?>"> </ul>
                        </div>
                    </li>
                </div>
                
            <?php endforeach; ?>
            
            <?php endif; ?>

        </ul>
    </div>

    <div id="content">
        <div id="new-db" class="article">
            <form method="post">
                <label for="db-name">
                    <i class="fas fa-database"></i> Create Database
                </label> <br /><br />
                <input type="text" name="name" id="db-name" placeholder="Database name" />
                <select id="charsets" name="charsets" aria-expanded="false">
					
					<?php if (!is_null($chars)) : ?>
						
						<?php foreach ($chars as $char) : ?>
                            <option value="<?= $char ?>" class="charset">
								<?= $char ?>
                            </option>
						<?php endforeach; ?>
					
					<?php endif; ?>

                </select>
                <button type="submit" id="db-submit">Create</button>
            </form>
        </div>

        <div id="new-table" class="article">
            <form method="post">
                <fieldset>
                    <legend><i class="far fa-list-alt"></i> Create table</legend>
                    <span>Name:</span> <input type="text" name="tableName" id="tableName"/>
                    <span id="columns-title">Number of columns:</span>
                    <input type="number" name="numberColumn" id="numberColumn" value="4"/>
                    <br /><br />
                    <button type="submit" id="table-submit">Go</button>
                </fieldset>
            </form>
        </div>

        <div id="update-db" class="article">
            <form method="post">
                <fieldset>
                    <legend><i class="fas fa-pencil-alt"></i> Rename database to</legend>
                    <input type="text" name="tableName" id="dbName"/>
                    <br /><br />
                    <button type="submit" id="update-db-submit">Go</button>
                </fieldset>
            </form>
        </div>

        <div id="del-db" class="article">
            <form method="post">
                <fieldset>
                    <legend><i class="far fa-calendar-times"></i> Remove database</legend>
                    <button id="delete-db-submit">Drop the database (DROP)</button>
                </fieldset>
            </form>
        </div>

        <div id="table-columns" class="article">
            <div id="table-title">
            
            </div>
            <div id="table-content">
            
            </div>

            <div id="update-table">
                <form method="post">
                    <fieldset>
                        <legend><i class="fas fa-pencil-alt"></i> Rename table to</legend>
                        <input type="text" name="tableName" id="tblName"/>
                        <br /><br />
                        <button type="submit" id="update-tbl-submit">Go</button>
                    </fieldset>
                </form>
            </div>

            <div id="del-table">
                <form method="post">
                    <fieldset>
                        <legend><i class="far fa-calendar-times"></i> Remove table</legend>
                        <button id="delete-tbl-submit">Delete the table (DROP)</button>
                    </fieldset>
                </form>
            </div>
        </div>
        
        <div id="table-structure" class="article">
            <div id="structure-title">
            
            </div>
            <table class="table-structure">
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Max-length</th>
                    <th>Default</th>
                    <th>Primary-key</th>
                </tr>
            </table>
        </div>

        <div id="table" class="article">
            <form method="post">
                Table name: <input type="text" id="update-name">
                Add: <input type="number" id="update-number" value="1">
                <button type="submit" id="add-submit">Go</button>
                <div class="line"></div>
                <table class="table">
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Length/Values</th>
                        <th>Default</th>
                        <th>Index</th>
                    </tr>
                </table>
                <div id="bot-line">
                    <button type="submit" id="save-table">Save</button>
                </div>
            </form>
        </div>
    </div>

    <div id="update-db-modal">
        <div id="modal-header">
            <h5>Confirm</h5>
            <button type="button" class="cancel-db-update close">&times;</button>
        </div>
        <div id="modal-body">
            <p>CREATE DATABASE myproject / DROP DATABASE project</p>
        </div>
        <div id="modal-footer">
            <form method="post" id="update-db-form">
                <button type="submit" class="confirm-db">OK</button>
                <button type="button"  class="cancel-db-update">Cancel</button>
            </form>
        </div>
    </div>

    <image class="load-content" src="<?php echo base_url() ?>assets/img/load_2.gif" />

</section>

<script src="<?php echo base_url() ?>assets/js/jquery.js"></script>
<script src="<?php echo base_url() ?>assets/js/main.js"></script>

</body>
</html>
