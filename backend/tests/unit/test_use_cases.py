import unittest
import os
import sys
from typing import List, Optional

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.entities.character import Character
from app.core.repositories.character_repository import CharacterRepository
from app.core.use_cases.add_character import AddCharacter
from app.core.use_cases.list_characters_by_order import ListCharactersByOrder
from app.core.use_cases.delete_character import DeleteCharacter
from app.core.use_cases.damage_character import DamageCharacter
from app.core.use_cases.heal_character import HealCharacter
from app.core.use_cases.update_character_order import UpdateCharacterOrder


class MockCharacterRepository(CharacterRepository):
    def __init__(self):
        self.characters = {}

    def save(self, character: Character) -> None:
        # Create a deep copy clone via serialization to mimic real repository detachment
        self.characters[character.id] = Character.from_dict(character.to_dict())

    def get_by_id(self, character_id: str) -> Optional[Character]:
        char = self.characters.get(character_id)
        if char:
            return Character.from_dict(char.to_dict())
        return None

    def get_all(self) -> List[Character]:
        return [Character.from_dict(c.to_dict()) for c in self.characters.values()]

    def delete(self, character_id: str) -> None:
        if character_id in self.characters:
            del self.characters[character_id]


class TestUseCases(unittest.TestCase):
    def setUp(self):
        self.repository = MockCharacterRepository()
        self.add_character_use_case = AddCharacter(self.repository)
        self.list_characters_use_case = ListCharactersByOrder(self.repository)
        self.delete_character_use_case = DeleteCharacter(self.repository)
        self.damage_character_use_case = DamageCharacter(self.repository)
        self.heal_character_use_case = HealCharacter(self.repository)
        self.update_order_use_case = UpdateCharacterOrder(self.repository)

    def test_add_character_success(self):
        char = self.add_character_use_case.execute(
            name="Aragorn",
            character_type="player",
            max_hp=50,
            current_hp=50,
            order=15
        )
        self.assertEqual(char.name, "Aragorn")
        self.assertIsNotNone(char.id)
        
        repo_char = self.repository.get_by_id(char.id)
        self.assertIsNotNone(repo_char)
        self.assertEqual(repo_char.name, "Aragorn")

    def test_add_characters_with_duplicate_names_success(self):
        # Unique IDs allow duplicate names (e.g. minion spawning)
        char1 = self.add_character_use_case.execute(
            name="Goblin",
            character_type="enemy",
            max_hp=15,
            current_hp=15,
            order=10
        )
        char2 = self.add_character_use_case.execute(
            name="Goblin",
            character_type="enemy",
            max_hp=15,
            current_hp=15,
            order=12
        )
        
        self.assertNotEqual(char1.id, char2.id)
        self.assertEqual(len(self.repository.get_all()), 2)

    def test_list_characters_by_initiative_order(self):
        gimli = self.add_character_use_case.execute(name="Gimli", character_type="player", max_hp=50, current_hp=50, order=8)
        legolas = self.add_character_use_case.execute(name="Legolas", character_type="player", max_hp=40, current_hp=40, order=18)
        aragorn = self.add_character_use_case.execute(name="Aragorn", character_type="player", max_hp=60, current_hp=60, order=15)
        orc = self.add_character_use_case.execute(name="Orc", character_type="enemy", max_hp=15, current_hp=15, order=15)

        sorted_chars = self.list_characters_use_case.execute()
        
        self.assertEqual(len(sorted_chars), 4)
        self.assertEqual(sorted_chars[0].id, legolas.id)
        self.assertEqual(sorted_chars[1].id, aragorn.id)
        self.assertEqual(sorted_chars[2].id, orc.id)
        self.assertEqual(sorted_chars[3].id, gimli.id)

    def test_delete_character_success(self):
        char = self.add_character_use_case.execute(name="Boromir", character_type="player", max_hp=40, current_hp=40, order=10)
        self.assertIsNotNone(self.repository.get_by_id(char.id))
        
        self.delete_character_use_case.execute(char.id)
        self.assertIsNone(self.repository.get_by_id(char.id))

    def test_delete_non_existent_character_raises_error(self):
        with self.assertRaises(ValueError):
            self.delete_character_use_case.execute("non-existent-id")

    def test_damage_character_success(self):
        char = self.add_character_use_case.execute(name="Frodo", character_type="player", max_hp=30, current_hp=30, order=12)
        
        updated = self.damage_character_use_case.execute(char.id, 10)
        self.assertEqual(updated.current_hp, 20)
        
        # Verify in repository
        repo_char = self.repository.get_by_id(char.id)
        self.assertEqual(repo_char.current_hp, 20)

    def test_damage_non_existent_character_raises_error(self):
        with self.assertRaises(ValueError):
            self.damage_character_use_case.execute("non-existent-id", 10)

    def test_heal_character_success(self):
        char = self.add_character_use_case.execute(name="Sam", character_type="player", max_hp=35, current_hp=15, order=10)
        
        updated = self.heal_character_use_case.execute(char.id, 10)
        self.assertEqual(updated.current_hp, 25)
        
        # Verify in repository
        repo_char = self.repository.get_by_id(char.id)
        self.assertEqual(repo_char.current_hp, 25)

    def test_heal_non_existent_character_raises_error(self):
        with self.assertRaises(ValueError):
            self.heal_character_use_case.execute("non-existent-id", 10)

    def test_update_character_order_success(self):
        char = self.add_character_use_case.execute(name="Merry", character_type="player", max_hp=25, current_hp=25, order=5)
        
        updated = self.update_order_use_case.execute(char.id, 14)
        self.assertEqual(updated.order, 14)
        
        # Verify in repository
        repo_char = self.repository.get_by_id(char.id)
        self.assertEqual(repo_char.order, 14)

    def test_update_order_non_existent_character_raises_error(self):
        with self.assertRaises(ValueError):
            self.update_order_use_case.execute("non-existent-id", 10)


if __name__ == '__main__':
    unittest.main()
