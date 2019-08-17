<?php
	
	defined('BASEPATH') OR exit('No direct script access allowed');
	
	class Tables_controller extends CI_Controller
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->model('Tables');
		}
		
		public function index()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->get_request_header('dbName');
				if ($db_name) {
					$tables = $this->Tables->getTablesName($db_name);
					if (!is_null($tables)) {
						echo json_encode(['data' => $tables, 'type' => 'success']);
					} else {
						echo json_encode(['type' => 'fail']);
					}
				}
			}
		}
		
		public function create()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->post('dbName');
				$table_name = $this->input->post('tableName');
				$number_column = $this->input->post('numberColumn');
				$data_fields = $this->input->post('dataFields');
				
				if (isset($db_name) && isset($table_name) && isset($number_column) && isset($data_fields)) {
					$create = $this->Tables->createTable($db_name, $table_name, $number_column, $data_fields);
					if ($create){
						$fields = $this->Tables->getTableStructure($db_name, $table_name);
						if (!is_null($fields)){
							echo json_encode(['data' => $fields, 'type' => 'success']);
						} else {
							echo json_encode(['type' => 'fail']);
						}
					}
				}
			}
		}
		
		public function update()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->post('dbName');
				$table_name = $this->input->post('tableName');
				$newTable_name = $this->input->post('newTblName');
				
				if (isset($newTable_name) && isset($table_name)) {
					if ($this->Tables->updateTable($db_name, $table_name, $newTable_name)){
						echo json_encode(['type' => 'success']);
					}
				}
			}
		}
		
		public function delete()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->get_request_header('dbName');
				$table_name = $this->input->get_request_header('tableName');
				
				if(isset($db_name) && isset($table_name)) {
					if ($this->Tables->deleteTable($db_name, $table_name)){
						echo json_encode(['type' => 'success']);
					}
				}
			}
		}
		
		public function truncate()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->get_request_header('dbName');
				$table_name = $this->input->get_request_header('tableName');
				
				if(isset($db_name) && isset($table_name)) {
					if ($this->Tables->truncateTable($db_name, $table_name)){
						echo json_encode(['type' => 'success']);
					}
				}
			}
		}
		public function structure()
		{
			if ($this->input->is_ajax_request()){
				$db_name = $this->input->get_request_header('dbName');
				$table_name = $this->input->get_request_header('tableName');
				if ($db_name && $table_name) {
					$fields = $this->Tables->getTableStructure($db_name, $table_name);
					if (!is_null($fields)){
						echo json_encode(['data' => $fields, 'type' => 'success']);
					} else {
						echo json_encode(['type' => 'fail']);
					}
				}
			}
		}
	}