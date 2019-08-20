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
		
		public function delete()
		{
			if ($this->input->is_ajax_request()) {
				$id=$this->uri->segment(3);
				$table_name = $this->input->get_request_header('tableName');
				$db_name    = $this->input->get_request_header('dbName');
				
				if ($db_name && $table_name && $id) {
					if ($this->Fields->deleteTableFields($table_name, $db_name, $id)){
						echo json_encode(['type' => 'success']);
					} else {
						echo json_encode(['type' => 'fail']);
					}
				}
			}
		}
		
		public function data()
		{
			if ($this->input->is_ajax_request()) {
				$table_name = $this->input->get_request_header('tableName');
				$db_name    = $this->input->get_request_header('dbName');
				
				if ($db_name && $table_name) {
				   $fields = $this->Fields->getTableStructure($table_name, $db_name);
				   if (!is_null($fields)) {
				   	  echo json_encode(['data' => $fields, 'type' => 'success']);
				   } else {
				   	  echo json_encode(['type' => 'fail']);
				   }
				}
			}
		}
		
		public function insert()
		{
			if ($this->input->is_ajax_request()) {
				$table_name = $this->input->post('tableName');
				$db_name    = $this->input->post('dbName');
				$insert_data = $this->input->post('insertData');
				
				if (isset($db_name) && isset($table_name) && isset($insert_data)) {
					if ($this->Fields->insertData($db_name, $table_name, $insert_data)) {
						echo json_encode(['type' => 'success']);
					} else {
						echo json_encode(['type' => 'fail']);
					}
				}
			}
		}
	}