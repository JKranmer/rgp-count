import unittest
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.main import app, repository


class TestCharacterAPI(unittest.TestCase):
    def setUp(self):
        # Configure a temporary file path for the repository during integration tests
        self.test_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'temp_api_characters.json'))
        if os.path.exists(self.test_file_path):
            os.remove(self.test_file_path)
            
        # Monkey-patch the repository path
        self.original_file_path = repository._file_path
        repository._file_path = self.test_file_path
        repository._ensure_file_exists()

        self.client = app.test_client()
        app.config['TESTING'] = True

    def tearDown(self):
        # Restore the original file path and remove temp file
        repository._file_path = self.original_file_path
        if os.path.exists(self.test_file_path):
            os.remove(self.test_file_path)

    def test_add_character_route(self):
        payload = {
            "name": "Gandalf",
            "character_type": "player",
            "max_hp": 80,
            "current_hp": 80,
            "order": 20
        }
        response = self.client.post('/api/characters', 
                                    data=json.dumps(payload), 
                                    content_type='application/json')
        
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data["name"], "Gandalf")
        self.assertEqual(data["current_hp"], 80)
        self.assertIsNotNone(data["id"])

    def test_add_character_missing_fields(self):
        payload = {
            "name": "Gandalf",
            "character_type": "player"
        }
        response = self.client.post('/api/characters', 
                                    data=json.dumps(payload), 
                                    content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data.decode('utf-8'))
        self.assertIn("Missing required fields", data["error"])

    def test_list_characters_route(self):
        self.client.post('/api/characters', 
                         data=json.dumps({"name": "Gimli", "character_type": "player", "max_hp": 50, "current_hp": 50, "order": 8}), 
                         content_type='application/json')
        self.client.post('/api/characters', 
                         data=json.dumps({"name": "Legolas", "character_type": "player", "max_hp": 40, "current_hp": 40, "order": 18}), 
                         content_type='application/json')

        response = self.client.get('/api/characters')
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(len(data), 2)
        # Verify initiative sorting (Legolas initiative 18 > Gimli initiative 8)
        self.assertEqual(data[0]["name"], "Legolas")
        self.assertEqual(data[1]["name"], "Gimli")

    def test_delete_character_route(self):
        # Create character first to get its ID
        add_response = self.client.post('/api/characters', 
                                        data=json.dumps({"name": "Boromir", "character_type": "player", "max_hp": 45, "current_hp": 45, "order": 10}), 
                                        content_type='application/json')
        char_data = json.loads(add_response.data.decode('utf-8'))
        character_id = char_data["id"]

        # Delete by ID
        response = self.client.delete(f'/api/characters/{character_id}')
        self.assertEqual(response.status_code, 200)

        # Get request should now return empty list
        get_resp = self.client.get('/api/characters')
        data = json.loads(get_resp.data.decode('utf-8'))
        self.assertEqual(len(data), 0)

    def test_delete_non_existent_character_route(self):
        response = self.client.delete('/api/characters/non-existent-id')
        self.assertEqual(response.status_code, 404)

    def test_damage_character_route(self):
        # Create character
        add_response = self.client.post('/api/characters', 
                                        data=json.dumps({"name": "Frodo", "character_type": "player", "max_hp": 30, "current_hp": 30, "order": 12}), 
                                        content_type='application/json')
        char_data = json.loads(add_response.data.decode('utf-8'))
        character_id = char_data["id"]

        response = self.client.post(f'/api/characters/{character_id}/damage', 
                                    data=json.dumps({"amount": 10}), 
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data["current_hp"], 20)

    def test_heal_character_route(self):
        # Create character
        add_response = self.client.post('/api/characters', 
                                        data=json.dumps({"name": "Sam", "character_type": "player", "max_hp": 35, "current_hp": 15, "order": 10}), 
                                        content_type='application/json')
        char_data = json.loads(add_response.data.decode('utf-8'))
        character_id = char_data["id"]

        response = self.client.post(f'/api/characters/{character_id}/heal', 
                                    data=json.dumps({"amount": 10}), 
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data["current_hp"], 25)

    def test_update_order_route(self):
        # Create character
        add_response = self.client.post('/api/characters', 
                                        data=json.dumps({"name": "Merry", "character_type": "player", "max_hp": 25, "current_hp": 25, "order": 5}), 
                                        content_type='application/json')
        char_data = json.loads(add_response.data.decode('utf-8'))
        character_id = char_data["id"]

        response = self.client.patch(f'/api/characters/{character_id}/order', 
                                     data=json.dumps({"order": 12}), 
                                     content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode('utf-8'))
        self.assertEqual(data["order"], 12)


if __name__ == '__main__':
    unittest.main()
