import unittest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.entities.character import Character
from app.adapters.repositories.json_character_repository import JsonCharacterRepository


class TestJsonCharacterRepository(unittest.TestCase):
    def setUp(self):
        self.test_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'temp_characters.json'))
        # Ensure clean slate
        if os.path.exists(self.test_file_path):
            os.remove(self.test_file_path)
        self.repository = JsonCharacterRepository(self.test_file_path)

    def tearDown(self):
        if os.path.exists(self.test_file_path):
            os.remove(self.test_file_path)

    def test_save_and_get_character(self):
        char = Character(name="Legolas", character_type="player", max_hp=40, current_hp=40, order=18)
        self.repository.save(char)

        retrieved = self.repository.get_by_id(char.id)
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.id, char.id)
        self.assertEqual(retrieved.name, "Legolas")
        self.assertEqual(retrieved.max_hp, 40)
        self.assertEqual(retrieved.current_hp, 40)
        self.assertEqual(retrieved.order, 18)

    def test_get_non_existent_character_returns_none(self):
        retrieved = self.repository.get_by_id("non-existent-id")
        self.assertIsNone(retrieved)

    def test_get_all_characters(self):
        char1 = Character(name="Gimli", character_type="player", max_hp=50, current_hp=50, order=8)
        char2 = Character(name="Aragorn", character_type="player", max_hp=60, current_hp=60, order=12)
        
        self.repository.save(char1)
        self.repository.save(char2)

        characters = self.repository.get_all()
        self.assertEqual(len(characters), 2)
        
        ids = [c.id for c in characters]
        self.assertIn(char1.id, ids)
        self.assertIn(char2.id, ids)

    def test_delete_character(self):
        char = Character(name="Boromir", character_type="player", max_hp=45, current_hp=45, order=10)
        self.repository.save(char)
        self.assertIsNotNone(self.repository.get_by_id(char.id))

        self.repository.delete(char.id)
        self.assertIsNone(self.repository.get_by_id(char.id))


if __name__ == '__main__':
    unittest.main()
