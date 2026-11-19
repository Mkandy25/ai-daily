"""API minimale qui expose les actualités du flux RSS d’OpenAI."""

from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import List, Optional
from urllib.error import URLError
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


OPENAI_RSS_URL = "https://openai.com/news/rss.xml"
OPENAI_SOURCE_NAME = "OpenAI News"
FRONTEND_DIRECTORY = Path(__file__).resolve().parent.parent / "frontend"

app = FastAPI(title="AI Daily API", version="0.1.0")

# Autorise le frontend servi en local à appeler l’API pendant le développement.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


class Article(BaseModel):
    """Forme commune d’un article renvoyé par l’API."""

    title: str
    url: str
    source: str
    published_at: Optional[datetime] = None
    summary: Optional[str] = None


class SummaryTextParser(HTMLParser):
    """Récupère le texte brut d’un résumé qui peut contenir du HTML."""

    def __init__(self) -> None:
        super().__init__()
        self.parts: List[str] = []

    def handle_data(self, data: str) -> None:
        self.parts.append(data)


def clean_summary(markup: str) -> Optional[str]:
    """Convertit le résumé du flux en texte simple avant de le renvoyer."""
    parser = SummaryTextParser()
    parser.feed(unescape(markup))
    parser.close()

    summary = " ".join(" ".join(parser.parts).split())
    return summary or None


def parse_published_date(value: Optional[str]) -> Optional[datetime]:
    """Convertit la date RSS en date ISO compréhensible par l’API."""
    if not value:
        return None

    try:
        published_at = parsedate_to_datetime(value)
    except (TypeError, ValueError, OverflowError):
        return None

    # RSS peut parfois omettre le fuseau horaire ; dans ce cas, on utilise UTC.
    if published_at.tzinfo is None:
        published_at = published_at.replace(tzinfo=timezone.utc)

    return published_at


def parse_rss_feed(xml_content: bytes) -> List[Article]:
    """Transforme les éléments RSS en articles AI Daily."""
    root = ET.fromstring(xml_content)
    channel = root.find("channel")

    if channel is None:
        raise ValueError("Le flux RSS ne contient pas de canal.")

    articles: List[Article] = []

    for item in channel.findall("item"):
        title = (item.findtext("title") or "").strip()
        article_url = (item.findtext("link") or "").strip()

        # Sans titre ou lien original, l’entrée ne peut pas être affichée correctement.
        if not title or not article_url:
            continue

        description = item.findtext("description") or ""
        encoded_content = item.findtext(
            "{http://purl.org/rss/1.0/modules/content/}encoded"
        ) or ""
        summary = clean_summary(description or encoded_content)

        articles.append(
            Article(
                title=title,
                url=article_url,
                source=OPENAI_SOURCE_NAME,
                published_at=parse_published_date(item.findtext("pubDate")),
                summary=summary,
            )
        )

    # Le flux n’est pas toujours publié dans l’ordre chronologique.
    oldest_date = datetime.min.replace(tzinfo=timezone.utc)
    articles.sort(
        key=lambda article: article.published_at or oldest_date,
        reverse=True,
    )
    return articles


def fetch_openai_rss() -> bytes:
    """Télécharge le flux officiel avec un délai maximal d’attente."""
    request = Request(
        OPENAI_RSS_URL,
        headers={"User-Agent": "AI-Daily/0.1"},
    )

    with urlopen(request, timeout=15) as response:
        return response.read()


@app.get("/articles", response_model=List[Article])
def get_articles(
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=50),
) -> List[Article]:
    """Renvoie une page d’articles du flux OpenAI sous forme de JSON."""
    try:
        articles = parse_rss_feed(fetch_openai_rss())
        return articles[offset : offset + limit]
    except (URLError, TimeoutError) as error:
        raise HTTPException(
            status_code=502,
            detail="Impossible de récupérer le flux RSS d’OpenAI.",
        ) from error
    except (ET.ParseError, ValueError) as error:
        raise HTTPException(
            status_code=502,
            detail="Le flux reçu n’est pas un flux RSS valide.",
        ) from error


# Sert les pages et fichiers du frontend sur le même domaine que l’API en production.
# Cette route doit rester après les routes API pour que /articles garde la priorité.
app.mount(
    "/",
    StaticFiles(directory=FRONTEND_DIRECTORY, html=True),
    name="frontend",
)
