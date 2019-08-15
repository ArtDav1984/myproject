<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Fields_controller extends CI_Controller
{
	public function __construct()
	{
		parent::__construct();
		$this->load->model('Fields');
	}

	public function index()
	{
		if ($this->input->is_ajax_request()){
			$table_name = $this->input->get_request_header('table');
			$db_name    = $this->input->get_request_header('dbName');

			if ($table_name && $db_name) {
				$columns = $this->Fields->getTableColumns($table_name, $db_name);
				if (!is_null($columns)) {
					$fields = $this->Fields->getTableFields($db_name, $table_name);
					if (!is_null($fields)) {
						echo json_encode(['column' => $columns, 'field' => $fields, 'type' => 'success']);
					} else {
						echo json_encode(['column' => $columns, 'type' => 'success']);
					}
				} else {
					echo json_encode(['type' => 'fail']);
				}
			}
		}
	}
}
