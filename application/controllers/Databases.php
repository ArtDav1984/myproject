<?php
	
	defined('BASEPATH') OR exit('No direct script access allowed');
	
	class Databases extends CI_Controller
	{
		public function __construct()
		{
			parent::__construct();
			
			//load the model
			$this->load->model('DbName');
		}

		public function index()
		{
			$databases = $this->DbName->getDatabasesNames();
			$chars = $this->DbName->getCharacterSet();
			$this->load->view('welcome_message', compact('databases', 'chars'));
		}
		
		public function chars()
		{
			if ($this->input->is_ajax_request()) {
				if ($this->input->get_request_header('getCharsList')) {
					$chars = $this->DbName->getCharacterSet();
					echo json_encode(['data' => $chars, 'type' => 'success']);
				} else {
					echo json_encode(['data' => null, 'type' => 'fail']);
				}
			}
		}
		
		public function create()
		{
			if ($this->input->is_ajax_request()) {
				$db_name = $this->input->post('name');
				$char_name = $this->input->post('charsets');

				if (isset($db_name) && isset($char_name)) {
					$database = $this->DbName->createDatabase($db_name, $char_name);
					echo json_encode(['data' => $database, 'type' => 'success']);
				} else {
					echo json_encode(['data' => 'null', 'type' => 'fail']);
				}
			}
		}
	}
