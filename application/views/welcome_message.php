<?php $this->load->helper('url'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">
    <link rel="stylesheet" href="<?php echo base_url() ?>assets/css/main.css " type="text/css" media="screen" />
</head>
<body>

<section>

    <div id="aside">
        <h1><span>php</span>MyAdmin</h1>

        <ul class="databases">

            <div class="vertical-line">
                <li class="create-db"><span class="horizontal-line">--</span><i class="fas fa-database"></i>
                    <span id="create-db">Create Database</span>
                </li>
            </div>
			
			<?php foreach ($databases as $database => $item) : ?>

                <div class="vertical-line">
                    <li class="database-list" aria-expanded="false" data-base="<?= $item['Database']; ?>">
                        <i class="fas fa-plus-square db-name"></i><i class="fas fa-minus-square db-name"></i><span class="horizontal-line">-</span><i class="fas fa-database"></i>
                        <span class="db-name database"><?= $item['Database']; ?></span>

                        <div class="hide-line">
                            <ul class="tables-list"> </ul>
                        </div>
                    </li>
                </div>
			
			<?php endforeach; ?>

        </ul>
    </div>

    <div id="content">
        <div id="new-db">
            <form method="post">
                <label for="db-name">
                    <i class="fas fa-database"></i> Create Database
                </label> <br /><br />
                <input type="text" name="name" id="db-name" placeholder="Database name" required/>
                <select id="charsets" name="charsets" aria-expanded="false">
					<?php foreach ($chars as $char) : ?>
                        <option value="<?= $char ?>" class="charset">
							<?= $char ?>
                        </option>
					<?php endforeach; ?>
                </select>
                <button type="submit" id="db-submit">Create</button>
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
                <button type="submit" id="confirm-db-update">OK</button>
                <button type="button"  class="cancel-db-update">Cancel</button>
            </form>
        </div>
    </div>

</section>

<script src="<?php echo base_url() ?>assets/js/jquery.js"></script>
<script src="<?php echo base_url() ?>assets/js/main.js"></script>

</body>
</html>