<?php
	
	class Tables extends CI_Controller
	{
		public function __construct()
		{
			parent::__construct();
			
			//load the model
			$this->load->model('TableName');
		}
		
		public function index()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->get_request_header('dbName');
				if ($db_name) {
					$tables = $this->TableName->getTablesName($db_name);
					echo json_encode(['data' => $tables, 'type' => 'success']);
				} else {
					echo json_encode(['data' => null, 'type' => 'fail']);
				}
			}
		}
		
		public function column()
		{
			if ($this->input->is_ajax_request()) {
				$table_name = $this->input->get_request_header('table');
				$db_name = $this->input->get_request_header('databaseName');

				if ($table_name && $db_name) {
					$columns = $this->TableName->getTablesColumn($table_name, $db_name);
					echo json_encode(['data' => $columns, 'type' => 'success']);
				} else {
					echo json_encode(['data' => null, 'type' => 'fail']);
				}
			}
		}
	}
