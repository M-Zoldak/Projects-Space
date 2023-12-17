import FluidText from "../../components/Text/FluidText";
import PortalLayout from "../../layouts/PortalLayout";

function About() {
  return (
    <PortalLayout activePage="About" title="About Page">
      <h2>O projekcie</h2>
      <h3>Zarys aplikacji</h3>
      <FluidText>
        Projects Space to aplikacja, która została stworzona z myślą o modelu
        subskrypcyjnym, oferując zarówno bezpłatne korzystanie, jak i dodatkowe
        funkcje dostępne w ramach subskrypcji.
      </FluidText>
      <FluidText>
        Główne zadania aplikacji, to pomoc w zarządzaniu projektami, oraz
        odnalezieniu się w codziennej pracy z wieloma klientami, posiadające
        różne serwisy WWW, oraz różnorodne projekty.
      </FluidText>
      <FluidText>
        Serwis będzie przydatny zarówno dla firm jak i freelancerów, którzy
        pragną obsługiwać swoich klientów w należyty sposób, bądź ułatwić
        komunikację z klientem, poprzez dzielenie wspólnej przestrzeni
        projektowej.
      </FluidText>
      <h3>Główne moduły</h3>
      <FluidText>
        W zamyśle mają być to osobno włączane oraz zarządzane podzespoły, dzięki
        którym użytkownik sam może decydować, jakich narzędzi serwisu
        potrzebuje, oraz dopasować możliwości podglądu/edycji jedynie do osób
        dla tego przeznaczonych.
      </FluidText>
      <h4>Spaces</h4>
      <FluidText>
        Serce aplikacji - miejsce w którym dopasowujemy wszystkie ustawiania,
        które pomogą nam w realizacji naszego projektu. To z tego miejsca
        zapraszamy inne osoby do wspólnej kolaboracji w zamkniętym pomieszczeniu
        roboczym, dostępnym tylko dla zaproszonych przez nas osób.
      </FluidText>
      <h4>Projekty</h4>
      <FluidText>
        Serce aplikacji 2 - miejsce w którym możemy śledzić nasze projekty oraz
        postępy prac nad poszczególnymi zadaniami.
      </FluidText>
      <h4>Klienci</h4>
      <FluidText>
        Spis klientów, kontaktów oraz innych danych pomagających w realizacji
        zadań związanych z obsługą klienta.
      </FluidText>
      <h4>Strony internetowe</h4>
      <FluidText>Spis obsługiwanych przez nas witryn.</FluidText>
    </PortalLayout>
  );
}

export default About;
