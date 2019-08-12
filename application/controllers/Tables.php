<?php
	
	class Tables extends CI_Controller
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->model('TableName');
		}
		
		public function index()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->get_request_header('dbName');
				if ($db_name) {
					$tables = $this->TableName->getTablesName($db_name);
					if (!is_null($tables)) {
						echo json_encode(['data' => $tables, 'type' => 'success']);
					} else {
						echo json_encode(['type' => 'fail']);
					}
				}
			}
		}
		
		public function column()
		{
			if ($this->input->is_ajax_request()){
				$table_name = $this->input->get_request_header('table');
				$db_name    = $this->input->get_request_header('dbName');
				
				if ($table_name && $db_name) {
					$columns = $this->TableName->getTablesColumn($table_name, $db_name);
					if (!is_null($columns)) {
						echo json_encode(['data' => $columns, 'type' => 'success']);
					} else {
						echo json_encode(['type' => 'fail']);
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
					$fields = $this->TableName->getTableStructure($db_name, $table_name);
					if (!is_null($fields)){
						echo json_encode(['data' => $fields, 'type' => 'success']);
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
					$create = $this->TableName->createTable($db_name, $table_name, $number_column, $data_fields);
					if ($create){
						$fields = $this->TableName->getTableStructure($db_name, $table_name);
						if (!is_null($fields)){
							echo json_encode(['data' => $fields, 'type' => 'success']);
						} else {
							echo json_encode(['type' => 'fail']);
						}
					}
				}
			}
		}
	}