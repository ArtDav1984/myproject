<?php
	
	defined('BASEPATH') OR exit('No direct script access allowed');
	
	class Databases_controller extends CI_Controller
	{
		public function __construct()
		{
			parent::__construct();
			$this->load->model('Databases');
		}
		
		public function index()
		{
			$databases = $this->Databases->getDatabasesNames();
			$chars = $this->Databases->getCharacterSet();
			$this->load->view('welcome_message', compact('databases', 'chars'));
		}
		
		public function create()
		{
			if ($this->input->is_ajax_request()) {
				$db_name   = $this->input->post('name');
				$char_name = $this->input->post('charsets');
				if (isset($db_name) && isset($char_name)) {
					$database = $this->Databases->createDatabase($db_name, $char_name);
					if (!is_null($database)) {
						echo json_encode(['data' => $database, 'type' => 'success']);
					} else {
						echo json_encode(['type' => 'fail']);
					}
				}
			}
		}
		
		public function update()
		{
			if ($this->input->is_ajax_request()) {
				$new_db_name = $this->input->post('newDbName');
				$current_db_name = $this->input->post('dbName');
				
				if(isset($new_db_name) && isset($current_db_name)) {
					$database = $this->Databases->updateDatabase($new_db_name, $current_db_name);
					if (!is_null($database)) {
						echo json_encode(['data' => $database, 'type' => 'success']);
					} else {
						echo json_encode(['type' => 'fail']);
					}
				}
			}
		}
		
		public function delete()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->get_request_header('dbName');
				
				if(isset($db_name)) {
					if ($this->Databases->deleteDatabase($db_name)){
						echo json_encode(['type' => 'success']);
					} else {
						echo json_encode(['type' => 'fail']);
					}
				}
			}
		}
	}