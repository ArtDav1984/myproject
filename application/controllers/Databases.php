<?php
	
	defined('BASEPATH') OR exit('No direct script access allowed');
	
	class Databases extends CI_Controller
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->model('DbName');
		}
		
		public function index()
		{
			$databases = $this->DbName->getDatabasesNames();
			$chars = $this->DbName->getCharacterSet();
			$this->load->view('welcome_message', compact('databases', 'chars'));
		}
		
		public function create()
		{
			if ($this->input->is_ajax_request()) {
				$db_name   = $this->input->post('name');
				$char_name = $this->input->post('charsets');
				if (isset($db_name) && isset($char_name)) {
					$database = $this->DbName->createDatabase($db_name, $char_name);
					echo json_encode(['data' => $database, 'type' => 'success']);
				} else {
					echo json_encode(['data' => 'null', 'type' => 'fail']);
				}
			}
		}
		
		public function update()
		{
			if ($this->input->is_ajax_request()) {
				$new_db_name = $this->input->post('newDbName');
				$current_db_name = $this->input->post('dbName');
				
				if(isset($new_db_name) && isset($current_db_name)) {
					$database = $this->DbName->updateDatabase($new_db_name, $current_db_name);
					echo json_encode(['data' => $database, 'type' => 'success']);
				}  else {
					echo json_encode(['data' => 'null', 'type' => 'fail']);
				}
			}
		}
		
		public function delete()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->post('dbName');
				
				if(isset($db_name)) {
					if ($this->DbName->deleteDatabase($db_name)){
						echo json_encode(['type' => 'success']);
					}
				} else {
					echo json_encode(['data' => null, 'type' => 'fail']);
				}
			}
		}
	}