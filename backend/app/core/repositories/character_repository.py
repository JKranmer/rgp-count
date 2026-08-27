from abc import ABC, abstractmethod
from typing import List, Optional
from app.core.entities.character import Character


class CharacterRepository(ABC):
    @abstractmethod
    def save(self, character: Character) -> None:
        """Saves a character to the data source. Overwrites if already exists."""
        pass

    @abstractmethod
    def get_by_id(self, character_id: str) -> Optional[Character]:
        """Retrieves a character by their unique id. Returns None if not found."""
        pass

    @abstractmethod
    def get_all(self) -> List[Character]:
        """Retrieves all characters from the data source."""
        pass

    @abstractmethod
    def delete(self, character_id: str) -> None:
        """Deletes a character by their unique id."""
        pass
