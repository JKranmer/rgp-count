from typing import List
from app.core.entities.character import Character
from app.core.repositories.character_repository import CharacterRepository


class ListCharactersByOrder:
    def __init__(self, repository: CharacterRepository):
        self._repository = repository

    def execute(self) -> List[Character]:
        characters = self._repository.get_all()
        # Sort characters by 'order' in descending order (highest initiative first)
        # In case of ties, we can sub-sort by name alphabetically
        return sorted(characters, key=lambda c: (-c.order, c.name.lower()))
