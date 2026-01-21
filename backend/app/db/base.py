"""Database base configuration"""
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import all models here for Alembic autogenerate
from app.models.user import User  # noqa: F401
from app.models.notebook import Notebook  # noqa: F401
from app.models.material import Material  # noqa: F401
from app.models.chunk import Chunk  # noqa: F401
from app.models.conversation import Conversation, Message  # noqa: F401
from app.models.study import StudySession, StudyQuestion, StudyResponse  # noqa: F401
from app.models.experiment import Experiment, ExperimentEvent  # noqa: F401
