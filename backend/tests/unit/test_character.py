import unittest
import sys
import os

# Add backend directory to path so imports work correctly during tests
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.core.entities.character import Character


class TestCharacter(unittest.TestCase):
    def test_create_valid_character(self):
        char = Character(name="Aragorn", character_type="player", max_hp=50, current_hp=50, order=15)
        self.assertEqual(char.name, "Aragorn")
        self.assertEqual(char.character_type, "player")
        self.assertEqual(char.max_hp, 50)
        self.assertEqual(char.current_hp, 50)
        self.assertEqual(char.order, 15)
        self.assertIsNotNone(char.id)
        self.assertTrue(len(char.id) > 0)

    def test_create_character_with_explicit_id(self):
        char = Character(name="Legolas", character_type="player", max_hp=40, current_hp=40, order=18, character_id="custom-id-123")
        self.assertEqual(char.id, "custom-id-123")

    def test_create_character_empty_name_raises_error(self):
        with self.assertRaises(ValueError):
            Character(name="", character_type="player", max_hp=50, current_hp=50, order=15)
        with self.assertRaises(ValueError):
            Character(name="   ", character_type="player", max_hp=50, current_hp=50, order=15)

    def test_create_character_invalid_max_hp_raises_error(self):
        with self.assertRaises(ValueError):
            Character(name="Legolas", character_type="player", max_hp=0, current_hp=0, order=10)
        with self.assertRaises(ValueError):
            Character(name="Legolas", character_type="player", max_hp=-10, current_hp=0, order=10)

    def test_current_hp_caps_at_max_hp(self):
        char = Character(name="Gimli", character_type="player", max_hp=60, current_hp=100, order=8)
        self.assertEqual(char.current_hp, 60)

    def test_current_hp_cannot_be_negative(self):
        char = Character(name="Gimli", character_type="player", max_hp=60, current_hp=-5, order=8)
        self.assertEqual(char.current_hp, 0)

    def test_take_damage(self):
        char = Character(name="Gimli", character_type="player", max_hp=60, current_hp=60, order=8)
        char.take_damage(20)
        self.assertEqual(char.current_hp, 40)

    def test_take_damage_cannot_go_below_zero(self):
        char = Character(name="Gimli", character_type="player", max_hp=60, current_hp=60, order=8)
        char.take_damage(100)
        self.assertEqual(char.current_hp, 0)

    def test_take_damage_negative_value_raises_error(self):
        char = Character(name="Gimli", character_type="player", max_hp=60, current_hp=60, order=8)
        with self.assertRaises(ValueError):
            char.take_damage(-10)

    def test_heal(self):
        char = Character(name="Gimli", character_type="player", max_hp=60, current_hp=30, order=8)
        char.heal(20)
        self.assertEqual(char.current_hp, 50)

    def test_heal_cannot_exceed_max_hp(self):
        char = Character(name="Gimli", character_type="player", max_hp=60, current_hp=30, order=8)
        char.heal(100)
        self.assertEqual(char.current_hp, 60)

    def test_heal_negative_value_raises_error(self):
        char = Character(name="Gimli", character_type="player", max_hp=60, current_hp=30, order=8)
        with self.assertRaises(ValueError):
            char.heal(-10)

    def test_to_dict_and_from_dict(self):
        original = Character(name="Gandalf", character_type="player", max_hp=80, current_hp=80, order=20, character_id="uuid-456")
        data = original.to_dict()
        cloned = Character.from_dict(data)
        
        self.assertEqual(cloned.id, original.id)
        self.assertEqual(cloned.name, original.name)
        self.assertEqual(cloned.character_type, original.character_type)
        self.assertEqual(cloned.max_hp, original.max_hp)
        self.assertEqual(cloned.current_hp, original.current_hp)
        self.assertEqual(cloned.order, original.order)


if __name__ == '__main__':
    unittest.main()
