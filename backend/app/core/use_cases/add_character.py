from app.core.entities.character import Character
from app.core.repositories.character_repository import CharacterRepository


class AddCharacter:
    def __init__(self, repository: CharacterRepository):
        self._repository = repository

    def execute(self, name: str, character_type: str, max_hp: int, current_hp: int, order: int) -> Character:
        character = Character(
            name=name,
            character_type=character_type,
            max_hp=max_hp,
            current_hp=current_hp,
            order=order
        )
        self._repository.save(character)
        return character
