import uuid
from typing import Optional


class Character:
    def __init__(self, name: str, character_type: str, max_hp: int, current_hp: int, order: int, character_id: Optional[str] = None):
        self.validate_name(name)
        self.validate_max_hp(max_hp)
        
        self._id = character_id or str(uuid.uuid4())
        self._name = name
        self._character_type = character_type
        self._max_hp = max_hp
        self.set_current_hp(current_hp)
        self._order = order

    @property
    def id(self) -> str:
        return self._id

    @property
    def name(self) -> str:
        return self._name

    @property
    def character_type(self) -> str:
        return self._character_type

    @property
    def max_hp(self) -> int:
        return self._max_hp

    @property
    def current_hp(self) -> int:
        return self._current_hp

    @property
    def order(self) -> int:
        return self._order

    @order.setter
    def order(self, value: int):
        self._order = value

    def set_current_hp(self, value: int):
        if value < 0:
            self._current_hp = 0
        elif value > self._max_hp:
            self._current_hp = self._max_hp
        else:
            self._current_hp = value

    def take_damage(self, amount: int):
        if amount < 0:
            raise ValueError("Damage amount cannot be negative")
        self.set_current_hp(self._current_hp - amount)

    def heal(self, amount: int):
        if amount < 0:
            raise ValueError("Heal amount cannot be negative")
        self.set_current_hp(self._current_hp + amount)

    @staticmethod
    def validate_name(name: str):
        if not name or not name.strip():
            raise ValueError("Character name cannot be empty")

    @staticmethod
    def validate_max_hp(max_hp: int):
        if max_hp <= 0:
            raise ValueError("Max HP must be greater than zero")

    def to_dict(self) -> dict:
        return {
            "id": self._id,
            "name": self._name,
            "character_type": self._character_type,
            "max_hp": self._max_hp,
            "current_hp": self._current_hp,
            "order": self._order
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'Character':
        return cls(
            character_id=data.get("id"),
            name=data["name"],
            character_type=data["character_type"],
            max_hp=data["max_hp"],
            current_hp=data["current_hp"],
            order=data["order"]
        )
