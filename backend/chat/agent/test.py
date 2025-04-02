import time

def stream_data():
    """
    This is function for testing purposes for streaming data (text and metadata) to client.
    """
    text = """Aby zainstalować certyfikat eduroam na komputerze z systemem Windows 10 lub Windows 11, wykonaj następujące kroki:

1. Pobierz certyfikat
Upewnij się, że masz certyfikat w formacie .p12, który jest wymagany do konfiguracji.

2. Instalacja certyfikatu
Importuj certyfikat: Kliknij dwukrotnie na pobrany plik certyfikatu.
Lokalizacja przechowywania: Pozostaw domyślną lokalizację (Bieżący użytkownik) i kliknij „Dalej”.
Hasło: Wprowadź hasło, które otrzymałeś podczas generowania certyfikatu. Pozostałe opcje importu pozostaw bez zmian.
Wybór magazynu certyfikatów: Pozostaw domyślne ustawienie (Automatycznie wybierz magazyn certyfikatów) i kliknij „Dalej”.
Zakończenie: Kliknij „Zakończ”.
Potwierdzenie: Potwierdź instalację certyfikatu głównego (jeśli wcześniej nie był zainstalowany) klikając „Tak”.
Komunikat o pomyślnym imporcie: Upewnij się, że pojawił się komunikat o pomyślnym imporcie certyfikatu.
3. Podłączenie do sieci eduroam
Ikona sieci: Kliknij lub dotknij ikony sieci bezprzewodowej w zasobniku systemowym.
Wybór eduroam: Wybierz sieć eduroam z listy dostępnych sieci.
Po wykonaniu tych kroków powinieneś być w stanie połączyć się z siecią eduroam. W razie problemów skontaktuj się z działem IT swojej uczelni.
""".split(" ")
    for i, word in enumerate(text):
        if i != 0:
            word = " " + word
        yield {"chunk": word}
        time.sleep(0.025)
    yield {"sources": [
        {"source": "https://google.com"},
        {"source": "https://github.com", "title": "Github"},
        {
            "source": "https://instrukcje.put.poznan.pl/konfiguracja-sieci-eduroam-na-urzadzeniach-z-systemem-windows-10/",
            "title": "Konfiguracja sieci eduroam na urządzeniach z systemem Windows 10/Windows 11 - Instrukcje"
        },
        {
            "source": "https://put.poznan.pl/historia-uczelni",
            "title": "Historia | Politechnika Poznańska"
        },
        {
            "source": "https://put.poznan.pl/artykul/nowy-rektorat-politechniki-poznanskiej-w-kampusie-warta-w-poznaniu",
            "title": "NOWY REKTORAT POLITECHNIKI POZNAŃSKIEJ W KAMPUSIE „WARTA” W POZNANIU | Politechnika Poznańska"
        },
        {"source": "https://github.com", "title": "Github"},
        {"source": "https://github.com", "title": "Github"},
        {"source": "https://github.com", "title": "Github"}
    ]}
